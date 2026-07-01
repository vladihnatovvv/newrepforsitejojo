window.JOJO_STORE = {
  meta: {
    brand: "JoJo Studio",
    phone: "+380 75 249 00 29",
    email: "avoe.online@gmail.com",
    instagram: "@jojo.accessories",
    city: "Україна",
    shippingNote: "Доставка Новою поштою 1-3 дні",
    paymentNote: "Онлайн-оплату додамо окремим модулем без перебудови сайту"
  },
  categories: [
    {
      name: "Головні убори",
      slug: "golovni-ubory",
      children: [
        { name: "Панами", slug: "panamy", active: true },
        { name: "Кепки", slug: "kepky" },
        { name: "Кепі", slug: "kepi" },
        { name: "Солом'яні моделі", slug: "soloma" }
      ]
    },
    {
      name: "Аксесуари",
      slug: "aksesuary",
      children: [
        { name: "Окуляри", slug: "okuliary" },
        { name: "Хустки", slug: "khustky" },
        { name: "Футляри", slug: "futliary" }
      ]
    },
    {
      name: "Сумки",
      slug: "sumky",
      children: [
        { name: "Шопери", slug: "shopery" },
        { name: "Кросбоді", slug: "crossbody" },
        { name: "Міні-сумки", slug: "mini-bags" }
      ]
    },
    {
      name: "Sale",
      slug: "sale",
      children: [{ name: "Останні позиції", slug: "last-items" }]
    }
  ],
  featuredSlugs: ["panama-zhak-mus", "panama-lezo", "panama-pustyshka"],
  products: [
    {
      slug: "panama-zhak-mus",
      name: "Панама Жак Мюс",
      price: 890,
      badge: "Хіт",
      category: "Панами",
      material: "Котон та джинс",
      size: "55-59 см",
      fit: "Регулюється позаду",
      article: "PANAMA-003",
      colors: [
        "чорний денім",
        "блакитний денім",
        "синій денім",
        "чорний котон",
        "білий",
        "червоний",
        "малиновий",
        "бежевий",
        "мокко",
        "бірюзовий",
        "лео"
      ],
      description:
        "Панама з акцентним м'яким силуетом, рваним краєм і легкою посадкою на щодень. Модель зручно сідає, працює і в базових, і в акцентних образах.",
      shortSpecs: [
        "Розмір 55-59 см",
        "Регулюється позаду",
        "Літня посадка",
        "Котон та джинс"
      ],
      images: [
        "./assets/products/panama-zhak-mus-1.jpg",
        "./assets/products/panama-zhak-mus-2.jpg",
        "./assets/products/panama-zhak-mus-3.jpg",
        "./assets/products/panama-zhak-mus-4.jpg",
        "./assets/products/panama-zhak-mus-5.jpg"
      ]
    },
    {
      slug: "panama-lezo",
      name: "Панама Лезо",
      price: 950,
      badge: "Новинка",
      category: "Панами",
      material: "Денім",
      size: "Універсальний",
      fit: "Не регулюється",
      article: "PANAMA-002",
      colors: ["чорний", "синій", "блакитний"],
      description:
        "Джинсова панама з вираженим краєм і більш графічною формою. Виглядає щільніше та контрастніше, добре працює як акцентний товар у каталозі.",
      shortSpecs: [
        "Щільний денім",
        "Графічна форма",
        "Не регулюється",
        "Акцентний силует"
      ],
      images: ["./assets/products/panama-lezo-1.jpg"]
    },
    {
      slug: "panama-pustyshka",
      name: "Панама Пустишка",
      price: 890,
      badge: "База",
      category: "Панами",
      material: "Котон та джинс",
      size: "55-59 см",
      fit: "Регулюється",
      article: "PANAMA-001",
      colors: ["білий", "бежевий", "молочний", "леопард", "графіт", "рожевий"],
      description:
        "Легка повсякденна панама з м'якою формою та базовими кольорами. Добрий варіант для широкого попиту і простого вибору клієнтом.",
      shortSpecs: [
        "Легка форма",
        "Розмір 55-59 см",
        "Регулюється",
        "На щодень"
      ],
      images: ["./assets/products/panama-zhak-mus-5.jpg"]
    },
    {
      slug: "kepka-riviera-demo",
      name: "Кепка Riviera",
      price: 790,
      badge: "Демо",
      category: "Кепки",
      material: "Котон",
      size: "56-58 см",
      fit: "Регулюється",
      article: "DEMO-CAP-001",
      colors: ["чорний", "бежевий", "молочний"],
      description:
        "Демо-позиція для перевірки роботи каталогу, картки товару, пошуку та структури майбутнього асортименту.",
      shortSpecs: [
        "Демо-товар",
        "Розмір 56-58 см",
        "Регулюється",
        "Котон"
      ],
      images: ["./assets/products/panama-lezo-1.jpg"]
    },
    {
      slug: "kepi-paris-demo",
      name: "Кепі Paris",
      price: 860,
      badge: "Демо",
      category: "Кепі",
      material: "Щільний твіл",
      size: "57-59 см",
      fit: "Фіксована форма",
      article: "DEMO-CAP-002",
      colors: ["графіт", "мокко"],
      description:
        "Тимчасова модель-заглушка для перевірки того, як виглядатимуть інші категорії головних уборів на сайті.",
      shortSpecs: [
        "Демо-товар",
        "Фіксована форма",
        "Щільний матеріал",
        "Міський стиль"
      ],
      images: ["./assets/products/panama-zhak-mus-2.jpg"]
    },
    {
      slug: "okuliary-mono-demo",
      name: "Окуляри Mono",
      price: 690,
      badge: "Демо",
      category: "Окуляри",
      material: "Пластик та метал",
      size: "One size",
      fit: "Універсальна посадка",
      article: "DEMO-GLS-001",
      colors: ["чорний", "коричневий"],
      description:
        "Демо-позиція для перегляду роботи додаткових категорій аксесуарів, фільтрації та пошуку по каталогу.",
      shortSpecs: [
        "Демо-товар",
        "Легка оправа",
        "Універсальна посадка",
        "На щодень"
      ],
      images: ["./assets/products/panama-zhak-mus-4.jpg"]
    },
    {
      slug: "khustka-satin-demo",
      name: "Хустка Satin",
      price: 540,
      badge: "Демо",
      category: "Хустки",
      material: "Сатин",
      size: "70 × 70 см",
      fit: "Універсальна",
      article: "DEMO-SCARF-001",
      colors: ["молочний", "блакитний", "чорний"],
      description:
        "Демо-товар для показу, як сайт працює не лише для панам, а й для легких аксесуарів з коротшим описом.",
      shortSpecs: [
        "Демо-товар",
        "Сатинова тканина",
        "Універсальне використання",
        "Легка вага"
      ],
      images: ["./assets/products/panama-zhak-mus-3.jpg"]
    },
    {
      slug: "shopper-soft-demo",
      name: "Шопер Soft",
      price: 1290,
      badge: "Демо",
      category: "Шопери",
      material: "Екошкіра",
      size: "Середній",
      fit: "Місткий формат",
      article: "DEMO-BAG-001",
      colors: ["мокко", "чорний", "молочний"],
      description:
        "Тимчасова сумка-заглушка, щоб клієнт міг оцінити вигляд карток товарів у суміжних категоріях магазину.",
      shortSpecs: [
        "Демо-товар",
        "Екошкіра",
        "Місткий формат",
        "Щоденний шопер"
      ],
      images: ["./assets/products/panama-zhak-mus-1.jpg"]
    },
    {
      slug: "mini-bag-line-demo",
      name: "Міні-сумка Line",
      price: 1180,
      badge: "Демо",
      category: "Міні-сумки",
      material: "Екошкіра",
      size: "Компактна",
      fit: "Через плече",
      article: "DEMO-BAG-002",
      colors: ["чорний", "бордо"],
      description:
        "Ще одна демо-позиція для перевірки довших каталогів, сортування та поведінки карток на різних екранах.",
      shortSpecs: [
        "Демо-товар",
        "Компактний формат",
        "Через плече",
        "Акцентна модель"
      ],
      images: ["./assets/products/panama-lezo-1.jpg"]
    }
  ],
  sampleCart: [
    { slug: "panama-zhak-mus", quantity: 1 },
    { slug: "panama-lezo", quantity: 1 }
  ],
  faq: [
    {
      question: "Чи є доставка Новою поштою?",
      answer: "Так, оформлення вже зібране під доставку Новою поштою з містом та відділенням."
    },
    {
      question: "Чи можна буде підключити онлайн-оплату?",
      answer: "Так, checkout вже підготовлений під додавання платіжного модуля окремим етапом."
    },
    {
      question: "Як додавати нові товари?",
      answer: "У прев'ю новий товар додається в один файл даних, а в WordPress надалі це буде WooCommerce-картка."
    }
  ],
  policies: {
    delivery:
      "Доставка по Україні здійснюється Новою поштою. Після підтвердження замовлення менеджер уточнює деталі та відправляє товар протягом 1-3 робочих днів.",
    payment:
      "Наразі сайт підготовлений під оформлення замовлення і прийом даних клієнта. Онлайн-оплата буде підключена окремим платіжним модулем на наступному етапі.",
    returns:
      "Повернення та обмін можливі протягом 14 днів за умови збереження товарного вигляду, бірок і повної комплектації.",
    privacy:
      "Персональні дані використовуються виключно для обробки замовлення, доставки та комунікації з клієнтом.",
    terms:
      "Оформлюючи замовлення, покупець підтверджує коректність введених даних та погоджується з умовами доставки, повернення і обробки персональних даних."
  }
};
