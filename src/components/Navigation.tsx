import { Search, User, UserPlus,MapPin } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import icon from '/src/assets/circle.png'
const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const menuItems = [
    { name: "HOME", path: "/" },
    { name: "MAP", path: "/map" },
    { name: "SPECIES", path: "/species" },
    { name: "DATA FORUM", path: "/forum" },
    { name: "DNA", path: "/dna" },
  ];

  return (
    <nav className="bg-card shadow-md border-b border-border"style={{position: 'sticky', top: 0, zIndex: 500}}>
      {/* Top Navigation Bar */}
      <div className="container mx-auto px-4 py-3"  >
        <div className="flex flex-row items-center justify-between ">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-accent flex flex-row transition-colors">
            
            <div className="flex flex-row items-center justify-center"><img src={icon} alt="" style={{height:'8vh',width:'8vw'}} />Blue View</div>
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search ocean species..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input"
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-3">
            <Link to='/species'>
            <button className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-accent border border-border rounded-lg hover:border-accent transition-colors">
              <div className="text-xl mb-1">🦈</div>
              
              View species
            </button>
            </Link>
            <Link to='/map/full'>
            <button className="ocean-button flex items-center gap-2">
              <MapPin className="w-4 h-4 " />
              View Map
            </button>
            </Link>
          </div>
        </div>
      </div>

      
    </nav>
  );
};

export default Navigation;