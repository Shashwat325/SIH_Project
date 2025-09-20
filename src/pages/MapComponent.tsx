import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import { useLocation } from "react-router-dom";
import L, { LatLng, LatLngBounds, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone } from "react-icons/fa";
import * as GeoJSONTypes from 'geojson';
import Tuna from '/src/assets/Yellowfin Tuna.jpg';
import clownfish from '/src/assets/Clarks clownfish.jpg';
import sardine from '/src/assets/Indian oil sardine.jpg';
import anchovy from '/src/assets/Indian anchovy.jpg';
import coasta from "/src/assets/Cossura coasta (segmented worm).png";
import mackerel from '/src/assets/mackerel.jpg';
import mossy from '/src/assets/Mossy red seaweed.jpg';
import lettuce from '/src/assets/Sea lettuce.jpg';
import sparkle from '/src/assets/Sea sparkle (bioluminescent dinoflagellate).jpg';
import Euconchoecia from '/src/assets/Euconchoecia aculeata (ostracod).png';
import Conchoecetta from '/src/assets/Conchoecetta giesbrechti (ostracod).png';
import Tripos from '/src/assets/Tripods furca (copepod).png';
import Proceroecia from '/src/assets/Proceroecia procera (ostracod).png';
import Orthoconchoecia from '/src/assets/Orthoconchoecia atlantica (ostracod).png';
import Thalassionema from '/src/assets/Thalassionema nitzschioides (diatom).png';
import Rhizosolenia from '/src/assets/Rhizosolenia hebetata (diatom).png';
import Proboscia from '/src/assets/Proboscia alata (diatom).png';
import enflata from '/src/assets/Flaccisagitta enflata.png';
import latreillii from '/src/assets/Lumibrineris latreilli (bristle worm).png';
import cincta from '/src/assets/Magelona cincta (polychaete worm).png';
import pinnata from '/src/assets/Paraprionospio pinnata (polychaete worm).png';
import pusilla from '/src/assets/Pseudanchialina pusilla (opossum shrimp).png';
import draco from '/src/assets/Pterosagitta draco (arrow worm).png';
import pacifia from '/src/assets/Serratosagitta pacifica (arrow worm).png';
import parva from '/src/assets/Sigambra parva (polychaete worm).png';
import gracilis from '/src/assets/Siriella gracilis (opossum shrimp).png';
import copper from '/src/assets/Copper-ore.webp';
import petroleum from '/src/assets/Petroleum-reserve.png';
import gold from '/src/assets/Gold-ore.webp';
import iron from '/src/assets/Iron-ore.jpg';
import manganese from '/src/assets/Manganese-ore.png';
import ship from '/src/assets/Shipwreks.png';
import hpolluted from '/src/assets/High-pollution.png';
import exhpolluted from '/src/assets/Extremely-high-pollution.png';
import lpolluted from '/src/assets/Moderate-pollution.png';
import * as turf from '@turf/turf';

// Define types for GeoJSON data
interface GeoJsonData {
  [key: string]: GeoJSONTypes.FeatureCollection;
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Define props for QueryResultsLayer
interface QueryResultsLayerProps {
  geoJsonData: GeoJsonData;
  pinnedGeoJsonData: GeoJsonData;
  colors: string[];
}

// Define props for DropHandler
interface DropHandlerProps {
  onDropMarker: (latlng: LatLng) => void;
}

function BoundsUpdater() {
  const map = useMap();
  useEffect(() => {
    const worldBounds: LatLngBounds = L.latLngBounds([-90, -180], [90, 180]);
    map.setMaxBounds(worldBounds);
  }, [map]);
  return null;
}

function QueryResultsLayer({ geoJsonData, pinnedGeoJsonData, colors }: QueryResultsLayerProps) {
  if (
    (!geoJsonData || Object.keys(geoJsonData).length === 0) &&
    (!pinnedGeoJsonData || Object.keys(pinnedGeoJsonData).length === 0)
  ) {
    return null;
  }

  // Combine both current and pinned GeoJSON data for rendering
  const allGeoJsonData: GeoJsonData = { ...geoJsonData, ...pinnedGeoJsonData };

  // Generate unique keys to prevent React from reusing components
  const geoJsonEntries = Object.entries(allGeoJsonData);

  return (
    <>
      {geoJsonEntries.map(([filename, geojson], index) => {
        const color = colors[index % colors.length];
        return (
          <GeoJSON
            key={`${filename}-${index}`}
            data={geojson}
            style={() => ({
              radius: 12,
              color: color,
              weight: 4,
              opacity: 0.8,
              fillOpacity: 0.6,
              lineJoin: "round",
            })}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 12,
                fillColor: color,
                color: color,
                weight: 4,
                opacity: 1,
                fillOpacity: 0.8,
                lineJoin: "round",
              });
            }}
            onEachFeature={(feature, layer) => {
              let popupContent = `<strong>Dataset:</strong> ${filename}<br>`;
              if (feature.properties) {
                Object.keys(feature.properties).forEach((key) => {
                  popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
                });
              }
              layer.bindPopup(popupContent);
            }}
          />
        );
      })}
    </>
  );
}

