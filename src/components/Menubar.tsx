{/* Menu Bar */}
import { Search, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Menubar = () => {
    
  const location = useLocation();
    const menuItems = [
    { name: "HOME", path: "/" },
    { name: "MAP", path: "/map" },
    { name: "SPECIES", path: "/species" },
    { name: "DATA FORUM", path: "/forum" },
   
    { name: "3D Visualization", path: "/model" },
    { name: "Taxonomy", path: "/taxonomy" },
     { name: "DNA", path: "/dna" },
  ];
  return(
    <div>
      <div className="bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`py-4 px-2 font-medium transition-colors relative group ${
                  location.pathname === item.path
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground hover:text-accent"
                }`}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Menubar;