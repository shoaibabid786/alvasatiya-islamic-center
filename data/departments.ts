export type Department = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  purpose: string;
  objectives: string[];
  services: string[];
  programs: string[];
  activities: string[];
  notes?: string[];
  cta?: { label: string; href: string };
};

export const departments: Department[] = [
  {
    slug: "farz-uloom",
    name: "Farz Uloom",
    tagline: "Foundational Islamic knowledge for every Muslim",
    intro:
      "Farz Uloom focuses on the essential Islamic knowledge that every Muslim is responsible to learn: belief, purification, prayer, fasting, zakat, Hajj, and everyday manners.",
    purpose:
      "To make core Islamic learning accessible, clear, and practical for students, families, and the wider community.",
    objectives: [
      "Teach basic Islamic beliefs with clarity and balance",
      "Help learners understand Salah, purification, and daily worship",
      "Introduce fasting, zakat, and Hajj at a foundational level",
      "Encourage Islamic manners in home, school, and community life",
    ],
    services: ["Foundational classes", "Family learning sessions", "Beginner reading resources", "Teacher-guided study circles"],
    programs: ["Basic beliefs", "Salah and purification", "Fasting and zakat", "Hajj overview", "Islamic manners"],
    activities: ["Study circles", "Revision sessions", "Community workshops"],
    cta: { label: "Explore Islamic Education", href: "/islamic-services/islamic-education" },
  },
  {
    slug: "islamic-sisters",
    name: "Islamic Sisters",
    tagline: "Women's Islamic education and community learning",
    intro:
      "Islamic Sisters is a dedicated space for women's Quran learning, Islamic education, family guidance, and community programs in a respectful and supportive environment.",
    purpose:
      "To provide women and families with beneficial Islamic knowledge, sisterhood, and practical learning opportunities.",
    objectives: [
      "Support Quran learning for sisters",
      "Offer Islamic education suited to family and community life",
      "Host lectures, courses, and educational gatherings",
      "Share reliable learning resources",
    ],
    services: ["Quran classes", "Women's learning programs", "Family education", "Lectures and resources"],
    programs: ["Quran and Tajweed", "Islamic studies", "Family education", "Beginner courses"],
    activities: ["Study groups", "Educational events", "Community gatherings"],
    cta: { label: "View Courses", href: "/courses" },
  },
  {
    slug: "jamia-tul-madina",
    name: "Jamia Tul Madina",
    tagline: "An educational institution for structured Islamic learning",
    intro:
      "Jamia Tul Madina represents Alvasatiya's structured Islamic educational pathway, offering programs, teacher-guided study, and student support. Official admissions details will be published as they are confirmed.",
    purpose:
      "To nurture students through organized Islamic education, character development, and scholarly discipline.",
    objectives: [
      "Provide structured educational programs",
      "Support teachers and students",
      "Encourage both knowledge and good character",
      "Share admissions and activity information as it becomes available",
    ],
    services: ["Educational programs", "Student information", "Teacher guidance", "Admissions inquiries"],
    programs: ["Islamic studies", "Quran education", "Arabic foundations", "Character development"],
    activities: ["Classes", "Student activities", "Educational gatherings"],
    notes: ["Admissions dates, faculty lists, and official program details are placeholders until confirmed by the administration."],
    cta: { label: "Contact Admissions", href: "/contact" },
  },
  {
    slug: "majlis-tarajim",
    name: "Majlis Tarajim",
    tagline: "Translation of beneficial Islamic literature",
    intro:
      "Majlis Tarajim focuses on translating and presenting Islamic literature so that beneficial knowledge can reach more readers in more languages.",
    purpose:
      "To support translation, publication, and sharing of reliable Islamic educational materials.",
    objectives: [
      "Translate beneficial Islamic literature",
      "Support multilingual learning",
      "Prepare articles, books, and educational texts",
      "Coordinate translation projects with qualified reviewers",
    ],
    services: ["Translation projects", "Publication support", "Article preparation", "Language resources"],
    programs: ["Book translation", "Article translation", "Educational publications"],
    activities: ["Review circles", "Publication planning", "Language workshops"],
    cta: { label: "Visit the Library", href: "/islamic-services/books-library" },
  },
  {
    slug: "madani-channel",
    name: "Madani Channel",
    tagline: "Islamic media, lectures, and educational programs",
    intro:
      "Madani Channel is Alvasatiya's Islamic media space for videos, lectures, programs, and educational content. Featured media will appear here as official recordings are published.",
    purpose:
      "To share beneficial Islamic media that supports learning, reminders, and community education.",
    objectives: [
      "Publish educational lectures and programs",
      "Organize media by category for easy access",
      "Archive beneficial recordings",
      "Support search and discovery of Islamic media",
    ],
    services: ["Video library", "Lecture archive", "Program highlights", "Media search"],
    programs: ["Islamic talks", "Quran recitation", "Educational series"],
    activities: ["Recording sessions", "Program scheduling", "Media publishing"],
    cta: { label: "Open Islamic Media", href: "/media" },
  },
  {
    slug: "madrasa-tul-madina",
    name: "Madrasa tul Madina",
    tagline: "Quran education and Islamic studies for students",
    intro:
      "Madrasa tul Madina is dedicated to Quran education, Islamic studies, and nurturing young learners with care, discipline, and a peaceful learning environment.",
    purpose:
      "To provide students with Quran reading, Islamic studies, and character-focused education.",
    objectives: [
      "Teach Quran with proper recitation",
      "Introduce Islamic studies at an age-appropriate level",
      "Support teachers and students",
      "Share admissions information when available",
    ],
    services: ["Quran education", "Islamic studies", "Student support", "Admissions inquiries"],
    programs: ["Nazira", "Tajweed foundations", "Hifz pathway", "Children's Islamic studies"],
    activities: ["Daily classes", "Student activities", "Parent communication"],
    notes: ["Class schedules, teacher lists, and admissions windows will be published by the administration."],
    cta: { label: "Explore Education", href: "/education" },
  },
  {
    slug: "ahkam-e-hajj",
    name: "Ahkam e Hajj",
    tagline: "Educational guidance for Hajj preparation",
    intro:
      "Ahkam e Hajj offers educational resources on Hajj preparation, rituals, and commonly discussed matters. This page is for learning and reminder, not a substitute for qualified scholarly advice.",
    purpose:
      "To help intending pilgrims understand Hajj stages, preparation, and important guidance in a clear educational format.",
    objectives: [
      "Explain Hajj preparation in an accessible way",
      "Outline well-known stages such as Ihram, Tawaf, Sa'i, Mina, Arafah, and Muzdalifah",
      "Highlight common mistakes at a general educational level",
      "Encourage consultation with qualified scholars where rulings differ",
    ],
    services: ["Hajj education", "Preparation checklists", "FAQs", "Related courses"],
    programs: ["Hajj rulings overview", "Ihram and Miqat", "Ritual stages", "Common mistakes"],
    activities: ["Educational sessions", "Pre-Hajj workshops", "Resource sharing"],
    notes: [
      "Schools of Islamic jurisprudence may differ on some details. Please consult a qualified scholar for personal circumstances.",
    ],
    cta: { label: "Open Hajj & Umrah Guide", href: "/social-services/hajj-umrah" },
  },
  {
    slug: "organizational-website",
    name: "Organizational Website",
    tagline: "Alvasatiya's digital presence and website resources",
    intro:
      "This department supports Alvasatiya's official website, digital information, and online resources so that students and visitors can access knowledge, services, and updates with ease.",
    purpose:
      "To maintain a trustworthy, useful, and well-organized digital home for the organization.",
    objectives: [
      "Keep official information clear and accessible",
      "Support educational and service pages",
      "Prepare the site for future content and backend integration",
      "Improve user experience, accessibility, and SEO",
    ],
    services: ["Website resources", "Digital updates", "Content coordination", "Support requests"],
    programs: ["Page development", "Resource publishing", "Digital documentation"],
    activities: ["Content review", "Website improvements", "User feedback"],
    cta: { label: "Send Feedback", href: "/feedback" },
  },
  {
    slug: "social-media",
    name: "Social Media",
    tagline: "Official channels for beneficial reminders and updates",
    intro:
      "The Social Media department shares Alvasatiya's official updates, educational reminders, and community announcements. Only confirmed official links are listed; additional platforms will appear when provided.",
    purpose:
      "To communicate beneficial content through official, verified channels.",
    objectives: [
      "Share educational reminders",
      "Announce events and programs",
      "Direct people to official resources",
      "Avoid unofficial or unverified accounts",
    ],
    services: ["Official updates", "Event announcements", "Educational posts"],
    programs: ["Social media reminders", "Community announcements"],
    activities: ["Content planning", "Official publishing", "Community replies"],
    cta: { label: "Contact Us", href: "/contact" },
  },
  {
    slug: "tree-plantation",
    name: "Tree Plantation",
    tagline: "Environmental care as a community responsibility",
    intro:
      "Tree Plantation encourages environmental awareness, community participation, and practical care for the earth as an act of stewardship and service.",
    purpose:
      "To invite families and volunteers into tree plantation projects and environmental education.",
    objectives: [
      "Support tree plantation projects",
      "Raise environmental awareness",
      "Invite community participation",
      "Document campaigns and volunteer opportunities",
    ],
    services: ["Plantation campaigns", "Volunteer invitations", "Awareness sessions"],
    programs: ["Community plantation", "School participation", "Local greening"],
    activities: ["Campaign days", "Volunteer drives", "Photo documentation"],
    notes: ["Campaign dates, planting sites, and volunteer counts will be added when confirmed."],
    cta: { label: "Volunteer / Contact", href: "/contact" },
  },
  {
    slug: "majlis-tajiran",
    name: "Majlis Tajiran",
    tagline: "Business ethics, community enterprise, and professional learning",
    intro:
      "Majlis Tajiran is a professional and community space for ethical business education, networking around beneficial work, and community initiatives for traders and professionals.",
    purpose:
      "To encourage honest dealing, beneficial knowledge, and community-minded professional activity.",
    objectives: [
      "Share educational resources on ethical business",
      "Host community and professional gatherings",
      "Support beneficial commercial and community initiatives",
      "Provide a contact point for interested members",
    ],
    services: ["Educational resources", "Community events", "Professional gatherings"],
    programs: ["Ethics in trade", "Community initiatives", "Educational sessions"],
    activities: ["Meetings", "Workshops", "Community projects"],
    cta: { label: "Get in Touch", href: "/contact" },
  },
  {
    slug: "faizan-education-network",
    name: "Faizan Education Network",
    tagline: "A network for Islamic and educational programs",
    intro:
      "Faizan Education Network brings together educational programs, institutions, courses, and student resources connected to Alvasatiya's learning mission.",
    purpose:
      "To coordinate educational initiatives and help students find suitable learning pathways.",
    objectives: [
      "Present educational programs clearly",
      "Connect institutions, teachers, and students",
      "Share courses and learning activities",
      "Support educational initiatives across the community",
    ],
    services: ["Program directory", "Course guidance", "Student resources"],
    programs: ["Islamic education", "Quran learning", "Online and on-site courses"],
    activities: ["Academic coordination", "Student support", "Educational events"],
    cta: { label: "Browse Education", href: "/education" },
  },
  {
    slug: "maktaba-tul-madinah",
    name: "Maktaba tul Madinah",
    tagline: "Islamic library and publishing resources",
    intro:
      "Maktaba tul Madinah is Alvasatiya's library and publishing space for books, publications, authors, and educational reading. Downloads are offered only where legally available.",
    purpose:
      "To make beneficial books and publications easier to discover, read, and share lawfully.",
    objectives: [
      "Catalog Islamic books and publications",
      "Help readers find authors and categories",
      "Support lawful reading and downloading",
      "Highlight newly added educational titles",
    ],
    services: ["Book catalog", "Publication listings", "Reading access", "Search"],
    programs: ["Featured books", "Category collections", "Author pages"],
    activities: ["Catalog updates", "Reading circles", "Publication planning"],
    cta: { label: "Open Books Library", href: "/islamic-services/books-library" },
  },
  {
    slug: "dar-ul-madinah",
    name: "Dar ul Madinah",
    tagline: "Education with Islamic values and a balanced curriculum",
    intro:
      "Dar ul Madinah represents an educational institution pathway combining Islamic values with structured learning. Official philosophy statements, faculty, and admissions details will be published by the administration.",
    purpose:
      "To support students through values-based education, programs, and a caring academic environment.",
    objectives: [
      "Present the institution's educational purpose",
      "Outline programs as they are confirmed",
      "Support teachers, students, and families",
      "Share admissions and activity information when available",
    ],
    services: ["Educational programs", "Admissions inquiries", "Student activities", "Family communication"],
    programs: ["Islamic studies", "Academic learning", "Character education"],
    activities: ["Classes", "Student events", "Community programs"],
    notes: ["Official facts, examination rules, and admissions policies are not invented here and will be added when supplied."],
    cta: { label: "Contact the Institution", href: "/contact" },
  },
  {
    slug: "faizan-online-academy",
    name: "Faizan Online Academy",
    tagline: "Online Islamic learning for students everywhere",
    intro:
      "Faizan Online Academy offers a pathway for online Quran learning, Islamic courses, and remote study with a clear enrollment process.",
    purpose:
      "To make beneficial Islamic education available to students who learn online.",
    objectives: [
      "Provide online courses in Quran and Islamic studies",
      "Introduce teachers, duration, and learning process",
      "Support enrollment and student resources",
      "Keep online learning organized and accessible",
    ],
    services: ["Online courses", "Enrollment guidance", "Student resources"],
    programs: ["Quran learning", "Islamic education", "Children's online classes"],
    activities: ["Live or scheduled classes", "Recorded lessons where available", "Student support"],
    cta: { label: "Browse Online Courses", href: "/courses" },
  },
  {
    slug: "kanz-ul-madaris",
    name: "Kanz ul Madaris",
    tagline: "Educational information and student resources",
    intro:
      "Kanz ul Madaris is an educational information page for programs, student resources, and updates. Official examination rules and institutional facts will be published only when confirmed.",
    purpose:
      "To help students and families find educational information without spreading unverified rules or claims.",
    objectives: [
      "Share educational information clearly",
      "Point students to relevant programs and resources",
      "Publish updates when officially available",
      "Provide a contact path for questions",
    ],
    services: ["Educational information", "Student resources", "Update notices"],
    programs: ["Learning pathways", "Resource lists"],
    activities: ["Information publishing", "Student guidance"],
    notes: ["Do not treat this page as an official exam board notice. Rules and results processes will be added only from authentic sources."],
    cta: { label: "Contact for Information", href: "/contact" },
  },
  {
    slug: "hajj-o-umra",
    name: "Hajj O Umra",
    tagline: "Dedicated Hajj and Umrah educational resources",
    intro:
      "Hajj O Umra gathers Alvasatiya's educational resources on Hajj, Umrah, preparation, and important guidance in one place.",
    purpose:
      "To help learners understand the journey of Hajj and Umrah through step-by-step educational content.",
    objectives: [
      "Introduce Hajj and Umrah clearly",
      "Explain preparation, Ihram, Tawaf, and Sa'i at an educational level",
      "Provide FAQs and useful resources",
      "Encourage scholarly consultation for personal rulings",
    ],
    services: ["Educational guides", "Checklists", "FAQs", "Related courses"],
    programs: ["Hajj overview", "Umrah steps", "Preparation resources"],
    activities: ["Workshops", "Resource updates", "Pre-travel education"],
    cta: { label: "Read the Complete Guide", href: "/social-services/hajj-umrah" },
  },
  {
    slug: "rohani-ilaj",
    name: "Rohani Ilaj",
    tagline: "Islamic spiritual guidance and educational wellbeing resources",
    intro:
      "Rohani Ilaj is a respectful information page for Islamic spiritual guidance, Quranic remembrance, duas, and adhkar. It is educational in nature and is not medical diagnosis, treatment, or a claim to cure any condition.",
    purpose:
      "To share Islamic spiritual resources while clearly distinguishing them from professional medical or psychological care.",
    objectives: [
      "Introduce Islamic spiritual guidance with humility",
      "Share duas, adhkar, and educational articles",
      "Encourage reliance upon Allah alongside taking lawful means",
      "Direct people to qualified scholars and, where needed, medical professionals",
    ],
    services: ["Educational articles", "Dua and adhkar resources", "Request/contact form"],
    programs: ["Spiritual wellbeing education", "Remembrance resources", "Community reminders"],
    activities: ["Educational sessions", "Resource sharing"],
    notes: [
      "This page does not diagnose, treat, or cure medical or psychological conditions.",
      "For illness, please consult qualified medical professionals. For complex religious questions, consult qualified scholars.",
    ],
    cta: { label: "Request Information", href: "/contact" },
  },
];

export function getDepartment(slug: string) {
  return departments.find((d) => d.slug === slug);
}