function DropHandler({ onDropMarker }: DropHandlerProps) {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const latlng = map.containerPointToLatLng([x, y]);
      onDropMarker(latlng);
    };
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);
    return () => {
      container.removeEventListener("dragover", handleDragOver);
      container.removeEventListener("drop", handleDrop);
    };
  }, [map, onDropMarker]);
  return null;
}

export default function MapComponent() {
  const [openlist, setOpenlist] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonData>({});
  const [droppedMarkers, setDroppedMarkers] = useState<number[][]>([]);
  const [pop, setPop] = useState<string[]>([]);
  const [fishPos, setFishPos] = useState<LatLng | null>(null);
  const [pinned, setPinned] = useState<string[]>([]);
  const [pinnedGeoJsonData, setPinnedGeoJsonData] = useState<GeoJsonData>({});
  const [status, setStatus] = useState<string>("");
  const location = useLocation();
  const fishquery = location.state?.query || "";
  const fishIcon: DivIcon = new L.DivIcon({
    html: "🦈",
    className: "fish-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const scientificToCommon: { [key: string]: string } = {
    "Aglaophamus dibranchis": "Aglaophamus dibranchis",
    "Aidanosagitta regularis": "Aidanosagitta regularis",
    "Amphiprion clarkii": "Clark's Clownfish",
    "Charybdis Archias smithii": "Charybdis / Archias smithii",
    "Conchoecetta giesbrechti": "Conchoecetta giesbrechti (ostracod)",
    "Cossura coasta": "Cossura coasta (segmented worm)",
    "Cypridina dentata": "Cypridina dentata",
    "Euconchoecia aculeata": "Euconchoecia aculeata (ostracod)",
    "Flaccisagitta enflata": "Flaccisagitta enflata",
    "Hypnea_musciformis": "Mossy red seaweed",
    "Lumbrineris_latreillii": "Lumbrineris latreillii",
    "Magelona_cincta": "Magelona cincta",
    "Metaconchoecia_rotundata": "Metaconchoecia rotundata",
    "Noctiluca_scintillans": "Sea sparkle (bioluminescent dinoflagellate)",
    "Orthoconchoecia_atlantica": "Orthoconchoecia atlantod",
    "Paraprionospio_pinnata": "Paraprionospio pinnata",
    "Proboscia_alata": "Proboscia alata (diatom)",
    "Proceroecia_procera": "Proceroecia procera (ostracod)",
    "Pseudanchialina_pusilla": "Pseudanchialina pusilla",
    "Pterosagitta_draco": "Pterosagitta draco",
    "Rastrelliger_kanagurta": "Indian Mackerel",
    "Rhizosolenia_hebetata": "Rhizosolenia hebetata (diatom)",
    "Sardinella_longiceps": "Indian Oil Sardine",
    "Serratosagitta_pacifica": "Serratosagitta pacifica",
    "Sigambra_parva": "Sigambra parva",
    "Sirella_gracilis": "Sirella gracilis",
    "Stolephorus_indicus": "Indian Anchovy",
    "Thalassionema_nitzschioides": "Thalassionema nitzschioides (diatom)",
    "Thunnus_albacares": "Yellowfin Tuna",
    "Tripos_furca": "Tripos furca (copepod)",
    "Ulva_lactuca": "Sea lettuce",
    "Copper-ore": "Copper ore",
    "Petroleum-reserve": "Petroleum reserves",
    "Gold-ore": "Gold ore",
    "Iron-ore": "Iron ore",
    "Manganese-ore": "Manganese ore",
    "Shipwrecks": "Shipwrecks",
    "High-pollution": "High Pollution areas",
    "Extreme-high-pollution": "Extreme High Pollution areas",
    "Moderate-pollution": "Moderate Pollution areas",
  };

  const commonToScientific = (k: string): string => {
    k = k.trim();
    let result = k;
    Object.keys(scientificToCommon).forEach((key) => {
      if (scientificToCommon[key] === k) {
        result = key;
      }
    });
    return result;
  };

  const images: { [key: string]: string } = {
    "Yellowfin Tuna": Tuna,
    "Clark's Clownfish": clownfish,
    "Indian Oil Sardine": sardine,
    "Indian Anchovy": anchovy,
    "Indian Mackerel": mackerel,
    "Mossy red seaweed": mossy,
    "Sea lettuce": lettuce,
    "Sea sparkle (bioluminescent dinoflagellate)": sparkle,
    "Thalassionema nitzschioides (diatom)": Thalassionema,
    "Rhizosolenia hebetata (diatom)": Rhizosolenia,
    "Proboscia alata (diatom)": Proboscia,
    "Euconchoecia aculeata (ostracod)": Euconchoecia,
    "Conchoecetta giesbrechti (ostracod)": Conchoecetta,
    "Tripos furca (copepod)": Tripos,
    "Proceroecia procera (ostracod)": Proceroecia,
    "Orthoconchoecia atlantica (ostracod)": Orthoconchoecia,
    "Cossura coasta (segmented worm)": coasta,
    "Flaccisagitta enflata": enflata,
    "Lumbrineris latreillii": latreillii,
    "Magelona cincta": cincta,
    "Paraprionospio pinnata": pinnata,
    "Pseudanchialina pusilla": pusilla,
    "Pterosagitta draco": draco,
    "Serratosagitta pacifica": pacifia,
    "Sigambra parva": parva,
    "Sirella gracilis": gracilis,
    "Copper ore": copper,
    "Petroleum reserves": petroleum,
    "Gold ore": gold,
    "Iron ore": iron,
    "Manganese ore": manganese,
    "Shipwrecks": ship,
    "High pollution areas": hpolluted,
    "Extreme high pollution areas": exhpolluted,
    "Moderate pollution areas": lpolluted,
  };

  const cutfirstword = (str: string): string => {
    const words = str.split(' ').slice(1).join(' ');
    return words;
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const colors: string[] = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#A55EEA', '#26DE81', '#FC427B', '#FD79A8', '#FDCB6E',
  ];

  const API_BASE_URL: string = 'https://sih-oceanic-project.onrender.com';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenlist(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showStatus = (message: string, type: string) => {
    setStatus(message);
    if (type === 'error') {
      setTimeout(() => setStatus(''), 5000);
    }
  };

  const dropQuery = (pos: LatLng) => {
    setFishPos(pos);
    const center: [number, number] = [pos.lng, pos.lat];
    const radius: number = 150; // in kilometers
    const options = { steps: 64, units: 'kilometers' as const };
    const circle = turf.circle(center, radius, options);
    const boundingBox = turf.bbox(circle);
    const dropCoordinates: Bounds = {
      west: boundingBox[0],
      south: boundingBox[1],
      east: boundingBox[2],
      north: boundingBox[3],
    };
    sendQuery("only find all fishes and plants and resources in this area", dropCoordinates);
  };

  const sendQuery = async (q: string, dropCoords = null) => {
    if (Object.keys(images).includes(q)) {
      q = commonToScientific(q);
      q = `only ${q}`;
    }
    const finalQuery = (q || query).trim();
    if (!finalQuery) {
      showStatus('Please enter a query', 'error');
      return;
    }
    setLoading(true);
    showStatus('Processing your query...', 'loading');
    let bounds: Bounds | null = null;
    if (dropCoords) {
      bounds = dropCoords;
    } else if (mapRef.current) {
      setFishPos(null);
      const map = mapRef.current;
      const b = map.getBounds();
      bounds = {
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      };
    }
    const payload = {
      prompt: finalQuery.trim(),
      coordinates: bounds,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: { status: string; data: GeoJsonData; summary: { total_features: number } } = await response.json();
      if (q.split(" ")[0] === "only") {
        q = cutfirstword(q);
      }
      handleQueryResult(result, q);
    } catch (error: any) {
      console.error('Query error:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQueryResult = (result: { status: string; data: GeoJsonData; summary: { total_features: number } }, q: string) => {
    if (result.status === 'success') {
      setGeoJsonData(result.data);
      setTimeout(() => {
        showStatus(`Query successful! Found ${result.summary.total_features} results of ${q}`, 'success');
        setTimeout(() => setStatus(''), 3000);
      }, 2000);
      if (Object.keys(images).includes(q)) {
        setPop([q]);
      } else {
        const names: string[] = [];
        Object.values(result.data).forEach((geojson) => {
          geojson.features.forEach((f) => {
            const backendName = f.properties?.species || f.properties?.ScientificNames;
            if (backendName) {
              const displayName = scientificToCommon[backendName] || backendName;
              if (!pinned.includes(displayName)) {
                names.push(displayName);
              }
            }
          });
        });
        setPop([...new Set(names)]);
      }
      setQuery("");
      setTimeout(() => {
        if (mapRef.current) {
          const map = mapRef.current;
          const allData = { ...result.data, ...pinnedGeoJsonData };
          if (Object.keys(allData).length > 0) {
            const group = L.featureGroup();
            Object.values(allData).forEach((geojson) => {
              const layer = L.geoJSON(geojson);
              group.addLayer(layer);
            });
            if (group.getBounds().isValid()) {
              map.fitBounds(group.getBounds().pad(0.1));
            }
          }
        }
      }, 100);
    } else {
      showStatus('Query failed: ' + JSON.stringify(result), 'error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendQuery(query);
      setQuery("");
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  };

  const handleButtonKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      sendQuery(query);
      setQuery("");
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  };

  const dropdown = (a: string) => {
    setOpenlist(openlist === a ? null : a);
  };

  const selectItem = (item: string) => {
    setQuery(item);
    setOpenlist(null);
  };

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech search</span>;
  }
  useEffect(() => {
    if (fishquery) {
      sendQuery(fishquery);
    }
  }, [fishquery])

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  const speech = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  };

  // Pin function - Fixed
  const pinData = (name: string) => {
    if (!pinned.includes(name)) {
      setPinned((prev) => [...prev, name]);
      const backendNameForFilter = commonToScientific(name) || name;

      // Extract features from current geoJsonData that match the species
      const newPinnedGeoJson: GeoJsonData = {};
      Object.entries(geoJsonData).forEach(([filename, geojson]) => {
        const matchingFeatures = geojson.features.filter(
          (f) => {
            const species = f.properties?.species || f.properties?.ScientificNames;
            return species === backendNameForFilter;
          }
        );

        if (matchingFeatures.length > 0) {
          // Create a unique filename for pinned data to avoid conflicts
          const pinnedFilename = `pinned_${filename}_${name}`;
          newPinnedGeoJson[pinnedFilename] = {
            ...geojson,
            features: matchingFeatures
          };
        }
      });

      // Add new pinned data to existing pinned data
      setPinnedGeoJsonData((prev) => ({
        ...prev,
        ...newPinnedGeoJson
      }));

      // Remove pinned item from current results (pop)
      setPop((prev) => prev.filter((item) => item !== name));

      showStatus(`Pinned ${name}`, "success");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  // Unpin function - Fixed
  const unpinData = (name: string) => {
    setPinned((prev) => prev.filter((item) => item !== name));

    // Remove data from pinnedGeoJsonData by filtering out entries that contain the species
    const backendNameForFilter = commonToScientific(name) || name;
    setPinnedGeoJsonData((prev) => {
      const newPinnedGeoJson: GeoJsonData = {};

      Object.entries(prev).forEach(([filename, geojson]) => {
        // Filter out features that match the species being unpinned
        const filteredFeatures = geojson.features.filter(
          (f) => {
            const species = f.properties?.species || f.properties?.ScientificNames;
            return species !== backendNameForFilter;
          }
        );

        // Only keep the geojson entry if it still has features after filtering
        if (filteredFeatures.length > 0) {
          newPinnedGeoJson[filename] = {
            ...geojson,
            features: filteredFeatures
          };
        }
      });

      return newPinnedGeoJson;
    });

    // Check if unpinned item should be added back to current results
    const isInCurrentQuery = Object.values(geoJsonData).some((geojson) =>
      geojson.features.some(
        (f) => {
          const species = f.properties?.species || f.properties?.ScientificNames;
          return species === backendNameForFilter;
        }
      )
    );

    if (isInCurrentQuery && !pop.includes(name)) {
      setPop((prev) => [...prev, name]);
    }

    showStatus(`Unpinned ${name}`, "success");
    setTimeout(() => setStatus(""), 3000);

    // Update map bounds after unpinning
    setTimeout(() => {
      if (mapRef.current) {
        const map = mapRef.current;
        const remainingPinnedData = Object.keys(pinnedGeoJsonData).length > 0;
        const currentData = Object.keys(geoJsonData).length > 0;

        if (remainingPinnedData || currentData) {
          const group = L.featureGroup();

          // Add remaining pinned data
          Object.values(pinnedGeoJsonData).forEach((geojson) => {
            if (geojson.features.length > 0) {
              const layer = L.geoJSON(geojson);
              group.addLayer(layer);
            }
          });

          // Add current query data
          Object.values(geoJsonData).forEach((geojson) => {
            const layer = L.geoJSON(geojson);
            group.addLayer(layer);
          });

          if (group.getLayers().length > 0 && group.getBounds().isValid()) {
            map.fitBounds(group.getBounds().pad(0.1));
          } else {
            map.setView([25, 25], 2.5);
          }
        } else {
          map.setView([25, 25], 2.5);
        }
      }
    }, 100);
  };

  return (
    <div className="relative flex w-full h-screen z-[2000]">
      <MapContainer
        center={[21, 79]}
        zoom={4}
        style={{ height: '100vh', width: '100%' }}
        className="w-full h-full"
        worldCopyJump={false}
        maxBounds={[[5, 60], [38, 100]]}
        maxBoundsViscosity={1.0}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <BoundsUpdater />
        <DropHandler onDropMarker={dropQuery} />
        {fishPos && (
          <Marker position={fishPos} icon={fishIcon}>
            <Popup>🦈 Dropped here!</Popup>
          </Marker>
        )}
        <QueryResultsLayer
          geoJsonData={geoJsonData}
          pinnedGeoJsonData={pinnedGeoJsonData}
          colors={colors}
        />
      </MapContainer>
      <div
        ref={containerRef}
        className="absolute flex justify-center top-4 left-1/2 transform -translate-x-1/2 z-[3000] w-4/5 gap-3"
      >
        <div className="flex w-1/6 h-full">
          <button
            className="flex w-full justify-center bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] border-white-100 text-white border-blue-400 bg-white px-3 py-1 hover:from-white hover;to-white hover:text-zinc-800"
            style={{ borderRadius: '20px', height: '100%', fontSize: '1.4vw', alignItems: 'center' }}
            onMouseEnter={() => dropdown("animals")}
            onClick={() => sendQuery('only fishes')}
          >
            Aquatic animals
          </button>
          {openlist === "animals" && (
            <div className="absolute top-full  w-48 bg-white border rounded shadow-md z-[1001] max-h-80 overflow-y-auto" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
              <ul className="text-sm" style={{ alignItems: 'center', justifyContent: 'center', msOverflowStyle: "none", scrollbarWidth: "none" }} >
                {[
                  "Yellowfin Tuna",
                  "Clark's Clownfish",
                  "Indian Oil Sardine",
                  "Indian Anchovy",
                  "Indian Mackerel",
                  "Euconchoecia aculeata (ostracod)",
                  "Conchoecetta giesbrechti (ostracod)",
                  "Tripos furca (copepod)",
                  "Proceroecia procera (ostracod)",
                  "Orthoconchoecia atlantica (ostracod)",
                  "Cossura coasta (segmented worm)",
                  "Flaccisagitta enflata",
                  "Lumbrineris latreillii",
                  "Magelona cincta",
                  "Paraprionospio pinnata",
                  "Pseudanchialina pusilla",
                  "Pterosagitta draco",
                  "Serratosagitta pacifica",
                  "Sigambra parva",
                  "Sirella gracilis",
                ].map((item) => (
                  <li
                    key={item}
                    className="px-3 py-2 hover:bg-blue-200 justify-center cursor-pointer"
                    style={{ fontSize: '1.5vw', msOverflowStyle: "none", scrollbarWidth: "none" }}
                    onClick={() => {
                      selectItem(item);
                      sendQuery(`only ${item}`);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex w-1/6 justify-center h-full">
          <button
            className="flex w-full justify-center bg-gradient-to-r from-[#39911F] to-[#62CF42] border-white-100 text-white border-blue-400 bg-white px-3 py-1 hover:from-white hover;to-white hover:text-zinc-800"
            style={{ borderRadius: '20px', height: '100%', fontSize: '1.5vw' }}
            onMouseEnter={() => dropdown("plants")}
          >
            Aquatic Plants
          </button>
          {openlist === "plants" && (
            <div className="absolute top-full w-1/6 bg-white border rounded shadow-md">
              <ul className="text-sm" style={{ alignItems: 'center', justifyContent: 'center' }}>
                {[
                  "Mossy red seaweed",
                  "Sea lettuce",
                  "Sea sparkle (bioluminescent dinoflagellate)",
                  "Thalassionema nitzschioides (diatom)",
                  "Rhizosolenia hebetata (diatom)",
                  "Proboscia alata (diatom)",
                ].map((item) => (
                  <li
                    key={item}
                    className="px-3 py-2 justify-center hover:bg-green-200 cursor-pointer"
                    style={{ fontSize: '1.5vw' }}
                    onClick={() => {
                      selectItem(item);
                      sendQuery(`only ${item}`);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex w-1/6 justify-center h-full">
          <button
          className="flex w-full justify-center bg-gradient-to-r from-[#606c88] to-[#3f4c6b] border-white-100 text-white border-blue-400 bg-white px-3 py-1 hover:from-white hover;to-white hover:text-zinc-800"
          style={{ borderRadius: '20px', height: '100%', fontSize: '1.5vw', alignItems: 'center' }}
          onClick={() => {
            selectItem("Pollution");
            sendQuery("Pollution");
          }}
          onMouseEnter={() => dropdown("Pollution")}
        >
          Pollution
        </button>
        {openlist === "Pollution" && (
          <div className="absolute top-full w-1/6 bg-white border rounded shadow-md">
            <ul className="text-sm" style={{ alignItems: 'center', justifyContent: 'center', right: '100%' }}>
              {[
                "High pollution areas",
                "Extreme high pollution areas",
                "Moderate pollution areas",
              ].map((item) => (
                <li
                  key={item}
                  className="px-3 py-2 justify-center hover:bg-green-200 cursor-pointer"
                  style={{ fontSize: '1.5vw' }}
                  onClick={() => {
                    selectItem(item);
                    sendQuery(item);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
        <div className="flex w-1/6 justify-center h-full">
          <button
          className="flex w-full justify-center bg-gradient-to-r from-[#6d6042] to-[#CC9C35] border-white-100 text-white border-blue-400 bg-white px-3 py-1 hover:from-white hover:to-white hover:text-zinc-800"
          style={{ borderRadius: '20px', height: '100%', fontSize: '1.5vw', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => {
            selectItem("Resources");
            sendQuery("Resources");
          }}
          onMouseEnter={() => dropdown("Resources")}
        >
          Resources
        </button>
        {openlist === "Resources" && (
          <div className="absolute top-full w-1/6 bg-white border rounded shadow-md">
            <ul className="text-sm" style={{ alignItems: 'center', justifyContent: 'center' }}>
              {[
                "Copper ore",
                "Petroleum reserves",
                "Gold ore",
                "Iron ore",
                "Manganese ore",
              ].map((item) => (
                <li
                  key={item}
                  className="px-3 py-2 justify-center hover:bg-orange-200 cursor-pointer"
                  style={{ fontSize: '1.5vw' }}
                  onClick={() => {
                    selectItem(item);
                    sendQuery(`only ${item}`);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
        
        
        
        <button
          className="flex w-1/6 justify-center bg-gradient-to-r from-[#CFC195] to-[#C9AA44] border-white-100 text-white border-blue-400 bg-white px-3 py-1 hover:from-white hover;to-white hover:text-zinc-800"
          style={{ borderRadius: '20px', height: '100%', fontSize: '1.5vw', alignItems: 'center' }}
          onClick={() => {
            selectItem("Shipwrecks");
            sendQuery("Shipwrecks");
          }}
        >
          Shipwrecks
        </button>
      </div>
      <span
        role="img"
        aria-label="fish"
        draggable
        className="absolute top-4 right-4 text-4xl cursor-grab z-[2000]"
        onDragStart={(e: React.DragEvent<HTMLSpanElement>) => {
          e.dataTransfer.setData("text/plain", "fish");
        }}
      >
        🦈
      </span>
      {(pop.length > 0 || pinned.length > 0) && (
        <div
          className="absolute flex-col w-1/5 left-4 h-[calc(100%-2rem)] overflow-y-scroll top-10 bottom-4 z-[1000]"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {pinned.map((name, i) => (
            <div
              key={`pinned-${i}`}
              className="flex flex-col items-center gap-2 mt-4 rounded-lg bg-yellow-100 px-2 py-2"
              style={{ height: "auto", maxHeight: '50%', zIndex: '3' }}
            >
              <div className="w-full h-32 overflow-hidden rounded-lg">
                <img
                  src={images[name]}
                  alt={name}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <span className="font-medium text-center">📌 {name}</span>
               
                <button
                  className="mt-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => unpinData(name)}
                >
                  Unpin
                </button>
                <button className="mt-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Download
                </button>
              </div>
            </div>
          ))}
          {pop.map((name, i) => (
            <div
              key={`pop-${i}`}
              className="flex flex-col items-center gap-2 mt-4 rounded-lg bg-white px-2 py-2"
              style={{ height: "auto", maxHeight: '50%', zIndex: '2' }}
            >
              <div className="w-full h-32 overflow-hidden rounded-lg">
                <img
                  src={images[name]}
                  alt={name}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <span className="font-medium text-center">{name}</span>
                
                <button
                  className="mt-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => pinData(name)}
                >
                  Pin
                </button>
                <button className="mt-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] w-1/2 flex gap-2 rounded-full">
        <input
          type="text"
          placeholder="Search for oceanic data..."
          className="px-4 py-3 rounded-full border border-gray-300 flex-1"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <button
          onClick={speech}
          onKeyDown={handleButtonKeyPress}
          className="p-2 rounded-full bg-zinc-500 text-white"
        >
          {listening ? '✖️' : <FaMicrophone size={20} />}
        </button>
      </div>
      {status && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-[1000] max-w-md">
          <div
            className={`px-4 py-2 rounded shadow-lg ${status.includes('Error') || status.includes('failed')
                ? 'bg-red-100 text-red-700 border border-red-300'
                : status.includes('successful')
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-blue-100 text-blue-700 border border-blue-300'
              }`}
          >
            {status}
          </div>
        </div>
      )}
      {droppedMarkers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-[2000] text-sm font-mono max-h-40 overflow-y-auto">
          {droppedMarkers.map((pos, i) => (
            <div key={i}>
              📍 {i + 1}: Lat {pos[0].toFixed(6)}, Lng {pos[1].toFixed(6)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}