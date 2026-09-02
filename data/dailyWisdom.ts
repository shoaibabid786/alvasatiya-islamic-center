export type DailyItem = {
  arabic: string;
  english: string;
  source: string;
  narrator?: string;
};

export const AYAT_ROTATION: DailyItem[] = [
  {
    arabic: "وَكَذَٰلِكَ جَعَلْنَاكُمْ أُمَّةً وَسَطًا",
    english: "And thus We have made you a justly balanced nation.",
    source: "Surah Al-Baqarah 2:143",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    english: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    source: "Surah Al-Baqarah 2:152",
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "For indeed, with hardship comes ease.",
    source: "Surah Ash-Sharh 94:5",
  },
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    english: "Unquestionably, by the remembrance of Allah hearts are assured.",
    source: "Surah Ar-Ra'd 13:28",
  },
  {
    arabic: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
    english: "Indeed, the most noble of you in the sight of Allah is the most righteous of you.",
    source: "Surah Al-Hujurat 49:13",
  },
  {
    arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ",
    english: "Indeed, Allah commands justice and excellence.",
    source: "Surah An-Nahl 16:90",
  },
  {
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    english: "Allah does not burden a soul beyond that it can bear.",
    source: "Surah Al-Baqarah 2:286",
  },
];

export const HADEES_ROTATION: DailyItem[] = [
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    english: "Actions are judged by intentions, and every person will be rewarded according to what they intended.",
    source: "Sahih al-Bukhari 1",
    narrator: "Umar ibn al-Khattab (RA)",
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    english: "The best of you are those who learn the Quran and teach it.",
    source: "Sahih al-Bukhari 5027",
    narrator: "Uthman ibn Affan (RA)",
  },
  {
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    english: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Sahih al-Bukhari 13",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    arabic: "الدِّينُ النَّصِيحَةُ",
    english: "The religion is sincere counsel.",
    source: "Sahih Muslim 55",
    narrator: "Tamim al-Dari (RA)",
  },
  {
    arabic: "مَنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ",
    english: "Part of the excellence of a person's Islam is leaving what does not concern him.",
    source: "Sunan al-Tirmidhi 2317",
    narrator: "Abu Hurairah (RA)",
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    english: "Allah does not look at your forms or your wealth, but He looks at your hearts and your deeds.",
    source: "Sahih Muslim 2564",
    narrator: "Abu Hurairah (RA)",
  },
  {
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    english: "Your smile in the face of your brother is charity.",
    source: "Sunan al-Tirmidhi 1956",
    narrator: "Abu Dharr (RA)",
  },
];

function pickDaily<T>(list: T[], offset = 0): T {
  const day = Math.floor(Date.now() / 86_400_000);
  return list[(day + offset) % list.length];
}

export function getAyatOfTheDay() {
  return pickDaily(AYAT_ROTATION);
}

export function getHadeesOfTheDay() {
  return pickDaily(HADEES_ROTATION, 3);
}

export function formatDailyText(item: DailyItem) {
  const who = item.narrator ? ` — ${item.narrator}` : "";
  return `${item.arabic}\n${item.english}\n${item.source}${who}`;
}
