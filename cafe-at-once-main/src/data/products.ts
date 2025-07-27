export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: 'concentrate' | 'tube' | 'flavored' | 'tea';
  rating: number;
  reviews: number;
  badges: string[];
  description: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    caffeine: number;
    sugar: number;
  };
  instructions: string[];
}

export const products: Product[] = [
  {
    id: 'espresso-concentrate',
    name: 'Cafe at Once Latte',
    price: 199,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg',
    ],
    category: 'concentrate',
    rating: 4.8,
    reviews: 234,
    badges: ['No Sugar', 'Gluten Free', 'Organic'],
    description:
      'Rich, bold espresso concentrate perfect for your daily coffee ritual. Made from premium Arabica beans.',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 120,
      sugar: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 4-6 oz of hot or cold water',
      'Stir and enjoy your perfect espresso',
    ],
  },
  {
    id: 'americano-concentrate',
    name: 'Cafe at Once Americano',
    price: 199,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
    ],
    category: 'concentrate',
    rating: 4.7,
    reviews: 189,
    badges: ['No Sugar', 'Gluten Free'],
    description:
      'Smooth and balanced Americano concentrate for the perfect cup every time.',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 95,
      sugar: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 6-8 oz of hot or cold water',
      'Stir and enjoy your perfect Americano',
    ],
  },
  {
    id: 'cold-brew-concentrate',
    name: 'Cafe at Once Tea & Coffee',
    price: 199,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
    ],
    category: 'concentrate',
    rating: 4.9,
    reviews: 312,
    badges: ['No Sugar', 'Organic', 'Cold Brew'],
    description:
      'Smooth, refreshing cold brew concentrate with low acidity and natural sweetness.',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 110,
      sugar: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 6-8 oz of cold water or milk',
      'Add ice and enjoy your cold brew',
    ],
  },
  {
    id: 'mocha-tube',
    name: 'Cafe at Once Mocha',
    price: 199,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
    ],
    category: 'tube',
    rating: 4.6,
    reviews: 156,
    badges: ['No Added Sugar', 'Real Cocoa'],
    description: 'Rich chocolate and coffee blend in a convenient tube format.',
    ingredients: ['Arabica Coffee', 'Natural Cocoa', 'Natural Flavors'],
    nutrition: {
      calories: 15,
      caffeine: 85,
      sugar: 2,
    },
    instructions: [
      'Peel the tube',
      'Press into 6 oz of hot milk or water',
      'Stir well for the perfect mocha',
    ],
  },
  {
    id: 'vanilla-latte-tube',
    name: 'Cafe at Once Espresso',
    price: 379,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751608473/Frame_33_oyik7i.png',
    ],
    category: 'flavored',
    rating: 4.5,
    reviews: 143,
    badges: ['Real Espresso', 'No Artificial Flavors'],
    description:
      'Creamy vanilla latte with natural Espresso extract and premium coffee.',
    ingredients: [
      'Arabica Coffee',
      'Natural Espresso Extract',
      'Natural Flavors',
    ],
    nutrition: {
      calories: 20,
      caffeine: 90,
      sugar: 3,
    },
    instructions: [
      'Peel the tube',
      'Press into 6 oz of hot milk',
      'Stir and enjoy your vanilla latte',
    ],
  },
  {
    id: 'caramel-macchiato-tube',
    name: 'Cafe at Once Cold Brew II',
    price: 199,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
    ],
    category: 'flavored',
    rating: 4.7,
    reviews: 198,
    badges: ['Real Caramel', 'Premium Coffee', 'Coming Soon'],
    description:
      'Sweet and smooth caramel macchiato with rich espresso and natural caramel.',
    ingredients: ['Arabica Coffee', 'Natural Caramel', 'Natural Flavors'],
    nutrition: {
      calories: 25,
      caffeine: 95,
      sugar: 4,
    },
    instructions: [
      'Peel the tube',
      'Press into 6 oz of steamed milk',
      'Create beautiful latte art if desired',
    ],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (
  category: Product['category']
): Product[] => {
  return products.filter((product) => product.category === category);
};
