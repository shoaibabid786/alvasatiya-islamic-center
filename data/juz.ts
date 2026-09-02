export type JuzInfo = {
  number: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  startName: string;
  endName: string;
};

export const JUZ_MAP: JuzInfo[] = [
  { number: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141, startName: "Al-Fatihah 1:1", endName: "Al-Baqarah 2:141" },
  { number: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252, startName: "Al-Baqarah 2:142", endName: "Al-Baqarah 2:252" },
  { number: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92, startName: "Al-Baqarah 2:253", endName: "Aal-Imran 3:92" },
  { number: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23, startName: "Aal-Imran 3:93", endName: "An-Nisa 4:23" },
  { number: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147, startName: "An-Nisa 4:24", endName: "An-Nisa 4:147" },
  { number: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81, startName: "An-Nisa 4:148", endName: "Al-Ma'idah 5:81" },
  { number: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110, startName: "Al-Ma'idah 5:82", endName: "Al-An'am 6:110" },
  { number: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87, startName: "Al-An'am 6:111", endName: "Al-A'raf 7:87" },
  { number: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40, startName: "Al-A'raf 7:88", endName: "Al-Anfal 8:40" },
  { number: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92, startName: "Al-Anfal 8:41", endName: "At-Tawbah 9:92" },
  { number: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5, startName: "At-Tawbah 9:93", endName: "Hud 11:5" },
  { number: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52, startName: "Hud 11:6", endName: "Yusuf 12:52" },
  { number: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52, startName: "Yusuf 12:53", endName: "Ibrahim 14:52" },
  { number: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128, startName: "Al-Hijr 15:1", endName: "An-Nahl 16:128" },
  { number: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74, startName: "Al-Isra 17:1", endName: "Al-Kahf 18:74" },
  { number: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135, startName: "Al-Kahf 18:75", endName: "Ta-Ha 20:135" },
  { number: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78, startName: "Al-Anbiya 21:1", endName: "Al-Hajj 22:78" },
  { number: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20, startName: "Al-Mu'minun 23:1", endName: "Al-Furqan 25:20" },
  { number: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55, startName: "Al-Furqan 25:21", endName: "An-Naml 27:55" },
  { number: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45, startName: "An-Naml 27:56", endName: "Al-Ankabut 29:45" },
  { number: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30, startName: "Al-Ankabut 29:46", endName: "Al-Ahzab 33:30" },
  { number: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27, startName: "Al-Ahzab 33:31", endName: "Ya-Sin 36:27" },
  { number: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31, startName: "Ya-Sin 36:28", endName: "Az-Zumar 39:31" },
  { number: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46, startName: "Az-Zumar 39:32", endName: "Fussilat 41:46" },
  { number: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37, startName: "Fussilat 41:47", endName: "Al-Jathiyah 45:37" },
  { number: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30, startName: "Al-Ahqaf 46:1", endName: "Adh-Dhariyat 51:30" },
  { number: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, startName: "Adh-Dhariyat 51:31", endName: "Al-Hadid 57:29" },
  { number: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12, startName: "Al-Mujadila 58:1", endName: "At-Tahrim 66:12" },
  { number: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50, startName: "Al-Mulk 67:1", endName: "Al-Mursalat 77:50" },
  { number: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, startName: "An-Naba 78:1", endName: "An-Nas 114:6" },
];
