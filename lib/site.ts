// المصدر الوحيد لهذه البيانات: الموقع العلني https://ghinamedia.com (فُحص 2026-09-29)
// الصفحات: الرئيسية، About Us، Services، Training، Our Activities، Contact.
// لا تضف رقماً أو عميلاً أو شهادة أو سعراً غير منشور هناك قبل تأكيده من غنى ميديا.
import type { GoalId } from "./planner/types.ts";

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

// صفحة Our Activities — النصوص كما نُشرت. relationship يصف نوع العلاقة كما تدل عليه الصياغة المنشورة حرفياً:
// المشاركة في فعالية أو حضور توقيع بين جهتين أخريين لا يُعرض كشراكة تجارية أو اعتماد.
export type Relationship = "اتفاقية وقّعتها الشركة" | "مشاركة في فعالية" | "متحدثة أو ضيفة جلسة" | "لقاء واجتماع";
export const relationships: Relationship[] = ["اتفاقية وقّعتها الشركة", "متحدثة أو ضيفة جلسة", "مشاركة في فعالية", "لقاء واجتماع"];

const ACT = "https://ghinamedia.com/our-activities/";
export const activities: {
  text: string;
  relationship: Relationship;
  theme: "تمكين المرأة" | "ريادة" | "تسويق" | "علاقات";
  sourceUrl: string;
  evidence: "published";
}[] = [
  { text: "توقيع شراكة استراتيجية مع مؤسسة مساواة لتمكين المرأة وتعزيز دورها في سوق العمل", relationship: "اتفاقية وقّعتها الشركة", theme: "تمكين المرأة", sourceUrl: ACT, evidence: "published" },
  { text: "توقيع مذكرة تفاهم مع جامعة اليرموك لدعم رؤية الجامعة في إخراج جيل قادر على العمل والبناء", relationship: "اتفاقية وقّعتها الشركة", theme: "ريادة", sourceUrl: ACT, evidence: "published" },
  { text: "توقيع اتفاقية تعاون لإطلاق برنامج دعم المشاريع الريادية بالشراكة مع أكاديمية الأثال لتدريب أبناء المحافظات الأردنية", relationship: "اتفاقية وقّعتها الشركة", theme: "ريادة", sourceUrl: ACT, evidence: "published" },
  { text: "جلسة حوارية بعنوان «التسويق في المشاريع الناشئة… التغيرات المتسارعة ومتطلبات السوق» استضافت غنى فحماوي", relationship: "متحدثة أو ضيفة جلسة", theme: "تسويق", sourceUrl: ACT, evidence: "published" },
  { text: "المشاركة في Cross border e-commerce day للحديث عن الاستفادة من السوشال ميديا لزيادة مبيعات المتاجر الإلكترونية", relationship: "متحدثة أو ضيفة جلسة", theme: "تسويق", sourceUrl: ACT, evidence: "published" },
  { text: "لقاء مع مركز الدستور للدراسات الاقتصادية حول التحول الرقمي ودوره في تمكين المرأة في سوق العمل", relationship: "متحدثة أو ضيفة جلسة", theme: "تمكين المرأة", sourceUrl: ACT, evidence: "published" },
  { text: "المشاركة في توقيع ملحق اتفاقية بين ملتقى سيدات الأعمال والمهن الأردني وجمعية الأعمال الأردنية الأوروبية (جيبا)", relationship: "مشاركة في فعالية", theme: "تمكين المرأة", sourceUrl: ACT, evidence: "published" },
  { text: "المشاركة في ختام أسبوع الريادة العالمي بمركز الملكة رانيا للريادة برعاية الأميرة سمية بنت الحسن", relationship: "مشاركة في فعالية", theme: "ريادة", sourceUrl: ACT, evidence: "published" },
  { text: "الاحتفال بتخريج الدفعة الثانية من برنامج Orange Corners برعاية الأميرة سمية بنت الحسن", relationship: "مشاركة في فعالية", theme: "ريادة", sourceUrl: ACT, evidence: "published" },
  { text: "المشاركة في فعالية «دعم المشاركة الاقتصادية للمرأة» التي نظّمتها جيبا بالشراكة مع هيئة الأمم المتحدة للمرأة", relationship: "مشاركة في فعالية", theme: "تمكين المرأة", sourceUrl: ACT, evidence: "published" },
  { text: "المشاركة في تكريم رائدات الأعمال بالشراكة مع اللجنة الدولية للإغاثة بمناسبة يوم المرأة العالمي", relationship: "مشاركة في فعالية", theme: "تمكين المرأة", sourceUrl: ACT, evidence: "published" },
  { text: "المشاركة في الحلقة النقاشية حول بيئة الابتكار والريادة في الأردن ضمن مشروعي MYSEA وU-SOLVE", relationship: "مشاركة في فعالية", theme: "ريادة", sourceUrl: ACT, evidence: "published" },
  { text: "المشاركة في الغداء الخيري برعاية سمو الأميرة بسمة بنت علي في الحديقة النباتية الملكية", relationship: "مشاركة في فعالية", theme: "تمكين المرأة", sourceUrl: ACT, evidence: "published" },
  { text: "الاجتماع الدوري لعقد التحالف الوطني «إنصاف»", relationship: "لقاء واجتماع", theme: "تمكين المرأة", sourceUrl: ACT, evidence: "published" },
  { text: "لقاء سفير بعثة الاتحاد الأوروبي في الأردن", relationship: "لقاء واجتماع", theme: "علاقات", sourceUrl: ACT, evidence: "published" },
  { text: "اجتماع أعضاء وفريق جمعية جيبا مع السفير البلغاري في الأردن", relationship: "لقاء واجتماع", theme: "علاقات", sourceUrl: ACT, evidence: "published" },
];

