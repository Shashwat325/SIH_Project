import React, { useState, useRef, useEffect } from 'react';
import * as Papa from 'papaparse';
import * as Chart from 'chart.js';
import { X } from 'lucide-react';
import i from '/src/assets/newdataimg.png';

interface DataRow {
    [key: string]: any;
}

interface ChartData {
    x: number;
    y: number;
}

interface Dataset {
    name: string;
    description: string;
    image: string;
    size: string;
    updated: string;
    rating: string;
    downloads: string;
}

const OceanicDataTool: React.FC = () => {
    const [originalData, setOriginalData] = useState<DataRow[]>([]);
    const [processedData, setProcessedData] = useState<DataRow[]>([]);
    const [dataHeaders, setDataHeaders] = useState<string[]>([]);
    const [numericColumns, setNumericColumns] = useState<string[]>([]);
    const [currentChart, setCurrentChart] = useState<Chart.Chart | null>(null);
    const [processingStep, setProcessingStep] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showChart, setShowChart] = useState<boolean>(false);
    const [displaychart, setdisplaychart] = useState<boolean>(false);
    const [showOutlierStep, setShowOutlierStep] = useState<boolean>(false);
    const [selectedCols, setSelectedCols] = useState<{ x: string; y: string } | null>(null);
    const [showMissingStep, setShowMissingStep] = useState<boolean>(false);
    const [showDuplicateStep, setShowDuplicateStep] = useState<boolean>(false);
    const [showRecommendation, setShowRecommendationStep] = useState<boolean>(false);
    const [recommendationText, setRecommendationText] = useState<string>('');
    const [formatRecommendation, setFormatRecommendation] = useState<string>('');
    const [showFormatControls, setShowFormatControls] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const uploadAreaRef = useRef<HTMLDivElement>(null);
    const newd = {
        name: "Global Marine Debris Density",
        description: "Satellite imagery-based dataset tracking the distribution and density of floating marine debris, including plastics and natural materials.",
        image: i,
        size: "354.8 MB",
        updated: "1 day ago",
        rating: "4.5/5",
        downloads: "987 downloads"
    }
    const datasets: Dataset[] = [
        {
            name: "Global Ocean Temperature Anomalies",
            description: "Monthly sea surface temperature anomalies from 1880-2023. Comprehensive global coverage with satellite and in-situ measurements.",
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=80&h=80&fit=crop&crop=center",
            size: "45.2 MB",
            updated: "3 days ago",
            rating: "4.8/5",
            downloads: "1.2k downloads"
        },
        {
            name: "Marine Biodiversity Hotspots",
            description: "Species distribution and abundance data from major marine ecosystems. Includes coral reefs, deep sea, and coastal zones.",
            image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=80&h=80&fit=crop&crop=center",
            size: "128.7 MB",
            updated: "1 week ago",
            rating: "4.9/5",
            downloads: "856 downloads"
        },
        {
            name: "Global Ocean Current Patterns",
            description: "Real-time and historical ocean current velocity data from ADCP measurements and satellite altimetry across all major basins.",
            image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=80&h=80&fit=crop&crop=center",
            size: "234.1 MB",
            updated: "2 days ago",
            rating: "4.7/5",
            downloads: "2.1k downloads"
        },
        {
            name: "Ocean Salinity Measurements",
            description: "High-resolution salinity data from Argo floats and research vessels. Includes vertical profiles and surface measurements.",
            image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=80&h=80&fit=crop&crop=center",
            size: "67.9 MB",
            updated: "5 days ago",
            rating: "4.6/5",
            downloads: "743 downloads"
        },
        {
            name: "Ocean Acidification Monitoring",
            description: "pH levels and carbon chemistry parameters from global monitoring stations. Critical for climate change research.",
            image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=80&h=80&fit=crop&crop=center",
            size: "89.4 MB",
            updated: "1 day ago",
            rating: "4.8/5",
            downloads: "1.8k downloads"
        },
        /* {
            name: "Global Bathymetry Database",
            description: "High-resolution seafloor topography data compiled from multibeam surveys and satellite gravity measurements.",
            image: "https://images.unsplash.com/photo-1573160813959-df2ec2d1bf4a?w=80&h=80&fit=crop&crop=center",
            size: "512.3 MB",
            updated: "2 weeks ago",
            rating: "4.9/5",
            downloads: "3.2k downloads"
        } */
    ];
    const [newdataset, setnewdataset] = useState<Dataset[]>(datasets);
    const handlemessage=(q:string)=>{
        setMessage(`Data uploaded successfully as (${q}) file format!`);
        setTimeout(() => {
            setMessage('');
        }, 3000);
    }
    
    useEffect(() => {
        // Cleanup chart on unmount
        return () => {
            if (currentChart) {
                currentChart.destroy();
            }
        };
    }, [currentChart]);

    const handleFileUpload = (file: File) => {
        setIsLoading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                const data = results.data as DataRow[];
                setOriginalData(data);
                setProcessedData([...data]);
                setDataHeaders(results.meta.fields || []);

                // Identify numeric columns (excluding coordinates)
                const numCols = (results.meta.fields || []).filter(header => {
                    const lowerHeader = header.toLowerCase();
                    if (lowerHeader.includes('lat') || lowerHeader.includes('lon') ||
                        lowerHeader.includes('longitude') || lowerHeader.includes('latitude')) {
                        return false;
                    }
                    return data.some(row => typeof row[header] === 'number' && !isNaN(row[header]));
                });
                setNumericColumns(numCols);

                setIsLoading(false);
                setShowChart(true);

                // Show first processing step after delay
                /* setTimeout(() => {
                    setShowOutlierStep(true);
                }, 1000); */
            },
            error: (error) => {
                setIsLoading(false);
                alert('Error parsing file: ' + error.message);
            }
        });
    };
    useEffect(() => {
        if (selectedCols) {

            setdisplaychart(true);
        }
    }, [currentChart])


    const createScatterPlot = (xColumn: string, yColumn: string) => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (currentChart) {
            currentChart.destroy();
        }

        const chartData: ChartData[] = processedData
            .filter(row => row[xColumn] != null && row[yColumn] != null)
            .map(row => ({
                x: row[xColumn],
                y: row[yColumn]
            }));

        const chart = new Chart.Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: `${xColumn} vs ${yColumn}`,
                    data: chartData,
                    backgroundColor: 'rgba(64, 224, 208, 0.6)',
                    borderColor: 'rgba(64, 224, 208, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e6ed'
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: xColumn,
                            color: '#40e0d0'
                        },
                        ticks: {
                            color: '#e0e6ed'
                        },
                        grid: {
                            color: 'rgba(64, 224, 208, 0.2)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yColumn,
                            color: '#40e0d0'
                        },
                        ticks: {
                            color: '#e0e6ed'
                        },
                        grid: {
                            color: 'rgba(64, 224, 208, 0.2)'
                        }
                    }
                }
            }
        });

        setCurrentChart(chart);
    };
    // After
    useEffect(() => {
        if (selectedCols) {
            setShowOutlierStep(true);
        }
    }, [selectedCols]); // Add selectedCols to the dependency array



    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (uploadAreaRef.current) {
            uploadAreaRef.current.classList.add('bg-cyan-400/20', 'border-cyan-300');
        }
    };

    const handleDragLeave = () => {
        if (uploadAreaRef.current) {
            uploadAreaRef.current.classList.remove('bg-cyan-400/20', 'border-cyan-300');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleDragLeave();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const removeOutliers = (remove: boolean) => {
        if (remove) {
            let filteredData = [...processedData];

            numericColumns.forEach(column => {
                const values = filteredData.map(row => row[column]).filter(val => val != null);
                const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
                const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
                const stdDev = Math.sqrt(variance);
                const threshold = 2; // 2 standard deviations

                filteredData = filteredData.filter(row => {
                    const value = row[column];
                    return value == null || Math.abs(value - mean) <= threshold * stdDev;
                });
            });

            setProcessedData(filteredData);
            updateChart();
        }

        setShowOutlierStep(false);
        setTimeout(() => {
            setShowMissingStep(true);
        }, 500);
    };

    const removeMissing = (remove: boolean) => {
        if (remove) {
            const filteredData = processedData.filter(row => {
                return dataHeaders.every(header => row[header] != null && row[header] !== '');
            });
            setProcessedData(filteredData);
            updateChart();
        }

        setShowMissingStep(false);
        setTimeout(() => {
            setShowDuplicateStep(true);
        }, 500);
    };

    const removeDuplicates = (remove: boolean) => {
        if (remove) {
            const seen = new Set();
            const filteredData = processedData.filter(row => {
                const key = JSON.stringify(row);
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
            setProcessedData(filteredData);
            updateChart();
        }

        setShowDuplicateStep(false);
        setTimeout(() => {
            showRecommendationStep();
        }, 500);
    };


    const updateChart = () => {
        // Redraw current chart with new data
        if (currentChart && numericColumns.length >= 2) {
            const datasets = currentChart.data.datasets[0];
            const label = datasets.label;
            if (label) {
                const columns = label.split(' vs ');
                if (columns.length === 2) {
                    createScatterPlot(columns[0], columns[1]);
                }
            }
        }
    };


    const handlePlotClick = (xCol: string, yCol: string) => {
        setSelectedCols({ x: xCol, y: yCol });
        setdisplaychart(true);
    };
    useEffect(() => {
        if (selectedCols) {
            createScatterPlot(selectedCols.x, selectedCols.y);
        }
    }, [selectedCols, processedData]);

    const showRecommendationStep = () => {
        setShowRecommendationStep(true);

        // Analyze data structure
        const hasTemperature = dataHeaders.some(h => h.toLowerCase().includes('temp'));
        const hasSalinity = dataHeaders.some(h => h.toLowerCase().includes('salin'));
        const hasLatLon = dataHeaders.some(h => h.toLowerCase().includes('lat')) &&
            dataHeaders.some(h => h.toLowerCase().includes('lon'));
        const hasDepth = dataHeaders.some(h => h.toLowerCase().includes('depth'));
        const hasTime = dataHeaders.some(h => h.toLowerCase().includes('time') || h.toLowerCase().includes('date'));
        const hasStationID = dataHeaders.some(h => h.toLowerCase().includes('station') || h.toLowerCase().includes('id'));

        let format = '';
        let reasoning = '';

        if ((hasTemperature || hasSalinity) && hasLatLon && hasDepth && hasTime) {
            format = 'NetCDF (.nc)';
            reasoning = `Your dataset contains oceanographic measurements (${hasTemperature ? 'temperature' : ''}${hasTemperature && hasSalinity ? ', ' : ''}${hasSalinity ? 'salinity' : ''}) with spatial dimensions (latitude, longitude${hasDepth ? ', depth' : ''}${hasTime ? ', time' : ''}). NetCDF is the gold standard for scientific oceanographic data as it supports multidimensional arrays, metadata, and is widely compatible with analysis tools like MATLAB, Python (xarray), and R. It's specifically designed for climate and oceanographic research and provides efficient storage and access patterns for gridded data.`;
        } else if (hasStationID && hasTime && hasLatLon && hasDepth) {
            format = 'ODV (.odv)';
            reasoning = `Your dataset appears to contain station-based oceanographic measurements with identifiers, timestamps, coordinates, and depth information. The Ocean Data View (ODV) format is specifically designed for discrete oceanographic measurements from research cruises and monitoring stations. ODV format excels at handling irregular sampling patterns, provides excellent visualization capabilities, and includes built-in quality control features essential for oceanographic research.`;
        } else if (hasLatLon && numericColumns.length > 0) {
            format = 'GeoTIFF (.tiff)';
            reasoning = `Your dataset contains spatially referenced data with coordinates and measurement variables, making it suitable for Geographic Information Systems (GIS) analysis. GeoTIFF format is ideal for gridded spatial data as it preserves geographic projection information, supports multiple data bands, and is compatible with all major GIS software including QGIS, ArcGIS, and GDAL. This format enables spatial analysis, mapping, and integration with other geospatial datasets.`;
        } else {
            format = 'CSV (Keep Current)';
            reasoning = `Based on your data structure, CSV remains the most appropriate format. Your dataset doesn't contain the specific combination of variables that would benefit from specialized oceanographic formats. CSV provides universal compatibility, human readability, and works well with all data analysis tools while maintaining simplicity for your current data structure.`;
        }

        setRecommendationText(reasoning);

        setTimeout(() => {
            setFormatRecommendation(`Recommended Format: ${format}`);
            setTimeout(() => {
                if (format !== 'CSV (Keep Current)') {
                    setShowFormatControls(true);
                }
            }, 2000);
        }, 2000);
    };

    const getDataSummary = () => {
        const totalRows = processedData.length;
        const totalCols = dataHeaders.length;
        const missingValues = processedData.reduce((count, row) => {
            return count + dataHeaders.filter(header => row[header] == null || row[header] === '').length;
        }, 0);

        return { totalRows, totalCols, missingValues };
    };

    const summary = getDataSummary();

    return (
        <div className="min-h-screen bg-gradient-to-br  text-slate-200 p-5">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-green-800 mb-8 drop-shadow-lg">
                    Oceanic Data Processing Tool
                </h1>

                {/* Upload Section */}
                <div className="bg-transparent backdrop-blur-sm border-2 border-green-400 rounded-2xl p-8 mb-10 shadow-2xl justify-center flex flex-col align-items-center" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <h2 className="text-2xl font-semibold text-slate-600 mb-6 justify-center align-items-center"> Upload Your Data</h2>

                    <div
                        ref={uploadAreaRef}
                        className="border-2 border-dashed border-green-300 rounded-xl p-10 text-center cursor-pointer transition-all duration-300 hover:bg-green-400/10 hover:border-green-300 bg-green-400/5"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="text-xl mb-3 text-green-600">
                            Drag and drop your data file here or click to browse
                        </div>
                        <p className="text-slate-700 text-sm mb-4">Supported formats: CSV, TXT and other tabular data</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".csv,.txt,.tsv"
                            onChange={handleFileInputChange}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-green-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                        >
                            Choose File Manually
                        </button>
                    </div>

                    {/* Chart Container */}
                    {showChart && (
                        <div className="bg-emerald-100/50 rounded-xl p-6 mt-8 flex flex-col " style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <h3 className="text-xl font-bold text-cyan-800 mb-4"> Data Visualization</h3>

                            {/* Chart Controls */}
                            <div className="text-center mb-6">
                                <p className="text-cyan-700 font-semibold text-lg mb-3">Select variables to plot:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {numericColumns.map((col1, i) =>
                                        numericColumns.slice(i + 1).map((col2, j) => (
                                            <button
                                                key={`${i}-${j}`}
                                                onClick={() => { handlePlotClick(col1, col2) }}
                                                className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white px-4 py-2 rounded-full font-semibold text-sm hover:from-white  hover:text-cyan-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                            >
                                                {col1} vs {col2}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {displaychart && (
                                <div className="relative h-96 w-full bg-slate-700 ">
                                    <canvas ref={canvasRef}></canvas>
                                </div>
                            )}

                            {/* Data Summary */}
                            {displaychart && (<div className="bg-emerald-200/50 border border-cyan-400 rounded-xl p-4 mt-6">
                                <h4 className="text-cyan-800 font-bold mb-4">Dataset Summary</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-slate-800/80 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-cyan-400">{summary.totalRows}</div>
                                        <div className="text-slate-400 text-sm">Total Rows</div>
                                    </div>
                                    <div className="bg-slate-800/80 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-cyan-400">{summary.totalCols}</div>
                                        <div className="text-slate-400 text-sm">Total Columns</div>
                                    </div>
                                    <div className="bg-slate-800/80 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-cyan-400">{summary.missingValues}</div>
                                        <div className="text-slate-400 text-sm">Missing Values</div>
                                    </div>
                                    <div className="bg-slate-800/80 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-cyan-400">{numericColumns.length}</div>
                                        <div className="text-slate-400 text-sm">Numeric Columns</div>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                    )}

                    {/* Processing Steps */}
                    {showOutlierStep && (
                        <div className="bg-green-200/50 rounded-xl p-6 mt-6 border-l-4 border-cyan-400 flex flex-col items-center">
                            <div className="text-xl font-bold text-cyan-700 mb-4"> Outlier Detection</div>
                            <p className="mb-6 text-slate-900">Remove data points that deviate significantly from the mean (high standard deviation)?</p>
                            <div className="text-center space-x-4">
                                <button
                                    onClick={() => removeOutliers(true)}
                                    className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white px-6 py-3 rounded-full font-bold hover:from-cyan-300 hover:to-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                >
                                    Yes, Remove Outliers
                                </button>
                                <button
                                    onClick={() => removeOutliers(false)}
                                    className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white px-6 py-3 rounded-full font-bold hover:from-cyan-300 hover:to-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                >
                                    No, Keep All Data
                                </button>
                            </div>
                        </div>
                    )}

                    {showMissingStep && (
                        <div className="bg-green-200/50 rounded-xl p-6 mt-6 border-l-4 border-cyan-400 flex flex-col items-center">
                            <div className="text-xl font-semibold text-cyan-700 mb-4">❓ Missing Values</div>
                            <p className="mb-6 text-slate-900">Remove rows with missing or empty values?</p>
                            <div className="text-center space-x-4">
                                <button
                                    onClick={() => removeMissing(true)}
                                    className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white px-6 py-3 rounded-full font-bold hover:from-cyan-300 hover:to-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                >
                                    Yes, Remove Missing
                                </button>
                                <button
                                    onClick={() => removeMissing(false)}
                                    className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white px-6 py-3 rounded-full font-bold hover:from-cyan-300 hover:to-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                >
                                    No, Keep Missing
                                </button>
                            </div>
                        </div>
                    )}

                    {showDuplicateStep && (
                        <div className="bg-green-200/50 rounded-xl p-6 mt-6 border-l-4 border-cyan-400">
                            <div className="text-xl font-semibold text-cyan-700 mb-4"> Duplicate Values</div>
                            <p className="mb-6 text-slate-900">Remove duplicate rows from the dataset?</p>
                            <div className="text-center space-x-4">
                                <button
                                    onClick={() => removeDuplicates(true)}
                                    className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white px-6 py-3 rounded-full font-bold hover:from-cyan-300 hover:to-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                >
                                    Yes, Remove Duplicates
                                </button>
                                <button
                                    onClick={() => removeDuplicates(false)}
                                    className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white px-6 py-3 rounded-full font-bold hover:from-cyan-300 hover:to-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                >
                                    No, Keep Duplicates
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Recommendation Section */}
                    {showRecommendation && (
                        <div className="bg-slate-800/80 border-2 border-cyan-400 rounded-2xl p-8 mt-6">
                            <div className="text-xl font-semibold text-cyan-400 mb-4"> Format Recommendation</div>
                            <div className="text-lg leading-relaxed mb-6 text-slate-200">
                                {recommendationText}
                            </div>
                            {formatRecommendation && (
                                <div className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 p-4 rounded-xl text-xl font-bold text-center my-6">
                                    {formatRecommendation}
                                </div>
                            )}
                            {showFormatControls && (
                                <div className="text-center space-x-4">
                                    <button className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 px-6 py-3 rounded-full font-bold hover:from-cyan-300 hover:to-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                        onClick={()=>{setnewdataset([newd,...newdataset]); setShowFormatControls(false); handlemessage("NetCDF");}}>
                                        Accept Recommendation
                                    </button>
                                    <button className="bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 px-6 py-3 rounded-full font-bold hover:from-cyan-300 hover:to-teal-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30"
                                    onClick={()=>{setnewdataset([newd,...newdataset]); setShowFormatControls(false); handlemessage("CSV");}}>
                                        Keep as CSV
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {message && (
                        <span className="border-blue-800 border-solid border-2 bg-blue-300 h-auto w-auto text-center text-blue-900 p-5 font-semibold text-xl mt-6">
                            {message}
                        </span>
                    )}
                    {}
                </div>

                {/* Datasets Section */}
                <div className="bg-transparent backdrop-blur-sm border-2 border-green-400 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-green-600 mb-8"> Available Oceanic Datasets</h2>

                    <div className="space-y-6">
                        {newdataset.map((newdataset, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-emerald-100/50 rounded-xl p-6 hover:bg-cyan-400/20 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                            >
                                <img
                                    src={newdataset.image}
                                    alt={newdataset.name}
                                    className="w-20 h-20 rounded-xl mr-6 object-cover border-2 border-cyan-400"
                                />
                                <div className="flex-1">
                                    <div className="text-cyan-600 text-xl font-bold mb-2">{newdataset.name}</div>
                                    <div className="text-slate-800 text-sm leading-relaxed mb-3">
                                        {newdataset.description}
                                    </div>
                                    <div className="flex gap-6 text-xs text-slate-600">
                                        <span>📊 Size: {newdataset.size}</span>
                                        <span>📅 Updated: {newdataset.updated}</span>
                                        <span>⭐ {newdataset.rating}</span>
                                        <span>💾 {newdataset.downloads}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OceanicDataTool;