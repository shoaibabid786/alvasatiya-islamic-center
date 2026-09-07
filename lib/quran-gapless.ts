import { getAudioSources, nextAyahPosition } from "@/lib/quran";

export type AyahRef = { surah: number; ayah: number };

type PlayerHandlers = {
  onAyah: (ref: AyahRef) => void;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onTime: (time: number, duration: number) => void;
  onError: (message: string) => void;
};

type Clip = {
  ref: AyahRef;
  buffer: AudioBuffer;
  source: AudioBufferSourceNode;
  startCtx: number;
  offset: number;
};

function cacheKey(reciter: string, ref: AyahRef) {
  return `${reciter}:${ref.surah}:${ref.ayah}`;
}

function audioUrls(surah: number, ayah: number, reciter: string) {
  const sources = getAudioSources(surah, ayah, reciter);
  const preferred = [...sources].sort((a, b) => Number(b.includes("everyayah.com")) - Number(a.includes("everyayah.com")));
  return [...preferred, ...preferred.map((src) => `/api/quran/audio?src=${encodeURIComponent(src)}`)];
}

function trimSilence(ctx: AudioContext, buffer: AudioBuffer) {
  const samples = buffer.getChannelData(0);
  const threshold = 0.02;
  let start = 0;
  let end = samples.length - 1;
  while (start < end && Math.abs(samples[start]) < threshold) start += 1;
  while (end > start && Math.abs(samples[end]) < threshold) end -= 1;
  const pad = Math.floor(buffer.sampleRate * 0.012);
  start = Math.max(0, start - pad);
  end = Math.min(samples.length - 1, end + pad);
  const frames = end - start + 1;
  if (frames < buffer.sampleRate * 0.2 || frames > buffer.length - buffer.sampleRate * 0.03) return buffer;
  const trimmed = ctx.createBuffer(buffer.numberOfChannels, frames, buffer.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    trimmed.getChannelData(channel).set(buffer.getChannelData(channel).subarray(start, end + 1));
  }
  return trimmed;
}

export class GaplessQuranPlayer {
  private handlers: PlayerHandlers;
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private current: Clip | null = null;
  private upcoming: Clip | null = null;
  private reciter = "ar.alafasy";
  private speed = 1;
  private volume = 1;
  private repeat = false;
  private gen = 0;
  private raf = 0;
  private cache = new Map<string, AudioBuffer>();
  private running = false;

  constructor(handlers: PlayerHandlers) {
    this.handlers = handlers;
  }

  setReciter(reciter: string) {
    this.reciter = reciter;
  }