// مسارات استرشادية تقترحها هذه المنصة — ليست برامج معلنة من غنى ميديا. trainingIdx يشير إلى trainings أعلاه فقط.
export const trainingPaths: { id: "beginner" | "owner" | "team"; title: string; forWho: string; trainingIdx: number[]; serviceIds: ServiceId[] }[] = [
  {
    id: "beginner",
    title: "مسار المبتدئ وبناء العلامة الشخصية",
    forWho: "لمن يبدأ حضوره الرقمي أو يبني اسمه المهني",
    trainingIdx: [3, 9, 11],
    serviceIds: ["coaching", "courses"],
  },
  {
    id: "owner",
    title: "مسار صاحب المشروع",
    forWho: "لمن يدير مشروعاً ناشئاً أو صغيراً ويريد قرارات تسويق أوضح",
    trainingIdx: [12, 5, 4],
    serviceIds: ["consult", "coaching"],
  },
  {
    id: "team",
    title: "مسار الفريق",
    forWho: "لفريق يدير حسابات التواصل والإعلانات داخل المؤسسة",
    trainingIdx: [1, 10],
    serviceIds: ["training", "meta"],
  },
];

// شرح عام لكل خدمة لمساعدة الزائر على الاختيار — كتبته هذه المنصة، ليس وصفاً رسمياً لنطاق عمل غنى ميديا.
export const serviceGuide: Record<ServiceId, { when: string; needs: string; next: string; goal: GoalId }> = {
  sem: { when: "تريد طلبات من أشخاص يبحثون عن خدمتك الآن.", needs: "صفحة أو رقم واتساب يستقبل الطلب، وميزانية تحددها أنت.", next: "حدد أهم 5 عبارات يكتبها عملاؤك في البحث.", goal: "leads" },
  seo: { when: "لديك موقع ولا يظهر في نتائج البحث.", needs: "وصول لإدارة الموقع وصبر لأسابيع.", next: "افحص ظهور صفحاتك في Search Console.", goal: "search" },
  social: { when: "جمهورك على فيسبوك أو إنستغرام أو لينكدإن.", needs: "من يرد على الرسائل والتعليقات.", next: "اختر منصة واحدة تبدأ بها.", goal: "social" },
  graphic: { when: "منشوراتك غير متسقة أو هويتك قديمة.", needs: "الشعار والألوان الحالية إن وُجدت.", next: "اجمع 5 أمثلة لتصاميم تعجبك.", goal: "identity" },
  photo: { when: "صورك الحالية لا تعكس جودة منتجك.", needs: "موعد ومكان للتصوير.", next: "حدد المنتجات أو الأماكن الأهم.", goal: "identity" },
  web: { when: "لا تملك موقعاً أو موقعك لا يحوّل الزيارة إلى طلب.", needs: "نطاق واستضافة أو قرار بشأنهما، ومحتوى الصفحات.", next: "اكتب قائمة الصفحات التي يحتاجها عميلك.", goal: "website" },
  training: { when: "تريد أن يدير فريقك التسويق بنفسه.", needs: "تحديد المشاركين وموعد.", next: "حدد مستوى كل مشارك.", goal: "training" },
  meta: { when: "فريقك يدير حسابات Meta ويريد تحضيراً للشهادات.", needs: "أعضاء فريق يستخدمون أدوات Meta.", next: "حدد الشهادة المستهدفة.", goal: "training" },
  courses: { when: "تفضّل التعلّم الذاتي بسرعتك.", needs: "وقت أسبوعي ثابت.", next: "اسأل عن الدورات المتاحة حالياً.", goal: "training" },
  consult: { when: "لا تعرف من أين تبدأ أو ماذا تقيس.", needs: "روابط قنواتك الحالية.", next: "ابدأ بالمخطِّط ثم احجز مكالمة.", goal: "leads" },
  coaching: { when: "تدير التسويق بنفسك وتحتاج مرافقة.", needs: "ساعة أسبوعية ثابتة.", next: "اكتب أكبر عائق تواجهه الآن.", goal: "social" },
};
