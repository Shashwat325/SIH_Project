import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Menubar from "./components/Menubar";
import HomePage from "./pages/HomePage";
import SpeciesListPage from "./pages/SpeciesListPage";
import SpeciesDetailPage from "./pages/SpeciesDetailPage";
import MapPage from "./pages/MapPage";
import MapComponent from "./pages/MapComponent";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import ModelGenerator from "./pages/ModelGenerator";
import OceanicDataTool from "./pages/OceanicDataTool";
import Dataform from "./pages/Taxonomy";
import Taxonomy from "./pages/Taxonomy";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Menubar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/species" element={<SpeciesListPage />} />
            <Route path="/species/:id" element={<SpeciesDetailPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/map/full" element={<MapComponent />} />
            <Route path="/model" element={<ModelGenerator />} />
            <Route path="/taxonomy" element={<Taxonomy />} />
            <Route path="/forum" element={<OceanicDataTool />} />
            
            {/* <Route 
              path="/dna" 
              element={
                <PlaceholderPage 
                  title="DNA Analysis"
                  description="Dive into genetic data and molecular marine biology research"
                  icon="🧬"
                  comingSoonFeatures={[
                    "DNA sequence analysis tools",
                    "Phylogenetic tree visualization",
                    "Genetic diversity mapping",
                    "Species identification via DNA",
                    "Population genetics analysis",
                    "Marine biodiversity insights"
                  ]}
                />
              } 
            /> */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
