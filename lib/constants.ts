import type { CategoryDefinition, CategoryKey, Rating } from "./types";

export const ratingLabels: Record<Rating, string> = {
  1: "Weak",
  2: "Needs Improvement",
  3: "Average",
  4: "Good",
  5: "Excellent"
};

export const ratingLabelsAr: Record<Rating, string> = {
  1: "ضعيف",
  2: "يحتاج تطوير",
  3: "متوسط",
  4: "جيد",
  5: "ممتاز"
};

export const categories: CategoryDefinition[] = [
  {
    key: "technique",
    label: "Technique",
    labelAr: "التقنية",
    weight: 20,
    accent: "#D9A45F",
    philosophy: "Clean preparation creates repeatable ball control.",
    philosophyAr: "التحضير النظيف يصنع تحكمًا قابلًا للتكرار.",
    skills: [
      { id: "shotPreparation", name: "Shot Preparation", nameAr: "التحضير للضربة" },
      { id: "ballControl", name: "Ball Control", nameAr: "التحكم بالكرة" },
      { id: "strokeQuality", name: "Stroke Quality", nameAr: "جودة الضربة" },
      { id: "gripRacket", name: "Grip & Racket Handling", nameAr: "المسكة والتعامل مع المضرب" },
      { id: "technicalConsistency", name: "Technical Consistency", nameAr: "الثبات التقني" }
    ]
  },
  {
    key: "positioning",
    label: "Positioning",
    labelAr: "التمركز",
    weight: 40,
    accent: "#B86A3A",
    philosophy: "Net control wins points. Positioning creates easier shots.",
    philosophyAr: "السيطرة على الشبكة تكسب النقاط. التمركز يصنع ضربات أسهل.",
    skills: [
      { id: "offensivePositioning", name: "Offensive Positioning", nameAr: "التمركز الهجومي" },
      { id: "defensivePositioning", name: "Defensive Positioning", nameAr: "التمركز الدفاعي" },
      { id: "postShotRecovery", name: "Post-Shot Recovery", nameAr: "العودة بعد الضربة" },
      { id: "courtAwareness", name: "Court Awareness", nameAr: "الوعي بالملعب" },
      { id: "netControl", name: "Net Control Positioning", nameAr: "تمركز السيطرة على الشبكة" },
      { id: "partnerPositioning", name: "Partner Positioning", nameAr: "التمركز مع الشريك" },
      { id: "transitionPositioning", name: "Transition Positioning", nameAr: "تمركز الانتقال" },
      { id: "positioningConsistency", name: "Positioning Consistency", nameAr: "ثبات التمركز" }
    ]
  },
  {
    key: "transition",
    label: "Transition",
    labelAr: "الانتقال",
    weight: 10,
    accent: "#8F4B2E",
    philosophy: "Transition quality decides who controls the next rally phase.",
    philosophyAr: "جودة الانتقال تحدد من يسيطر على المرحلة التالية من النقطة.",
    skills: [
      { id: "defToOff", name: "Defensive to Offensive Transition", nameAr: "الانتقال من الدفاع للهجوم" },
      { id: "offToDef", name: "Offensive to Defensive Recovery", nameAr: "العودة من الهجوم للدفاع" },
      { id: "transitionDecision", name: "Transition Decision Making", nameAr: "قرار الانتقال" },
      { id: "movementTransition", name: "Movement During Transition", nameAr: "الحركة أثناء الانتقال" }
    ]
  },
  {
    key: "fitness",
    label: "Fitness",
    labelAr: "اللياقة",
    weight: 20,
    accent: "#F5EBDD",
    philosophy: "Movement capacity keeps tactical choices available.",
    philosophyAr: "القدرة الحركية تحفظ الخيارات التكتيكية متاحة.",
    skills: [
      { id: "speed", name: "Speed", nameAr: "السرعة" },
      { id: "footwork", name: "Footwork & Movement", nameAr: "حركة القدمين" },
      { id: "reactionTime", name: "Reaction Time", nameAr: "سرعة الاستجابة" },
      { id: "endurance", name: "Endurance", nameAr: "التحمل" },
      { id: "explosiveness", name: "Explosiveness", nameAr: "القوة الانفجارية" },
      { id: "stability", name: "Physical Stability", nameAr: "الثبات البدني" }
    ]
  },
  {
    key: "tactics",
    label: "Tactics",
    labelAr: "التكتيك",
    weight: 10,
    accent: "#0F6B43",
    philosophy: "Awareness beats random aggression.",
    philosophyAr: "الوعي يتفوق على الهجوم العشوائي.",
    skills: [
      { id: "shotSelection", name: "Shot Selection", nameAr: "اختيار الضربة" },
      { id: "pointConstruction", name: "Point Construction", nameAr: "بناء النقطة" },
      { id: "tacticalDecision", name: "Tactical Decision Making", nameAr: "القرار التكتيكي" },
      { id: "partnerCoordination", name: "Partner Coordination", nameAr: "التنسيق مع الشريك" },
      { id: "tacticalConsistency", name: "Tactical Consistency", nameAr: "الثبات التكتيكي" }
    ]
  }
];

export const categoryKeys = categories.map((category) => category.key) as CategoryKey[];

export const suggestedNotes: Record<CategoryKey, string[]> = {
  technique: [
    "Your preparation is cleaner when you set the racket early.",
    "Technical consistency improves when you slow the first decision.",
    "Ball control is strongest when the contact point stays in front."
  ],
  positioning: [
    "You control the net effectively during attacking points.",
    "Your positioning improves when you stay patient.",
    "You need faster defensive recovery after losing the net.",
    "Court awareness improves under controlled tempo."
  ],
  transition: [
    "Your transition recovery needs more urgency.",
    "The first two steps after contact decide your next option.",
    "You move forward better when the opponent is under pressure."
  ],
  fitness: [
    "Footwork quality drops late in longer rallies.",
    "Your reaction speed gives you more time near the glass.",
    "Stability improves when your base stays lower before contact."
  ],
  tactics: [
    "Smart players beat flashy players when the rally gets tight.",
    "Shot selection improves when you build before attacking.",
    "Partner coordination is strongest when you hold the middle together."
  ]
};

export const suggestedNotesAr: Record<CategoryKey, string[]> = {
  technique: [
    "تحضيرك للضربة يتحسن عندما تجهز المضرب مبكرًا.",
    "الثبات التقني يزيد عندما تهدئ القرار الأول.",
    "تحكمك بالكرة يكون أفضل عندما تكون نقطة التلامس أمام الجسم."
  ],
  positioning: [
    "تسيطر على الشبكة بشكل فعّال أثناء النقاط الهجومية.",
    "تمركزك يتحسن عندما تلعب بصبر وتنتظر الكرة المناسبة.",
    "تحتاج عودة دفاعية أسرع بعد فقدان الشبكة.",
    "وعيك بالملعب يتحسن عندما يكون الإيقاع تحت السيطرة."
  ],
  transition: [
    "استرجاعك بعد الانتقال يحتاج سرعة ووضوح أكثر.",
    "أول خطوتين بعد الضربة تحددان خيارك التالي.",
    "تتقدم للأمام بشكل أفضل عندما يكون الخصم تحت الضغط."
  ],
  fitness: [
    "جودة حركة القدمين تقل في الراليات الطويلة.",
    "سرعة الاستجابة تمنحك وقتًا أفضل قرب الزجاج.",
    "ثباتك يتحسن عندما تكون القاعدة منخفضة قبل التلامس."
  ],
  tactics: [
    "اللاعب الذكي يتفوق على اللاعب المستعجل في النقاط الصعبة.",
    "اختيار الضربة يتحسن عندما تبني النقطة قبل الهجوم.",
    "التنسيق مع الشريك يكون أقوى عندما تحافظان على منتصف الملعب."
  ]
};
