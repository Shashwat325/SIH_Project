import { Search, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
        <div className="flex items-center justify-between ">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-accent transition-colors">
            🌊 OceanExplorer
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
            <button className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-accent border border-border rounded-lg hover:border-accent transition-colors">
              <User className="w-4 h-4" />
              Sign In
            </button>
            <button className="ocean-button flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>
        </div>
      </div>

      
    </nav>
  );
};

export default Navigation;