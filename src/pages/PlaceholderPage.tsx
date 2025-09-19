import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
  comingSoonFeatures: string[];
}

const PlaceholderPage = ({ title, description, icon, comingSoonFeatures }: PlaceholderPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-bubble-gradient py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-8xl mb-6">{icon}</div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="ocean-card p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
               Coming Soon!
            </h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              We're working hard to bring you amazing features for {title.toLowerCase()}. 
              Stay tuned for exciting updates that will enhance your ocean exploration experience!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                   Planned Features
                </h3>
                <ul className="space-y-3">
                  {comingSoonFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-left">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                   Current Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Database Setup</span>
                      <span className="text-primary font-medium">100%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">UI Design</span>
                      <span className="text-accent font-medium">75%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Core Features</span>
                      <span className="text-ocean-secondary font-medium">45%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-ocean-secondary h-2 rounded-full w-2/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link to="/species" className="ocean-button">
                Explore Species Instead
              </Link>
              <Link to="/" className="border-2 border-border text-foreground hover:border-primary hover:text-primary px-6 py-3 rounded-lg font-medium transition-all duration-300">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaceholderPage;