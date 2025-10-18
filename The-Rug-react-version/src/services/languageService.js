// src/services/languageService.js
const translations = {
  en: {
    navbar: {
      logOut: "Logout",
      home: "Home",
      shop: "Shop",
      about: "About",
      contact: "Contact",
      becomeProvider: "Become Provider",
      providerProfile: "Provider Profile",
      manage: "Manage",
      searchPlaceholder: "Search products...",
      signIn: "Sign In",
      profile: "Profile",
      logout: "Logout",
    },
    home: {
      nowOnline: "Now Online",
      description:
        "You can order the Rug with a lot of designs with saving time, money and effort",
      learnMore: "Learn More",
      bestSellers: "BestSellers",
      ourCarpets: "Our Carpets are created by:",
      handMade: "Hand-made:",
      handMadeDesc:
        "Each rug is meticulously handcrafted by skilled artisans, preserving the rich tradition of handmade rug weaving and ensuring unmatched quality and elegance in every piece",
      machineMade: "Machine-made:",
      machineMadeDesc:
        "machine-made rugs combine advanced technology...Our rugs are crafted using advanced industrial techniques, ensuring high-quality, durable, and beautifully designed pieces that suit every style and space.",
      ourSuppliers: "Our suppliers",
      whyChoose: "Why Choose Our Rugs?",
      features: [
        {
          title: "Premium Quality",
          icon: "🏆",
          description:
            "Crafted with the finest materials to ensure durability and comfort.",
        },
        {
          title: "Handmade & Unique",
          icon: "🧵",
          description:
            "Each rug is a masterpiece, woven with traditional craftsmanship.",
        },
        {
          title: "Eco-Friendly",
          icon: "🌱",
          description:
            "We use sustainable materials to protect the environment.",
        },
        {
          title: "Fast Shipping",
          icon: "🚚",
          description: "Get your favorite rug delivered quickly",
        },
      ],
    },
  },
  ar: {
    navbar: {
      logOut: "تسجيل الخروج",
      home: "الرئيسية",
      shop: "المتجر",
      about: "من نحن",
      contact: "اتصل بنا",
      becomeProvider: "كن مزودًا",
      providerProfile: "ملف المزود",
      manage: "إدارة",
      searchPlaceholder: "ابحث عن المنتجات...",
      signIn: "تسجيل الدخول",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
    },
    home: {
      nowOnline: "متاح الآن أونلاين",
      description:
        "يمكنك طلب السجادة بالعديد من التصاميم مع توفير الوقت والمال والجهد",
      learnMore: "معرفة المزيد",
      bestSellers: "الأكثر مبيعًا",
      ourCarpets: "يتم صنع سجادنا بواسطة:",
      handMade: "صناعة يدوية:",
      handMadeDesc:
        "كل سجادة تُنسج بعناية فائقة على أيدي حرفيين مهرة، مما يحافظ على تقاليد صناعة السجاد اليدوي العريقة ويضمن جودة وأناقة لا مثيل لهما في كل قطعة.",
      machineMade: "صناعة آلية:",
      machineMadeDesc:
        "تجمع السجاد المصنوعة آليًا بين التكنولوجيا المتقدمة لضمان جودة عالية، ومتانة، وتصاميم رائعة تناسب أي نمط ومساحة.",
      ourSuppliers: "موردينا",
      whyChoose: "لماذا تختار سجادنا؟",
      features: [
        {
          title: "جودة عالية",
          icon: "🏆",
          description: "مصنوعة من أفضل المواد لضمان المتانة والراحة.",
        },
        {
          title: "يدوي وفريد",
          icon: "🧵",
          description: "كل سجادة هي تحفة فنية، منسوجة بحرفية تقليدية.",
        },
        {
          title: "صديق للبيئة",
          icon: "🌱",
          description: "نستخدم مواد مستدامة لحماية البيئة.",
        },
        {
          title: "شحن سريع ",
          icon: "🚚",
          description: "احصل على سجادتك المفضلة بسرعة.",
        },
      ],
    },
  },
};

let currentLanguage = "en";
const subscribers = new Set();

export const setLanguage = (lang) => {
  currentLanguage = lang;
  subscribers.forEach((callback) => callback());
};

export const getLanguage = () => currentLanguage;

export const translate = (key) => {
  const keys = key.split(".");
  let result = translations[currentLanguage];

  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) return key; // Fallback to key if translation not found
  }

  return result;
};

export const subscribe = (callback) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};
