export const ROUTES_DATA = {
  norway: {
    map: 'norway-map',
    markers: 'norway-markers',
    title: 'The Grand Voyager: From Fjords to the Arctic',
    description: "This epic route will take you from the heart of the Norwegian fjords to the harsh beauty of the Arctic Circle, revealing all of Norway's contrasts. Perfect for those who want to see the most impressive sights in one trip.",
    days: '14-16 days',
    distance: '~2200 - 2500 km',
  },
  austria: {
    map: 'austria-map',
    markers: 'austria-markers',
    title: 'Alpine Adventure: Austrian Mountain Odyssey',
    description: 'Discover the majestic Austrian Alps on this breathtaking route through snow-capped peaks, crystal-clear lakes, and charming mountain villages. Experience the best of Austrian culture and natural beauty.',
    days: '10-12 days',
    distance: '~1200 - 1500 km',
  },
};

export const MOTORHOMES_DATA = {
  'adria-s75-sl-2023': {
    id: 'adria-s75-sl-2023',
    name: 'Adria S75 SL 2023',
    model: 'Adria S75 SL 2023',
    description: "6 proper beds, no van crampedness, no need to rebuild every night — just B license and go! Alcove gives fixed sleeping spots for 4–6 people, semi-integrated make you fiddle with transformations, full-integrated are pricey and heavy. Perfect for first family trip.",
    pricePerDay: 149,
    discountPricePerDay: 169,
    discount: 0.9,
    images: [
      { src: 'images/Adria.jpg', alt: 'Adria S75 SL 2023 Exterior' },
      { src: 'images/main-2.jpeg', alt: 'Adria S75 SL 2023 Interior' },
      { src: 'images/main-3.jpeg', alt: 'Adria S75 SL 2023 Kitchen' },
      { src: 'images/main-4.jpeg', alt: 'Adria S75 SL 2023 Bedroom' }
    ],
    icons: [
      { src: 'images/icon-sleeps.png', alt: 'Sleeps', text: '4 sleeps' },
      { src: 'images/icon-seats.png', alt: 'Seats', text: '5 seats' },
      { src: 'images/icon-fuel.png', alt: 'Fuel', text: 'Diesel' },
      { src: 'images/icon-transmission.png', alt: 'Transmission', text: 'Manual / Auto' }
    ],
    specifications: {
      driving: [
        { parameter: 'Equipment', value: '4 Sleeps / 5 Belted Seats' },
        { parameter: 'License', value: 'Category B' },
        { parameter: 'Fuel', value: 'Diesel / 120 litres / ~800 km' },
        { parameter: 'Payload', value: 'Up to 700 kg' },
        { parameter: 'Transmission', value: 'Manual / Auto' },
        { parameter: 'Age / experience', value: '25 | 2+ years' }
      ],
      technical: [
        { parameter: 'Length', value: '7.5 m' },
        { parameter: 'Width', value: '2.3 m' },
        { parameter: 'Height', value: '3.0 m' },
        { parameter: 'Weight', value: '3500 kg' },
        { parameter: 'Engine', value: '2.3L Diesel, 150 HP' },
        { parameter: 'Tank Capacity', value: '120 liters' },
        { parameter: 'Water Tank', value: '100 liters' },
        { parameter: 'Battery', value: '2x 100Ah LiFePO4' },
        { parameter: 'Solar Panels', value: '400W' }
      ]
    },
    rating: 5
  },
  
  'hymer-exsis-i-580': {
    id: 'hymer-exsis-i-580',
    name: 'Hymer Exsis-i 580',
    model: 'Hymer Exsis-i 580',
    description: "The perfect combination of German engineering and modern comfort. Ideal for long journeys. The Hymer Exsis-i 580 offers superior build quality with innovative features that make every journey comfortable and safe.",
    pricePerDay: 179,
    discountPricePerDay: 199,
    discount: 0.9,
    images: [
      { src: 'images/Adria.jpg', alt: 'Adria S75 SL 2023 Exterior' },
      { src: 'images/main-2.jpeg', alt: 'Adria S75 SL 2023 Interior' },
      { src: 'images/main-3.jpeg', alt: 'Adria S75 SL 2023 Kitchen' },
      { src: 'images/main-4.jpeg', alt: 'Adria S75 SL 2023 Bedroom' }
    ],
    icons: [
      { src: 'images/icon-sleeps.png', alt: 'Sleeps', text: '4 sleeps' },
      { src: 'images/icon-seats.png', alt: 'Seats', text: '5 seats' },
      { src: 'images/icon-fuel.png', alt: 'Fuel', text: 'Diesel' },
      { src: 'images/icon-transmission.png', alt: 'Transmission', text: 'Manual / Auto' }
    ],
    specifications: {
      features: [
        'Premium German engineering',
        'Integrated solar panel system',
        'Smart heating and ventilation',
        'LED lighting throughout',
        'Integrated multimedia system',
        'Advanced safety features',
        'Comfortable sleeping arrangement',
        'Spacious bathroom with shower'
      ],
      technical: [
        { parameter: 'Length', value: '5.8 m' },
        { parameter: 'Width', value: '2.1 m' },
        { parameter: 'Height', value: '2.7 m' },
        { parameter: 'Engine', value: '2.0L Turbo Diesel' },
        { parameter: 'Transmission', value: '9-Speed Automatic' },
        { parameter: 'Fuel Capacity', value: '70 L' },
        { parameter: 'Water Capacity', value: '100 L' },
        { parameter: 'Waste Water', value: '70 L' },
        { parameter: 'Gross Weight', value: '3500 kg' }
      ]
    },
    rating: 5
  }
};

// Глобальные переменные состояния
export let swipers = {};
export let currentRoute = 'norway';
export let motorhomesInstances = {};
export let currentActiveMotorhome = null;
export let shareMenuActive = false;