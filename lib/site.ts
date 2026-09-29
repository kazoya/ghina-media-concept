// المصدر الوحيد لهذه البيانات: الموقع العلني https://ghinamedia.com (فُحص 2026-09-29)
// الصفحات: الرئيسية، About Us، Services، Training، Our Activities، Contact.
// لا تضف رقماً أو عميلاً أو شهادة أو سعراً غير منشور هناك قبل تأكيده من غنى ميديا.

export const brand = {
  nameAr: "غنى ميديا",
  nameEn: "Ghina Media",
  lead: "غنى فحماوي",
  site: "https://ghinamedia.com",
  phoneDisplay: "+962 78 138 5015",
  phoneDigits: "962781385015",
  tel: "tel:+962781385015",
  whatsappUrl: "https://wa.me/962781385015",
  email: "ghina@ghinamedia.com",
  addressAr: "شارع الملك عبدالله الثاني بن الحسين، إربد، الأردن",
  addressEn: "King Abdullah II Eben Al Hussein, Irbid, Jordan",
  hours: "غير منشورة على الموقع",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/ghinamedia" },
    { label: "Instagram", href: "https://www.instagram.com/ghinafahmawi/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/ghinamedia/" },
  ],
} as const;

export const developer = {
  name: "م. صهيب الصالح",
  whatsappDigits: "962787523192",
  whatsappUrl: "https://wa.me/962787523192",
} as const;

export const disclaimer = "تصوّر تجريبي مستقل — غير تابع للموقع الرسمي";

export const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/planner", label: "خطّط حملتك" },
  { href: "/services", label: "الخدمات" },
  { href: "/training", label: "التدريب" },
  { href: "/activities", label: "الأنشطة" },
  { href: "/opportunities", label: "فرص التطوير" },
  { href: "/contact", label: "تواصل" },
] as const;