  setRepeat(repeat: boolean) {
    this.repeat = repeat;
    if (!this.current || !this.running) return;
    if (repeat) {
      this.scheduleNext(this.current.ref, this.current.buffer);
      return;
    }
    this.prefetch(this.current.ref, this.gen);
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.gain) this.gain.gain.value = volume;
  }

  setSpeed(speed: number) {
    if (this.current && this.ctx) {
      const time = this.currentTime();
      this.speed = speed;
      this.current.offset = time;
      this.current.startCtx = this.ctx.currentTime;
      this.current.source.playbackRate.value = speed;
    } else {
      this.speed = speed;
    }
    if (this.upcoming) this.scheduleNext(this.upcoming.ref, this.upcoming.buffer);
  }

  isRunning() {
    return this.running && this.ctx?.state === "running";
  }

  async play(ref: AyahRef, offset = 0) {
    this.gen += 1;
    const gen = this.gen;
    try {
      await this.ensure();
      this.stopSources();
      this.running = true;
      const next = this.repeat ? null : nextAyahPosition(ref.surah, ref.ayah);
      const nextPromise = next ? this.load(next, gen).catch(() => null) : Promise.resolve(null);
      const buffer = await this.load(ref, gen);
      if (gen !== this.gen) return;
      this.startClip(ref, buffer, offset, this.ctx!.currentTime);
      this.handlers.onPlay();
      this.tick();
      if (this.repeat) {
        this.scheduleNext(ref, buffer);
        return;
      }
      const nextBuffer = await nextPromise;
      if (gen !== this.gen || !this.current || !next || !nextBuffer) return;
      this.scheduleNext(next, nextBuffer);
      const after = nextAyahPosition(next.surah, next.ayah);
      if (after) void this.load(after, gen);
    } catch {
      if (gen === this.gen) this.handlers.onError("Recitation could not be loaded. Try another reciter.");
    }
  }

  pause() {
    if (!this.ctx || this.ctx.state !== "running") return;
    this.ctx.suspend().then(() => {
      this.cancelTick();
      this.handlers.onPause();
    });
  }

  resume() {
    if (!this.current || !this.ctx) {
      return false;
    }
    if (this.ctx.state === "suspended") {
      this.running = true;
      this.ctx.resume().then(() => {
        this.handlers.onPlay();
        this.tick();
      });
      return true;
    }
    return this.running;
  }

  toggle() {
    if (this.ctx?.state === "running" && this.running) {
      this.pause();
      return;
    }
    if (this.current && this.ctx?.state === "suspended") {
      this.resume();
      return;
    }
    if (this.current) {
      this.play(this.current.ref, this.currentTime());
    }
  }

  stop() {
    this.gen += 1;
    this.running = false;
    this.stopSources();
    this.cancelTick();
    this.handlers.onPause();
    this.handlers.onTime(0, 0);
  }

  seek(time: number) {
    if (!this.current) return;
    const offset = Math.max(0, Math.min(time, this.current.buffer.duration - 0.05));
    this.play(this.current.ref, offset);
  }

  currentTime() {
    if (!this.current || !this.ctx) return 0;
    const elapsed = Math.max(0, this.ctx.currentTime - this.current.startCtx) * this.speed;
    return Math.min(this.current.buffer.duration, this.current.offset + elapsed);
  }

  duration() {
    return this.current?.buffer.duration ?? 0;
  }

  dispose() {
    this.stop();
    this.cache.clear();
    void this.ctx?.close();
    this.ctx = null;
    this.gain = null;
  }

  private async ensure() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = this.volume;
      this.gain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  private async load(ref: AyahRef, gen: number) {
    const key = cacheKey(this.reciter, ref);
    const cached = this.cache.get(key);
    if (cached) return cached;
    await this.ensure();
    let lastError: unknown;
    for (const url of audioUrls(ref.surah, ref.ayah, this.reciter)) {
      if (gen !== this.gen) throw new Error("cancelled");
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.arrayBuffer();
        const decoded = await this.ctx!.decodeAudioData(data.slice(0));
        const trimmed = trimSilence(this.ctx!, decoded);
        this.cache.set(key, trimmed);
        if (this.cache.size > 24) {
          const first = this.cache.keys().next().value;
          if (first) this.cache.delete(first);
        }
        return trimmed;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError ?? new Error("audio failed");
  }

  private startClip(ref: AyahRef, buffer: AudioBuffer, offset: number, when: number) {
    const source = this.ctx!.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = this.speed;
    source.connect(this.gain!);
    const startAt = Math.max(when, this.ctx!.currentTime);
    source.start(startAt, offset);
    this.current = { ref, buffer, source, startCtx: startAt, offset };
    source.onended = () => this.onEnded(source);
    this.handlers.onAyah(ref);
  }

  private scheduleNext(ref: AyahRef, buffer: AudioBuffer) {
    if (!this.current || !this.ctx) return;
    if (this.upcoming) {
      try {
        this.upcoming.source.onended = null;
        this.upcoming.source.stop();
      } catch {
        /* already stopped */
      }
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = this.speed;
    source.connect(this.gain!);
    const played = this.currentTime();
    const remaining = Math.max(0, (this.current.buffer.duration - played) / this.speed);
    const when = Math.max(this.ctx.currentTime, this.ctx.currentTime + remaining);
    source.start(when);
    this.upcoming = { ref, buffer, source, startCtx: when, offset: 0 };
    source.onended = () => this.onEnded(source);
  }

  private async prefetch(ref: AyahRef, gen: number) {
    if (this.repeat) {
      if (this.current) this.scheduleNext(this.current.ref, this.current.buffer);
      return;
    }
    const next = nextAyahPosition(ref.surah, ref.ayah);
    if (!next) return;
    try {
      const buffer = await this.load(next, gen);
      if (gen !== this.gen || !this.current) return;
      if (this.current.ref.surah !== ref.surah || this.current.ref.ayah !== ref.ayah) return;
      this.scheduleNext(next, buffer);
    } catch {
      /* next ayah will start on demand */
    }
  }

  private promoteUpcoming() {
    if (!this.upcoming) return false;
    this.current = this.upcoming;
    this.upcoming = null;
    this.handlers.onAyah(this.current.ref);
    this.prefetch(this.current.ref, this.gen);
    return true;
  }

  private onEnded(source: AudioBufferSourceNode) {
    if (!this.running) return;
    if (this.ctx?.state === "suspended") return;
    if (this.current?.source === source && this.promoteUpcoming()) return;
    if (this.current?.source !== source) return;
    if (this.repeat) {
      void this.play(this.current.ref);
      return;
    }
    const next = nextAyahPosition(this.current.ref.surah, this.current.ref.ayah);
    if (next) {
      void this.play(next);
      return;
    }
    this.running = false;
    this.current = null;
    this.handlers.onEnded();
  }

  private stopSources() {
    for (const clip of [this.current, this.upcoming]) {
      if (!clip) continue;
      clip.source.onended = null;
      try {
        clip.source.stop();
      } catch {
        /* already stopped */
      }
    }
    this.current = null;
    this.upcoming = null;
  }

  private tick = () => {
    this.cancelTick();
    if (!this.running || !this.current || !this.ctx) return;
    if (this.upcoming && this.ctx.currentTime >= this.upcoming.startCtx) {
      this.promoteUpcoming();
    }
    this.handlers.onTime(this.currentTime(), this.duration());
    this.raf = window.requestAnimationFrame(this.tick);
  };

  private cancelTick() {
    if (this.raf) window.cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
}
