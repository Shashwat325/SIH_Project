import { Link } from "react-router-dom";
import { Fish, Map, Database, Dna, Waves, ArrowRight,FileAxis3D,LucideTrees } from "lucide-react";
import { useNavigate } from "react-router-dom";
import icon from '/src/assets/circle.png'
const HomePage = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: Fish,
      title: "Species Explorer",
      description: "Discover amazing ocean creatures from tiny plankton to majestic tuna",
      link: "/species",
      color: "text-primary"
    },
    {
      icon: Map,
      title: "Ocean Map",
      description: "Explore locations and habitats of marine species worldwide",
      link: "/map",
      color: "text-accent"
    },
    {
      icon: Database,
      title: "Data Forum",
      description: "Share and discuss marine research data with the community",
      link: "/forum",
      color: "text-ocean-secondary"
    },
    {
      icon: FileAxis3D,
      title: "3D visualization",
      description: "Watch 3D models of various marine species",
      link: "/model",
      color: "text-ocean-accent"
    },
    {
      icon: LucideTrees,
      title: "Taxonomy",
      description: "Explore the classification of marine species",
      link: "/taxonomy",
      color: "text-ocean-accent"
    },
    {
      icon: Dna,
      title: "DNA Analysis",
      description: "Dive into genetic data and molecular marine biology",
      link: "/dna",
      color: "text-ocean-accent"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ocean-gradient text-white">
        <div className="absolute inset-0 bg-wave-pattern opacity-30" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-row items-center justify-center mb-6">
              <img src={icon} alt="" style={{height:'10vh',width:'10vw'}}></img>
              <h1 className="text-6xl font-bold">
                
                Blue<span className="text-ocean-light">View</span>
              </h1>
            </div>
            <p className="text-xl text-ocean-light mb-8 leading-relaxed">
              Dive deep into the fascinating world of marine life! Discover species, explore habitats, 
              and contribute to ocean conservation through data and community.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/species" className="ocean-button bg-white text-primary hover:bg-ocean-light">
                <Fish className="w-5 h-5 mr-2" />
                Explore Species
              </Link>
              
            </div>
          </div>
        </div>
        
        {/* Floating bubbles decoration */}
        <div className="absolute bottom-10 left-10 w-4 h-4 bg-white/20 rounded-full bubble-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-20 w-6 h-6 bg-white/30 rounded-full bubble-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-20 right-10 w-3 h-3 bg-white/25 rounded-full bubble-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Explore the Ocean World
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From microscopic plankton to magnificent marine mammals, discover the incredible diversity of ocean life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link}>
                <div className={`ocean-card p-8 text-center h-full group fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`w-16 h-16 mx-auto mb-6 p-4 rounded-full bg-secondary group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-center text-primary group-hover:text-accent transition-colors">
                    <span className="mr-2">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Species Documented</div>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold text-accent mb-2">50M+</div>
              <div className="text-muted-foreground">Data Points Collected</div>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl font-bold text-ocean-secondary mb-2">200+</div>
              <div className="text-muted-foreground">Research Locations</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;