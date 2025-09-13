export interface Species {
  id: string;
  name: string;
  description: string;
  category: string;
  habitat: string;
  funFact: string;
  population: number;
  populationLabel: string;
  conservationStatus: string;
  image: string;
  detailImages: string[];
}

export const speciesData: Species[] = [
  {
    id: "yellowfin-tuna",
    name: "Yellowfin Tuna",
    description: "A powerful and fast swimming fish known for its distinctive yellow fins and silver body!",
    category: "Fish",
    habitat: "Open ocean waters worldwide",
    funFact: "Can swim up to 75 km/h and dive to depths of 250 meters!",
    population: 1200000,
    populationLabel: "1.2M speedy swimmers!",
    conservationStatus: "Near Threatened",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "clarks-clownfish",
    name: "Clark's Clownfish",
    description: "A vibrant orange and white striped fish that loves living in sea anemones!",
    category: "Fish",
    habitat: "Coral reefs in the Indo-Pacific",
    funFact: "They're immune to their anemone's stings and can change from male to female!",
    population: 850000,
    populationLabel: "850K colorful friends!",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "indian-oil-sardine",
    name: "Indian Oil Sardine",
    description: "Small silver fish that travels in massive, shimmering schools through the Arabian Sea!",
    category: "Fish",
    habitat: "Coastal waters of the Indian Ocean",
    funFact: "Forms schools of millions and is a vital food source for many marine predators!",
    population: 5500000,
    populationLabel: "5.5M shimmering schoolmates!",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "indian-anchovy",
    name: "Indian Anchovy",
    description: "Tiny but mighty fish that forms incredible underwater clouds of silver!",
    category: "Fish",
    habitat: "Coastal and estuarine waters",
    funFact: "Despite being small, they're incredibly important to the ocean food web!",
    population: 8200000,
    populationLabel: "8.2M tiny treasures!",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "indian-mackerel",
    name: "Indian Mackerel",
    description: "Sleek, fast-swimming fish with beautiful blue-green stripes and a silvery belly!",
    category: "Fish",
    habitat: "Indo-Pacific coastal waters",
    funFact: "Can live up to 3 years and are excellent jumpers when caught!",
    population: 3400000,
    populationLabel: "3.4M striped speedsters!",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "mossy-red-seaweed",
    name: "Mossy Red Seaweed",
    description: "Beautiful red algae that creates underwater gardens full of marine life!",
    category: "Seaweed",
    habitat: "Rocky shores and tide pools",
    funFact: "Can photosynthesize even in deep water thanks to special red pigments!",
    population: 15000000,
    populationLabel: "15M garden patches!",
    conservationStatus: "Stable",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "sea-lettuce",
    name: "Sea Lettuce",
    description: "Bright green seaweed that looks just like underwater lettuce leaves!",
    category: "Seaweed",
    habitat: "Shallow coastal waters worldwide",
    funFact: "Edible and packed with vitamins - it's like the ocean's salad bar!",
    population: 25000000,
    populationLabel: "25M green leaves!",
    conservationStatus: "Abundant",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "sea-sparkle",
    name: "Sea Sparkle",
    description: "Magical bioluminescent dinoflagellate that makes the ocean glow like stars!",
    category: "Plankton",
    habitat: "Marine waters worldwide",
    funFact: "Creates stunning blue light when disturbed - nature's own fireworks!",
    population: 1000000000,
    populationLabel: "1B twinkling lights!",
    conservationStatus: "Abundant",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "thalassionema-nitzschioides",
    name: "Thalassionema nitzschioides",
    description: "Needle-shaped diatom that forms beautiful glass-like structures in the ocean!",
    category: "Diatom",
    habitat: "Marine phytoplankton communities",
    funFact: "Their intricate glass shells create some of the most beautiful microscopic art!",
    population: 500000000,
    populationLabel: "500M glass artists!",
    conservationStatus: "Abundant",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
    ]
  },
  {
    id: "rhizosolenia-hebetata",
    name: "Rhizosolenia hebetata",
    description: "Long, chain-forming diatom that creates underwater highways for nutrients!",
    category: "Diatom",
    habitat: "Open ocean waters",
    funFact: "Can form chains several meters long and are crucial for ocean carbon cycling!",
    population: 800000000,
    populationLabel: "800M chain builders!",
    conservationStatus: "Abundant",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    detailImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
    ]
  }
];

// Add more species to reach the full list...
export const getAllSpecies = () => speciesData;
export const getSpeciesById = (id: string) => speciesData.find(species => species.id === id);
export const getSpeciesByCategory = (category: string) => speciesData.filter(species => species.category === category);