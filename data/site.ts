export const SITE = {
  name: "Alvasatiya Islamic Center",
  shortName: "Alvasatiya",
  domain: "alvasatiya.org",
  url: "https://alvasatiya.org",
  tagline: "Knowledge • Faith • Service",
  description:
    "Alvasatiya Islamic Center is an international Islamic organization dedicated to Quran learning, Islamic education, community welfare, and spreading beneficial knowledge.",
  ayahArabic: "وَكَذَٰلِكَ جَعَلۡنَٰكُمۡ أُمَّةً وَسَطًا",
  ayahEnglish: "And thus We have made you a justly balanced nation.",
  ayahRef: "Al-Baqarah 2:143",
  phone: "+92 300 4840308",
  localPhone: "03004840308",
  email: "alvasatiya4@gmail.com",
  address: "24 KM Glaxo Town, Ferozpur Road, Lahore, Pakistan",
  headquarters: "Jamia Umme Ashraf Jamal",
  officeHours: "Open 24/7",
  whatsapp: "923004840308",
  founder: {
    name: "Alhaj Mufti Imadullah Qadri Naeemi",
    role: "Founder",
    image: "/images/founder.jpg",
  },
  social: {
    facebook: "https://www.facebook.com/Alvasatiya/",
    twitter: "https://x.com/alvasatiya4",
    youtube: "https://www.youtube.com/@Alvasatiya11223",
    instagram: "https://www.instagram.com/alvasatiya_islamic_center/",
    tiktok: "",
  },
  logo: "/images/logo.png",
  icon: "/favicon.ico",
} as const;

const CONTACT_PREFILL = "Assalamu alaikum, I would like to contact Alvasatiya Islamic Center.";

export function telHref() {
  return `tel:+${SITE.whatsapp}`;
}

export function mailtoHref(subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${SITE.email}${query ? `?${query}` : ""}`;
}

export function whatsappHref(message = CONTACT_PREFILL) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function smsHref(message = CONTACT_PREFILL) {
  const body = encodeURIComponent(message);
  return `sms:+${SITE.whatsapp}?body=${body}&body=${body}`;
}

export function openSms(message = CONTACT_PREFILL) {
  if (typeof window === "undefined") return;
  const body = encodeURIComponent(message);
  const phone = `+${SITE.whatsapp}`;
  const ios = /iPad|iPhone|iPod/i.test(window.navigator.userAgent);
  window.location.href = ios ? `sms:${phone}&body=${body}` : `sms:${phone}?body=${body}`;
}
