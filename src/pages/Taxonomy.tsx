import React, { useState, useEffect, useRef } from 'react';
import tree from '/src/assets/taxonomytree.png';
import { useLocation } from 'react-router-dom';
interface Species {
  id: string;
  common_name: string;
  scientific_name: string;
  rank: string;
}

interface PopularSpecies {
  common_name: string;
  scientific_name: string;
}

interface ApiResponse {
  results: Species[];
}

interface SpeciesInfo {
  vernacular_name: string;
  tree_url: string;
  identifiers?: {
    headers: { [key: string]: number };
    ids: { [key: string]: string[] };
  };
}

const Taxonomy: React.FC = () => {
  const scientifictocommon = {
    "Rastrelliger_kanagurta": "Indian Mackerel",
    "Thunnus_albacares": "Yellowfin Tuna",
    "Amphiprion clarkii": "Clark's Clownfish",
    "Stolephorus_indicus": "Indian Anchovy",
    "Sardinella_longiceps": "Indian Oil Sardine",
    "Hypnea_musciformis": "Mossy red seaweed"
  }
  const wtf={ "Yellowfin Tuna" : {
    name: "Thunnus_albacares",
    code1: '916275',
    code2: 'x573,y-146,w1.0805'
  },
  "Indian Mackerel":{name:"Rastrelliger_kanagurta",code1:'916275',code2: 'x573,y-146,w1.0805'},
  "Clark's Clownfish":{name:'Amphiprion clarkii',code1: '674637',code2: 'x331,y457,w0.8857'},
  "Indian Anchovy":{name:'Stolephorus indicus',code1: '93274',code2: 'x683,y713,w0.8857'},
  "Indian Oil Sardine":{name:'Sardinella longiceps', code1:'432673',code2: 'x1042,y435,w0.8857'},
  "Mossy red seaweed":{name:'Chondrus crispus',code1: '878946',code2: 'x331,y228,w0.8857'}
}
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualizationHtml, setVisualizationHtml] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [popularSpeciesFromAPI, setPopularSpeciesFromAPI] = useState<PopularSpecies[]>([]);
  const location = useLocation();
  const fq = location.state?.query || "";
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const visualizationSectionRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'http://localhost:8000';

  // Message display functions
  const showMessage = (message: string, type: 'error' | 'success' | 'warning') => {
    clearMessages();

    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      const messageDiv = document.createElement('div');
      let className = '';
      let bgColor = '';
      let textColor = '';
      let borderColor = '';

      switch (type) {
        case 'error':
          className = 'error-message';
          bgColor = 'bg-red-100';
          textColor = 'text-red-700';
          borderColor = 'border-red-300';
          break;
        case 'warning':
          className = 'warning-message';
          bgColor = 'bg-yellow-100';
          textColor = 'text-yellow-700';
          borderColor = 'border-yellow-300';
          break;
        default:
          className = 'success-message';
          bgColor = 'bg-green-100';
          textColor = 'text-green-700';
          borderColor = 'border-green-300';
      }

      messageDiv.className = `${className} p-4 rounded-xl mb-6 border ${bgColor} ${textColor} ${borderColor}`;
      messageDiv.textContent = message;
      searchSection.appendChild(messageDiv);

      // Auto-remove success and warning messages after 5 seconds
      if (type === 'success' || type === 'warning') {
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
          }
        }, 5000);
      }
    }
  };

  const clearMessages = () => {
    const messages = document.querySelectorAll('.error-message, .success-message, .warning-message');
    messages.forEach(message => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    });
  };

  useEffect(() => {
    checkAPIConnection();
    loadPopularSpecies();
  }, []);

  const checkAPIConnection = async () => {
    try {
      setConnectionStatus('Checking...');

      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();

      if (response.ok) {
        setConnectionStatus('✅ API Connected');
        console.log('API Response:', data);
        testOneZoomAPI();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      setConnectionStatus(`❌ API Connection Failed: ${error.message}`);
      console.error('API Connection Error:', error);
    }
  };

  const testOneZoomAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test-onezoom`);
      const data = await response.json();
      console.log('OneZoom API test results:', data);

      if (data.results && Object.keys(data.results).length > 0) {
        setConnectionStatus('✅ API & OneZoom Connected');
      }
    } catch (error) {
      console.error('OneZoom API test failed:', error);
    }
  };

  const loadPopularSpecies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/popular-species`);
      const data = await response.json();
      setPopularSpeciesFromAPI(data.popular_species || []);
    } catch (error) {
      console.error('Error loading popular species:', error);
    }
  };


  const showStaticOneZoom = (name: string, ott: string, hash: string) => {

    setSearchQuery(scientifictocommon[name]);
    const embedUrl = `https://www.onezoom.org/life/@${name.replace(' ', '_')}=${ott}?otthome=%40Scombrini%3D415032#${hash}`;

    const htmlContent = `
      <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
        <strong>🌳 Featured: ${name}</strong> (OTT ID: ${ott})
        <br><small style="color: #666;">Interactive tree visualization powered by OneZoom. Click and drag to explore!</small>
      </div>
      <div style="position: relative; background: #f0f0f0; border-radius: 10px; padding: 5px;">
        <iframe src="${embedUrl}" class="w-full h-96 md:h-[600px] border-none rounded-lg shadow-lg bg-white" frameborder="0"
          style="background: white; border-radius: 5px;">
        </iframe>
      </div>
    `;

    setVisualizationHtml(htmlContent);
    setShowVisualization(true);

    setTimeout(() => {
      visualizationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const searchSpecies = async (query?: string) => {
    const searchTerm = query || searchQuery.trim();

    if (!searchTerm) {
      showMessage('Please enter a species name to search.', 'error');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(`${API_BASE_URL}/search-species?common_name=${encodeURIComponent(searchTerm)}&limit=10`);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const data: ApiResponse = await response.json();
      setLoading(false);
      setResults(data.results);
      setShowResults(data.results.length > 0);

      if (data.results.length > 0) {
        showMessage(`Found ${data.results.length} species for "${searchTerm}"`, 'success');
      } else {
        showMessage(`No species found for "${searchTerm}". Try a different name like "human", "lion", or "yellowfin tuna".`, 'error');
      }
    } catch (error: any) {
      setLoading(false);
      let errorMessage = 'Unknown error occurred';

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }

      showMessage(`Error searching for species: ${errorMessage}`, 'error');
      console.error('Full search error:', error);
    }
  };
  useEffect(() => {
    if (fq) {
      
      Object.keys(wtf).includes(fq)?(showStaticOneZoom(wtf[fq].name,wtf[fq].code1,wtf[fq].code2)):showStaticOneZoom('',"","");
    }
  }, [fq])

  const showTreeVisualization = async (speciesId: string, speciesName: string) => {
    setLoading(true);
    clearMessages();

    try {
      const embedUrl = `https://www.onezoom.org/life.html/@${speciesId}?vis=spiral&anim=flight`;
      setLoading(false);

      const htmlContent = `
        <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
          <strong>🌳 Exploring: ${speciesName}</strong> (OTT ID: ${speciesId})
          <br><small style="color: #666;">Interactive tree visualization powered by OneZoom. Click and drag to explore!</small>
        </div>
        <div style="position: relative; background: #f0f0f0; border-radius: 10px; padding: 5px;">
          <iframe src="${embedUrl}" class="w-full h-96 md:h-[600px] border-none rounded-lg shadow-lg bg-white" frameborder="0" 
                  style="background: white; border-radius: 5px;">
          </iframe>
        </div>
        <div style="margin-top: 15px; text-align: center; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <a href="${embedUrl}" target="_blank" class="bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-3 rounded-xl font-semibold uppercase tracking-wide hover:shadow-lg transition-all duration-300">🔗 Open in New Tab</a>
          <button onclick="getSpeciesInfo('${speciesId}')" class="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold uppercase tracking-wide hover:shadow-lg transition-all duration-300">ℹ️ Species Details</button>
          <a href="https://www.onezoom.org/life/@${speciesId}" target="_blank" class="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold uppercase tracking-wide hover:shadow-lg transition-all duration-300">🌍 OneZoom Page</a>
        </div>
        <div style="margin-top: 10px; font-size: 0.9rem; color: #666; text-align: center;">
          <strong>Direct OneZoom URL:</strong> <code style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 12px; word-break: break-all;">${embedUrl}</code>
        </div>
      `;

      setVisualizationHtml(htmlContent);
      setShowVisualization(true);
      showMessage(`Tree visualization loaded for ${speciesName}`, 'success');

      setTimeout(() => {
        visualizationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error: any) {
      setLoading(false);
      let errorMessage = 'Unknown error occurred';

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }

      console.error('Full visualization error:', error);
      showMessage(`Error loading tree visualization: ${errorMessage}`, 'error');

      // Show a fallback option
      const fallbackHtml = `
        <div style="padding: 20px; text-align: center; background: #f8f9fa; border-radius: 10px;">
          <h3>⚠️ Visualization Loading Failed</h3>
          <p>Unable to load the interactive tree view, but you can still access OneZoom directly:</p>
          <div style="margin-top: 15px;">
            <a href="https://www.onezoom.org/life/@${speciesId}" target="_blank" class="bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-3 rounded-xl font-semibold uppercase tracking-wide hover:shadow-lg transition-all duration-300">
              🌍 View ${speciesName} on OneZoom
            </a>
          </div>
        </div>
      `;
      setVisualizationHtml(fallbackHtml);
      setShowVisualization(true);
    }
  };

  // Expose getSpeciesInfo to global scope for onclick handlers
  useEffect(() => {
    (window as any).getSpeciesInfo = async (speciesId: string) => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/species-info/${speciesId}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data: SpeciesInfo = await response.json();
        setLoading(false);

        // Create a modal-like display for species information
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: white; padding: 30px; border-radius: 15px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 600px; max-height: 80vh; overflow-y: auto; z-index: 1000;
        `;

        let identifiersHtml = '';
        if (data.identifiers && data.identifiers.ids && data.identifiers.ids[speciesId.toString()]) {
          const headers = data.identifiers.headers;
          const ids = data.identifiers.ids[speciesId.toString()];

          identifiersHtml = '<h4>External Database Links:</h4><ul>';
          Object.keys(headers).forEach(db => {
            const index = headers[db];
            const id = ids[index];
            if (id) {
              let url = '';
              switch (db) {
                case 'wikidata':
                  url = `https://www.wikidata.org/wiki/${id}`;
                  break;
                case 'eol':
                  url = `https://eol.org/pages/${id}`;
                  break;
                case 'ncbi':
                  url = `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${id}`;
                  break;
                case 'gbif':
                  url = `https://www.gbif.org/species/${id}`;
                  break;
              }
              if (url) {
                identifiersHtml += `<li><strong>${db.toUpperCase()}:</strong> <a href="${url}" target="_blank" style="color: #2563eb; text-decoration: underline;">${id}</a></li>`;
              }
            }
          });
          identifiersHtml += '</ul>';
        }

        infoDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>🔬 Species Information</h2>
            <button onclick="this.parentElement.parentElement.remove(); document.getElementById('overlay').remove();" 
                    style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 18px;">×</button>
          </div>
          <div>
            <p><strong>OTT ID:</strong> ${speciesId}</p>
            <p><strong>Common Name:</strong> ${data.vernacular_name || 'Not available'}</p>
            ${identifiersHtml}
            <div style="margin-top: 20px; text-align: center;">
              <a href="${data.tree_url}" target="_blank" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View on OneZoom</a>
            </div>
          </div>
        `;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.style.cssText = `
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
          background: rgba(0,0,0,0.5); z-index: 999;
        `;
        overlay.onclick = () => {
          infoDiv.remove();
          overlay.remove();
        };

        document.body.appendChild(overlay);
        document.body.appendChild(infoDiv);

      } catch (error: any) {
        setLoading(false);
        showMessage(`Error loading species info: ${error.message}`, 'error');
        console.error('Species info error:', error);
      }
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchSpecies();
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-5" >
      <div className="max-w-7xl mx-auto bg-green-200 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-10">

          {/* Search Section */}
          <div className="search-section bg-gray-50 p-8 rounded-2xl mb-8 shadow-lg ">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-600">
              Search Species
            </h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a species name to know more!"
                className="flex-1 min-w-64 px-4 py-4 border-2 border-gray-300 rounded-xl text-lg focus:outline-none hover:border-green-500 focus:border-green-500 transition-colors"
              />
              <button
                onClick={() => searchSpecies()}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-400 hover:from-white hover:to-emerald-400 hover:text-green-700 hover:font-bold text-white rounded-xl font-semibold uppercase tracking-wide hover:shadow-lg transition-all duration-300"
              >
                Search
              </button>
            </div>

            {/* Static Popular Species Tags (matching original exactly) */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => showStaticOneZoom('Rastrelliger brachysoma', '916275', 'x573,y-146,w1.0805')}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:scale-105 hover:bg-green-100 hover:text-green-700 hover:font-bold transition-all duration-200"
              >
                Indian mackerel
              </button>
              <button
                onClick={() => showStaticOneZoom('Sardinella longiceps', '432673', 'x1042,y435,w0.8857')}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:scale-105 hover:bg-green-100 hover:text-green-700 hover:font-bold transition-all duration-200"
              >
                Indian oil sardine
              </button>
              <button
                onClick={() => showStaticOneZoom('Amphiprion clarkii', '674637', 'x331,y457,w0.8857')}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:scale-105 hover:bg-green-100 hover:text-green-700 hover:font-bold transition-all duration-200"
              >
                Clark's clownfish
              </button>
              <button
                onClick={() => showStaticOneZoom('Thunnus albacares', '833188', 'x775,y-16,w0.8857')}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:scale-105 hover:bg-green-100 hover:text-green-700 hover:font-bold transition-all duration-200"
              >
                Yellowfin tuna
              </button>
              <button
                onClick={() => showStaticOneZoom('Stolephorus indicus', '93274', 'x683,y713,w0.8857')}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:scale-105 hover:bg-green-100 hover:text-green-700 hover:font-bold transition-all duration-200"
              >
                Indian anchovy
              </button>
              <button
                onClick={() => showStaticOneZoom('Chondrus crispus', '878946', 'x331,y228,w0.8857')}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:scale-105 hover:bg-green-100 hover:text-green-700 hover:font-bold transition-all duration-200"
              >
                Mossy seaweed
              </button>
              <button
                onClick={() => showStaticOneZoom('Chondrus crispus', '878946', 'x331,y228,w0.8857')}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:scale-105 hover:bg-green-100 hover:text-green-700 hover:font-bold transition-all duration-200"
              >
                Box Jellyfish
              </button>
              <button
                onClick={() => showStaticOneZoom('Chondrus crispus', '878946', 'x331,y228,w0.8857')}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:scale-105 hover:bg-green-600 transition-all duration-200"
              >
                blue Whale
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-3 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Searching species...</p>
            </div>
          )}

          {/* Results Section */}
          {showResults && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-600">
                Search Results
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((species) => (
                  <div
                    key={species.id}
                    onClick={() => showTreeVisualization(species.id, species.common_name || species.scientific_name)}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-green-400 transition-all duration-300"
                  >
                    <div className="text-xl font-semibold text-gray-800 mb-2">
                      {species.common_name || 'Unknown'}
                    </div>
                    <div className="italic text-gray-600 mb-3">
                      {species.scientific_name}
                    </div>
                    <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs uppercase font-medium">
                      {species.rank || 'Unknown rank'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tree Visualization Section */}
          {showVisualization && (
            <div ref={visualizationSectionRef} className="bg-gray-50 p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-600">
                Species Tree Visualization
              </h2>
              <div
                ref={treeContainerRef}
                dangerouslySetInnerHTML={{ __html: visualizationHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Taxonomy;