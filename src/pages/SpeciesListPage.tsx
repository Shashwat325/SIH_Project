import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import SpeciesCard from "@/components/SpeciesCard";
import { getAllSpecies } from "@/data/speciesData";

const SpeciesListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const species = getAllSpecies();

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(species.map(s => s.category))];
    return cats;
  }, [species]);

  const filteredSpecies = useMemo(() => {
    return species.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [species, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-bubble-gradient py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Marine Species Gallery
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our comprehensive collection of ocean creatures, from the tiniest plankton to the mightiest predators
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search species..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-muted-foreground">
            Showing {filteredSpecies.length} of {species.length} species
          </div>
        </div>
      </section>

      {/* Species Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredSpecies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredSpecies.map((species, index) => (
                <div key={species.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <SpeciesCard
                    id={species.id}
                    name={species.name}
                    description={species.description}
                    image={species.image}
                    category={species.category}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🐠</div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No species found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SpeciesListPage;