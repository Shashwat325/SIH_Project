import { Map, Search, Navigation } from "lucide-react";
import { MapContainer, TileLayer, useMapEvents, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import MapComponent from "./MapComponent";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-bubble-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Map className="w-16 h-16 text-primary mr-4 bubble-float" />
              <h1 className="text-5xl font-bold text-foreground">
                Ocean Explorer Map
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-slate-800">
              
Search for your data and see their exact locations on the map! Dive into the ocean world and discover where amazing marine life thrives. Pinpoint your favorite creatures, track real-time research, and unlock a deeper understanding of our blue planet.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="ocean-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Interactive Species Mapping</h2>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Explore precise locations where marine species have been observed and studied.
                  Our interactive map provides real-time data on species distribution, migration patterns,
                  and conservation zones.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Real-time species tracking data
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Marine protected areas
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-secondary rounded-full"></div>
                    Research station locations
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Migration routes and seasonal patterns
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Know about the poluuted area in ocean
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Natural resources reserves location
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Areas prone to Shipwrecks
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Discover marine life at a particular area
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Use voice command to track species data
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Pinning data on screen to correlate species
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Tracking data of a particular area 
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ocean-accent rounded-full"></div>
                    Searching about location of marine life in simple language
                  </li>
                </ul>
              </div>

              {/* <div className="ocean-card p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  🌊 Coming Soon Features
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <div>• Interactive 3D ocean depth visualization</div>
                  <div>• Temperature and current overlays</div>
                  <div>• Collaborative research data sharing</div>
                  <div>• Live satellite imagery integration</div>
                </div>
              </div> */}
            </div>

            {/* Right Content - Map Placeholder */}
            <div className="space-y-8">
              <div className="ocean-card p-8 text-center">
                <div className="bg-gradient-to-br from-ocean-light to-ocean-muted rounded-xl h-96 flex items-center justify-center mb-8 relative overflow-hidden">
                  {/* Animated ocean waves */}
                  <div className="absolute inset-0 bg-wave-pattern opacity-30 w-full"></div>
                  <div className="relative z-10  w-full text-center">
                    <MapContainer center={[20, 78]}
                      zoom={3.3}
                      style={{ height: '100vh', width: '100%' }}
                      className="w-full h-full"
                      worldCopyJump={false}
                      maxBounds={[[5, 60], [38, 100]]}
                      maxBoundsViscosity={1.0}><TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      /></MapContainer>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Interactive Map
                    </h3>
                    <p className="text-ocean-secondary">
                      Loading ocean exploration data...
                    </p>
                  </div>

                  {/* Floating location pins */}
                  <div className="absolute top-20 left-20 w-4 h-4 bg-primary rounded-full shadow-lg bubble-float" style={{ animationDelay: '0s' }} />
                  <div className="absolute bottom-24 right-16 w-3 h-3 bg-accent rounded-full shadow-lg bubble-float" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-32 right-32 w-5 h-5 bg-ocean-secondary rounded-full shadow-lg bubble-float" style={{ animationDelay: '2s' }} />
                </div>

                <button className="ocean-button w-full mb-4" onClick={() => navigate('/map/full')}>
                  <Navigation className="w-5 h-5 mr-2" />
                  Go to Interactive Map
                </button>

                <p className="text-sm text-muted-foreground">
                  Go to the full and interactive map to track the data  of marine life on your screen
                </p>
              </div>

              {/* Quick Access */}
              <div className="grid grid-cols-2 gap-4">
                <Link to="/species" className="ocean-card p-6 text-center hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">🐠</div>
                  <div className="text-sm font-medium text-foreground">View Species</div>
                </Link>
                <div className="ocean-card p-6 text-center cursor-not-allowed opacity-75">
                  <div className="text-3xl mb-3">📊</div>
                  <div className="text-sm font-medium text-muted-foreground">Research Data</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey through the ocean depths and discover the incredible world of marine life
          </p>
          <Link to="/species" className="ocean-button">
            Start Exploring Species
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MapPage;