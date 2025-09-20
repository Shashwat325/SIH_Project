import Tuna from '/src/assets/Yellowfin Tuna.jpg';
import clownfish from '/src/assets/Clarks clownfish.jpg';
import sardine from '/src/assets/Indian oil sardine.jpg';
import s2 from '/src/assets/sardine2.jpg';
import anchovy from '/src/assets/Indian anchovy.jpg';
import a2 from '/src/assets/anchovy2.jpeg';
import coasta from "/src/assets/Cossura coasta (segmented worm).png";
import mackerel from '/src/assets/mackerel.jpg';
import m2 from '/src/assets/mackerel2.jpg';
import mossy from '/src/assets/Mossy red seaweed.jpg';
import mr2 from '/src/assets/mr2.jpeg';
import lettuce from '/src/assets/Sea lettuce.jpg';
import l2 from '/src/assets/Sea lettuce2.jpg';
import sparkle from '/src/assets/Sea sparkle (bioluminescent dinoflagellate).jpg';
import sparkle2 from '/src/assets/Sea sparkle (bioluminescent dinoflagellate)2.jpg';
import Euconchoecia from '/src/assets/Euconchoecia aculeata (ostracod).png';
import Conchoecetta from '/src/assets/Conchoecetta giesbrechti (ostracod).png';
import Tripos from '/src/assets/Tripods furca (copepod).png';
import Tri2 from '/src/assets/Tripods furca (copepod)2.png';
import Proceroecia from '/src/assets/Proceroecia procera (ostracod).png';
import Orthoconchoecia from '/src/assets/Orthoconchoecia atlantica (ostracod).png';
import Thalassionema from '/src/assets/Thalassionema nitzschioides (diatom).png';
import Rhizosolenia from '/src/assets/Rhizosolenia hebetata (diatom).png';
import Proboscia from '/src/assets/Proboscia alata (diatom).png';
import enflata from '/src/assets/Flaccisagitta enflata.png';
import latreillii from '/src/assets/Lumibrineris latreilli (bristle worm).png';
import cincta from '/src/assets/Magelona cincta (polychaete worm).png';
import pinnata from '/src/assets/Paraprionospio pinnata (polychaete worm).png';
import pusilla from '/src/assets/Pseudanchialina pusilla (opossum shrimp).png';
import draco from '/src/assets/Pterosagitta draco (arrow worm).png';
import pacifia from '/src/assets/Serratosagitta pacifica (arrow worm).png';
import parva from '/src/assets/Sigambra parva (polychaete worm).png';
import gracilis from '/src/assets/Siriella gracilis (opossum shrimp).png';
import sh2 from '/src/assets/sh2.webp'
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
    description: "Yellowfin tuna are strong schoolers. They often form schools with other tuna species, such as skipjack and bigeye tuna, and are also known to associate with dolphins and whales. They will also congregate under floating objects like logs, seaweed, or even boats, a behavior that is often exploited by commercial fishermen.",
    category: "Fish",
    habitat: "Open ocean waters worldwide",
    funFact: "Can swim up to 75 km/h and dive to depths of 250 meters!",
    population: 1200000,
    populationLabel: "1.2M speedy swimmers!",
    conservationStatus: "Near Threatened",
    image: Tuna,
    detailImages: [Tuna,"https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600&h=400&fit=crop"]
  },
  {
    id: "clarks-clownfish",
    name: "Clark's Clownfish",
    description: "Clark's clownfish (Amphiprion clarkii), also known as the yellowtail clownfish, is one of the most widely distributed and least host-specific anemonefish species. Found throughout the Indo-Pacific from the Persian Gulf to Western Australia, it has a remarkable symbiotic relationship with sea anemones.",
    category: "Fish",
    habitat: "Coral reefs of the Indo-Pacific",
    funFact: "All clownfish are born male, but can change sex to female if the dominant female dies.",
    population: 450000,
    populationLabel: "450K reef dwellers",
    conservationStatus: "Least Concern",
    image: clownfish,
    detailImages: [clownfish]
  },
   {
    id: "indian-oil-sardine",
    name: "Indian Oil Sardine",
    description: "The Indian oil sardine (Sardinella longiceps) is a small, oily fish found in large numbers along the Indian coastline, especially in the Arabian Sea. It is one of the most important fish species for India’s coastal fisheries, both economically and nutritionally.",
    category: "Fish",
    habitat: "Coastal waters of the Indian subcontinent",
    funFact: "Known for its high oil content, making it a valuable source of omega-3 fatty acids.",
    population: 25000000,
    populationLabel: "25M shimmering shoals!",
    conservationStatus: "Least Concern",
    image: sardine,
    detailImages: [sardine,s2]
  },
  {
    id: "indian-anchovy",
    name: "Indian Anchovy",
    description: "The Indian anchovy (Stolephorus indicus), also known as Hardenberg's anchovy, is a species of ray-finned fish belonging to the family Engraulidae. These are small, schooling fish that are an important part of the marine ecosystem and a significant food source for both humans and larger predatory fish.",
    category: "Fish",
    habitat: "Coastal and brackish waters of the Indian Ocean",
    funFact: "They are a key prey species for larger fish, birds, and marine mammals.",
    population: 15000000,
    populationLabel: "15M silver slivers!",
    conservationStatus: "Least Concern",
    image: anchovy,
    detailImages: [anchovy,a2]
  },
  {
    id: "indian-mackerel",
    name: "Indian Mackerel",
    description: "The Indian mackerel, scientifically known as Rastrelliger kanagurta, is a highly significant fish species in the Indo-Pacific region. It's a key part of the marine ecosystem and a major component of coastal fisheries.",
    category: "Fish",
    habitat: "Coastal waters of the Indo-Pacific",
    funFact: "Forms large schools near the surface, making them a common sight for fishermen.",
    population: 30000000,
    populationLabel: "30M striped schools!",
    conservationStatus: "Least Concern",
    image: m2,
    detailImages: [m2,mackerel]
  },
  {
    id: "mossy-red-seaweed",
    name: "Mossy red seaweed",
    description: "A type of red algae that forms intricate, branching, moss-like structures on rocky surfaces.",
    category: "Algae",
    habitat: "Coastal tide pools and rocky shores",
    funFact: "Plays a crucial role in providing shelter and food for small marine invertebrates.",
    population: 5000000,
    populationLabel: "5M patches of red!",
    conservationStatus: "Not Evaluated",
    image: mossy,
    detailImages: [mossy,mr2]
  },
  {
    id: "sea-lettuce",
    name: "Sea lettuce",
    description: "A common green seaweed with thin, blade-like fronds resembling lettuce leaves.Sea lettuce is a cosmopolitan species, meaning it is found in oceans and coastal waters across the globe, from tropical to polar climates.",
    category: "Algae",
    habitat: "Intertidal zones and estuaries worldwide",
    funFact: "Can be used in human cuisine, particularly in salads and soups.",
    population: 10000000,
    populationLabel: "10M green fronds!",
    conservationStatus: "Not Evaluated",
    image: lettuce,
    detailImages: [lettuce,l2]
  },
  {
    id: "sea-sparkle",
    name: "Sea sparkle (bioluminescent dinoflagellate)",
    description: "A single-celled organism that glows with a brilliant blue light when disturbed.These organisms are found in coastal waters worldwide, from tropical to temperate and northern seas.",
    category: "Plankton",
    habitat: "Coastal marine environments",
    funFact: "Causes the 'bioluminescent waves' phenomenon, a breathtaking natural light show at night.",
    population: 100000000,
    populationLabel: "100M glowing wonders!",
    conservationStatus: "Not Evaluated",
    image: sparkle,
    detailImages: [sparkle,sparkle2]
  },
  {
    id: "thalassionema-nitzschioides",
    name: "Thalassionema nitzschioides (diatom)",
    description: "A chain-forming diatom, a type of microscopic algae, with a rectangular or needle-like shape.",
    category: "Plankton",
    habitat: "Marine and freshwater environments",
    funFact: "Forms long, zigzagging chains, making it easily identifiable under a microscope.",
    population: 500000000,
    populationLabel: "500M tiny chains!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "rhizosolenia-hebetata",
    name: "Rhizosolenia hebetata (diatom)",
    description: "A large, cylindrical diatom known for its long, hair-like extensions.",
    category: "Plankton",
    habitat: "Open ocean waters",
    funFact: "A crucial primary producer, forming the base of many marine food webs.",
    population: 400000000,
    populationLabel: "400M ocean 'hair'!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "proboscia-alata",
    name: "Proboscia alata (diatom)",
    description: "A common marine diatom with a long, slender, and curved cell shape.",
    category: "Plankton",
    habitat: "Coastal and open ocean waters",
    funFact: "Its distinctive shape helps it to stay afloat in the water column and absorb sunlight.",
    population: 350000000,
    populationLabel: "350M microscopic rods!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "euconchoecia-aculeata",
    name: "Euconchoecia aculeata (ostracod)",
    description: "A small, shrimp-like crustacean with a bivalve-like shell.",
    category: "Crustacean",
    habitat: "Coastal and deep ocean waters",
    funFact: "Many ostracods are bioluminescent and can emit light to startle predators.",
    population: 80000000,
    populationLabel: "80M shelled wonders!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "conchoecetta-giesbrechti",
    name: "Conchoecetta giesbrechti (ostracod)",
    description: "A planktonic ostracod with a transparent, elongated shell.",
    category: "Crustacean",
    habitat: "Mesopelagic zone of the ocean",
    funFact: "They are a common food source for many deep-sea fish and squid.",
    population: 75000000,
    populationLabel: "75M deep-sea gems!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "tripos-furca",
    name: "Tripos furca (copepod)",
    description: "A tiny crustacean with a distinct three-pronged tail.",
    category: "Crustacean",
    habitat: "Tropical and subtropical waters",
    funFact: "Despite their small size, they are a significant food source for fish and marine mammals.",
    population: 150000000,
    populationLabel: "150M three-tailed friends!",
    conservationStatus: "Not Evaluated",
    image: Tripos,
    detailImages: [Tripos,Tri2]
  },
  {
    id: "proceroecia-procera",
    name: "Proceroecia procera (ostracod)",
    description: "A planktonic ostracod with a delicate and elongated shell.",
    category: "Crustacean",
    habitat: "Epipelagic and mesopelagic zones",
    funFact: "Their translucent shells make them difficult for predators to spot.",
    population: 60000000,
    populationLabel: "60M see-through shells!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "orthoconchoecia-atlantica",
    name: "Orthoconchoecia atlantica (ostracod)",
    description: "A common ostracod species with a rounded, pill-like shell.",
    category: "Crustacean",
    habitat: "North Atlantic Ocean",
    funFact: "They are often used as an indicator species for water quality and health.",
    population: 90000000,
    populationLabel: "90M Atlantic travelers!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "cossura-coasta",
    name: "Cossura coasta (segmented worm)",
    description: "A small, segmented worm that lives in marine sediments.",
    category: "Worm",
    habitat: "Ocean floor sediments",
    funFact: "They are 'deposit feeders,' meaning they eat organic matter found in the mud.",
    population: 20000000,
    populationLabel: "20M muddy dwellers!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "flaccisagitta-enflata",
    name: "Flaccisagitta enflata",
    description: "A transparent, torpedo-shaped marine arrow worm.",
    category: "Worm",
    habitat: "Tropical and subtropical waters",
    funFact: "They are voracious predators of copepods and other small plankton.",
    population: 18000000,
    populationLabel: "18M living arrows!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "lumbrineris-latreillii",
    name: "Lumbrineris latreillii",
    description: "A type of polychaete worm with a long, iridescent body.",
    category: "Worm",
    habitat: "Sandy and muddy sea beds",
    funFact: "Its unique jaws allow it to capture a variety of small prey.",
    population: 12000000,
    populationLabel: "12M iridescent crawlers!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "magelona-cincta",
    name: "Magelona cincta",
    description: "A slender, burrowing polychaete worm with two long, shovel-like tentacles on its head.",
    category: "Worm",
    habitat: "Soft sediments of the ocean floor",
    funFact: "Uses its unique tentacles to sweep food particles from the water and sediment.",
    population: 15000000,
    populationLabel: "15M tentacled diggers!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "paraprionospio-pinnata",
    name: "Paraprionospio pinnata",
    description: "A spionid polychaete worm with distinctively long, feathered gills.",
    category: "Worm",
    habitat: "Coastal marine environments",
    funFact: "Its gills are highly effective at filtering oxygen from the water.",
    population: 9000000,
    populationLabel: "9M feathered friends!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "pseudanchialina-pusilla",
    name: "Pseudanchialina pusilla",
    description: "A small, transparent mysid shrimp-like crustacean.",
    category: "Crustacean",
    habitat: "Coastal and shallow waters",
    funFact: "Often forms swarms near the surface, providing a food source for fish.",
    population: 25000000,
    populationLabel: "25M clear swimmers!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "pterosagitta-draco",
    name: "Pterosagitta draco",
    description: "A species of arrow worm with prominent side fins, giving it a 'winged' appearance.",
    category: "Worm",
    habitat: "Open ocean, tropical and subtropical seas",
    funFact: "Its wings help it to dart and maneuver quickly while hunting prey.",
    population: 14000000,
    populationLabel: "14M winged hunters!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "serratosagitta-pacifica",
    name: "Serratosagitta pacifica",
    description: "A planktonic arrow worm with a streamlined body and serrated hooks for grasping prey.",
    category: "Worm",
    habitat: "Pacific Ocean waters",
    funFact: "Its name, 'serrated arrow,' refers to the sharp hooks used for catching food.",
    population: 10000000,
    populationLabel: "10M Pacific arrows!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "sigambra-parva",
    name: "Sigambra parva",
    description: "A small, burrowing polychaete worm found in soft sediments.",
    category: "Worm",
    habitat: "Marine mud and sand",
    funFact: "Plays an important role in recycling nutrients in the ocean floor ecosystem.",
    population: 8000000,
    populationLabel: "8M small recyclers!",
    conservationStatus: "Not Evaluated",
    image: null,
    detailImages: null
  },
  {
    id: "sirella-gracilis",
    name: "Sirella gracilis",
    description: "A species of mysid shrimp with a slender, delicate body.",
    category: "Crustacean",
    habitat: "Coastal and shelf waters",
    funFact: "Often found in large, dense schools, serving as a critical food source for fish and birds.",
    population: 30000000,
    populationLabel: "30M graceful swimmers!",
    conservationStatus: "Not Evaluated",
    image: gracilis,
    detailImages: [gracilis,sh2]
  } 

];

// Add more species to reach the full list...
export const getAllSpecies = () => speciesData;
export const getSpeciesById = (id: string) => speciesData.find(species => species.id === id);
export const getSpeciesByCategory = (category: string) => speciesData.filter(species => species.category === category);