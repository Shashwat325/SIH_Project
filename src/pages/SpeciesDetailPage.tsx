import { useParams, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { ArrowLeft, Heart, Share2, MapPin, Info, FileAxis3D } from "lucide-react";
import { getSpeciesById } from "@/data/speciesData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpeciesDetailPage = () => {
  const { id } = useParams();
  const species = getSpeciesById(id || "");
  const chartRef = useRef(null);

  useEffect(() => {
    // Animate chart on mount
    if (chartRef.current) {
      const chart = chartRef.current;
      if (chart) {
        chart.update('active');
      }
    }
  }, []);

  if (!species) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🌊</div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Species Not Found</h2>
          <p className="text-muted-foreground mb-8">The species you're looking for doesn't exist in our database.</p>
          <Link to="/species" className="ocean-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Species
          </Link>
        </div>
      </div>
    );
  }

  // Generate population data for chart animation
  const populationData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Pop Overt',
        data: [
          Math.floor(species.population * 0.8),
          Math.floor(species.population * 0.85),
          Math.floor(species.population * 0.9),
          Math.floor(species.population * 0.95),
          Math.floor(species.population * 0.98),
          species.population
        ],
        borderColor: 'hsl(157, 90%, 26%)',
        backgroundColor: 'hsl(157, 90%, 26%, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(157, 57%, 31%)',
        pointBorderColor: 'hsl(157, 90%, 26%)',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutBounce' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(157, 72%, 21%)',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'Population Over Time',
        color: 'hsl(157, 72%, 21%)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(157, 25%, 85%)',
        },
        ticks: {
          color: 'hsl(157, 25%, 65%)',
        },
      },
      y: {
        grid: {
          color: 'hsl(157, 25%, 85%)',
        },
        ticks: {
          color: 'hsl(157, 25%, 65%)',
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-bubble-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/species"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-600" />
              Back to Species
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm font-medium bg-primary text-primary-foreground rounded-full">
                  {species.category}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${species.conservationStatus === 'Least Concern' ? 'bg-green-400 text-green-900' :
                    species.conservationStatus === 'Near Threatened' ? 'bg-yellow-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                  }`}>
                  {species.conservationStatus}
                </span>
              </div>

              <h1 className="text-5xl font-bold text-foreground mb-6">
                {species.name}
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-slate-800">
                {species.description}
              </p>

              {/* <div className="flex gap-4">
                <button className="ocean-button">
                  <Heart className="w-4 h-4 mr-2" />
                  Favorite
                </button>
                <button className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:border-accent transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {species.detailImages.map((image, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src={image}
                    alt={`${species.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info Cards */}
            <div className="lg:col-span-2 space-y-8">
              <div className="ocean-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Species Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Habitat</h3>
                    <p className="text-muted-foreground">{species.habitat}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Population</h3>
                    <p className="text-muted-foreground">{species.populationLabel}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-2">Fun Fact! 🎉</h3>
                  <p className="text-muted-foreground">{species.funFact}</p>
                </div>
              </div>

              {/* Population Chart */}
              <div className="ocean-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Population Trends</h2>
                <div className="bg-background p-6 rounded-lg border border-border">
                  <Line ref={chartRef} data={populationData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="ocean-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </h3>
                <p className="text-muted-foreground mb-4">{species.habitat}</p>
                <Link to="/map/full" state={{ query: species.name }} className="ocean-button w-full justify-center">
                  View on Map
                </Link>
              </div>
              
              <div className="ocean-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileAxis3D className="w-5 h-5" />
                  Visualization
                </h3>
                <p className="text-muted-foreground mb-4">Visualize {species.name} in form of a 3d model</p>
                <Link to="/model" state={{ query: `generate ${species.name}` }} className="ocean-button w-full justify-center">
                  Generate 3D Model
                </Link>
              </div>
              <div className="ocean-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileAxis3D className="w-5 h-5" />
                  Taxonomy
                </h3>
                <p className="text-muted-foreground mb-4">Discover the classification of {species.name}.</p>
                <Link to="/taxonomy" state={{ query: species.name }} className="ocean-button w-full justify-center">
                  View Taxonomy
                </Link>
              </div>

              <div className="ocean-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{species.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">{species.conservationStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Population</span>
                    <span className="font-medium">{species.population.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpeciesDetailPage;