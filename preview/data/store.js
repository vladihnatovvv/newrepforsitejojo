window.JOJO_STORE = {
  categories: [
    {
      name: "Headwear",
      slug: "headwear",
      children: [
        { name: "Панами", slug: "panamy", active: true }
      ]
    }
  ],
  featuredSlugs: ["panama-zhak-mus", "panama-lezo", "panama-pustyshka"],
  products: [
    {
      slug: "panama-zhak-mus",
      name: "Панама Жак Мюс",
      price: 890,
      badge: "Best seller",
      category: "Панами",
      material: "Котон та джинс",
      size: "55-59 см",
      fit: "Регулюється позаду",
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
      badge: "New",
      category: "Панами",
      material: "Денім",
      size: "One size",
      fit: "Не регулюється",
      colors: ["чорний", "синій", "блакитний"],
      description:
        "Джинсова панама з вираженим краєм і більш графічною формою. Виглядає щільніше та контрастніше, добре працює як акцентний товар у каталозі.",
      images: ["./assets/products/panama-lezo-1.jpg"]
    },
    {
      slug: "panama-pustyshka",
      name: "Панама Пустишка",
      price: 890,
      badge: "Essential",
      category: "Панами",
      material: "Котон та джинс",
      size: "55-59 см",
      fit: "Регулюється",
      colors: ["білий", "бежевий", "молочний", "леопард", "графіт", "рожевий"],
      description:
        "Легка повсякденна панама з м'якою формою та базовими кольорами. Добрий варіант для широкого попиту і простого вибору клієнтом.",
      images: ["./assets/products/panama-zhak-mus-5.jpg"]
    }
  ],
  sampleCart: [
    { slug: "panama-zhak-mus", quantity: 1 },
    { slug: "panama-lezo", quantity: 1 }
  ]
};