export function waLink(text: string, digits: string = brand.phoneDigits) {
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

// نصوص مقتبسة كما نُشرت (مترجمة للعربية حيث كانت إنجليزية) — ليست ادعاءات جديدة
export const published = {
  experience: "أكثر من عقد من الخبرة كمحترفة معتمدة في تخطيط الإعلام (Certified Media Planning Professional)",
  specialties: ["تحسين محركات البحث SEO", "الإعلان مدفوع النقرة PPC", "التواصل الاجتماعي", "رصد سمعة العلامة"],
  vision:
    "تطوير منظومة اتصال تسويقي متكاملة ومستدامة تغطي كل جانب، وتدرس كل الاحتمالات، وتجري أبحاث السوق اللازمة لإيصال الرسالة الصحيحة إلى جمهورك.",
  mission: "نسعى لإنجاح مؤسستك عبر أفكار إبداعية، ومنظور جديد، وأخلاقيات عمل عالية الجودة تقود إلى رضا أكبر لعملائك.",
  meta: "وُصفت غنى فحماوي في صفحة الأنشطة بأنها «مؤسسة شركة غنى ميديا والمدربة في شركة ميتا».",
};

export type ServiceId =
  | "sem"
  | "seo"
  | "social"
  | "graphic"
  | "photo"
  | "web"
  | "training"
  | "meta"
  | "courses"
  | "consult"
  | "coaching";

// قائمة الخدمات كما تظهر في صفحة Services — الوصف شرح عام للخدمة وليس وعداً بنتيجة
export const services: { id: ServiceId; ar: string; en: string; desc: string; group: "grow" | "create" | "learn" }[] = [
  { id: "sem", ar: "التسويق عبر محركات البحث", en: "Search Engine Marketing", desc: "إعلانات بحث مدفوعة تظهر لمن يبحث عن خدمتك الآن.", group: "grow" },
  { id: "seo", ar: "تحسين محركات البحث", en: "Search Engine Optimization", desc: "ترتيب عضوي أفضل لموقعك دون الدفع مقابل كل نقرة.", group: "grow" },
  { id: "social", ar: "التسويق عبر التواصل الاجتماعي", en: "Social Media Marketing", desc: "محتوى وإعلانات وإدارة صفحات على المنصات التي يعيش فيها جمهورك.", group: "grow" },
  { id: "graphic", ar: "التصميم الجرافيكي", en: "Graphic Design", desc: "هوية بصرية ومنشورات ومواد مطبوعة ورقمية متسقة.", group: "create" },
  { id: "photo", ar: "التصوير التجاري", en: "Commercial Photography", desc: "صور منتجات ومكان وفريق تصلح للإعلان والموقع.", group: "create" },
  { id: "web", ar: "تصميم وتطوير المواقع والمتاجر", en: "Website Design & E-commerce", desc: "موقع أو متجر إلكتروني يحوّل الزيارة إلى طلب.", group: "create" },
  { id: "training", ar: "التدريب وورش العمل", en: "Training", desc: "ورش تسويق رقمي وعلامة شخصية للمؤسسات والجامعات والبرامج.", group: "learn" },
  { id: "meta", ar: "تدريب شهادات Meta", en: "Meta Certification Training", desc: "تحضير عملي لشهادات Meta في التسويق والإعلان.", group: "learn" },
  { id: "courses", ar: "الدورات عبر الإنترنت", en: "Online Courses", desc: "تعلّم ذاتي مرن بالسرعة التي تناسبك.", group: "learn" },
  { id: "consult", ar: "الاستشارات الرقمية للأعمال", en: "Digital Business Consultation", desc: "تشخيص حضورك الرقمي وخطة أولويات واضحة.", group: "grow" },
  { id: "coaching", ar: "الإرشاد في التسويق الرقمي", en: "Digital Marketing Coaching", desc: "مرافقة فردية لصاحب المشروع أو فريق التسويق.", group: "learn" },
];

export const groups = {
  grow: "نموّ وظهور",
  create: "إبداع وبناء",
  learn: "تعلّم وتمكين",
} as const;

// صفحة Training — أزيلت التكرارات فقط، والأسماء كما نُشرت
export const trainings = [
  "Abdul Hameed Shoman Foundation",
  "Boost With Meta BDC",
  "برنامج انهض",
  "Personal Branding — JUST University",
  "SMEs Export Development Pilot Project",
  "Startup Without Borders",
  "Foras Palestine",
  "4th NS JPSA’s Leaders In Training",
  "5th NS JPSA’s Leaders In Training",
  "دورة بناء العلامة والهوية التجارية الشخصية مع صندوق حياة التعليم",
  "Creative Jordan — Project as a Marketing Trainer",
  "كيف تبني حضوراً مؤثراً في القطاع الطبي — جامعة العلوم والتكنولوجيا مع مكتب الإرشاد الوظيفي",
  "التسويق في المشاريع الناشئة مع روّاد التنمية",
];

// صفحة Our Activities — النصوص كما نُشرت
export const activities: { text: string; tag: "شراكة" | "تمكين المرأة" | "ريادة" | "حوار" }[] = [
  { text: "توقيع شراكة استراتيجية مع مؤسسة مساواة لتمكين المرأة وتعزيز دورها في سوق العمل", tag: "شراكة" },
  { text: "المشاركة في توقيع ملحق اتفاقية بين ملتقى سيدات الأعمال والمهن الأردني وجمعية الأعمال الأردنية الأوروبية (جيبا)", tag: "شراكة" },
  { text: "توقيع مذكرة تفاهم مع جامعة اليرموك لدعم رؤية الجامعة في إخراج جيل قادر على العمل والبناء", tag: "شراكة" },
  { text: "توقيع اتفاقية تعاون لإطلاق برنامج دعم المشاريع الريادية بالشراكة مع أكاديمية الأثال لتدريب أبناء المحافظات الأردنية", tag: "ريادة" },
  { text: "المشاركة في ختام أسبوع الريادة العالمي بمركز الملكة رانيا للريادة برعاية الأميرة سمية بنت الحسن", tag: "ريادة" },
  { text: "الاحتفال بتخريج الدفعة الثانية من برنامج Orange Corners برعاية الأميرة سمية بنت الحسن", tag: "ريادة" },
  { text: "المشاركة في Cross border e-commerce day للحديث عن الاستفادة من السوشال ميديا لزيادة مبيعات المتاجر الإلكترونية", tag: "حوار" },
  { text: "جلسة حوارية بعنوان «التسويق في المشاريع الناشئة… التغيرات المتسارعة ومتطلبات السوق»", tag: "حوار" },
  { text: "لقاء مع مركز الدستور للدراسات الاقتصادية حول التحول الرقمي ودوره في تمكين المرأة في سوق العمل", tag: "تمكين المرأة" },
  { text: "المشاركة في فعالية «دعم المشاركة الاقتصادية للمرأة» التي نظّمتها جيبا بالشراكة مع هيئة الأمم المتحدة للمرأة", tag: "تمكين المرأة" },
  { text: "المشاركة في تكريم رائدات الأعمال بالشراكة مع اللجنة الدولية للإغاثة بمناسبة يوم المرأة العالمي", tag: "تمكين المرأة" },
  { text: "الاجتماع الدوري لعقد التحالف الوطني «إنصاف»", tag: "تمكين المرأة" },
  { text: "المشاركة في الحلقة النقاشية حول بيئة الابتكار والريادة في الأردن ضمن مشروعي MYSEA وU-SOLVE", tag: "ريادة" },
  { text: "لقاء سفير بعثة الاتحاد الأوروبي في الأردن", tag: "حوار" },
  { text: "اجتماع أعضاء وفريق جمعية جيبا مع السفير البلغاري في الأردن", tag: "حوار" },
  { text: "المشاركة في الغداء الخيري برعاية سمو الأميرة بسمة بنت علي في الحديقة النباتية الملكية", tag: "تمكين المرأة" },
];
