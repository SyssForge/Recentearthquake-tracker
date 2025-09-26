import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, LayersControl } from 'react-leaflet';
import L, { LatLngExpression, Map as LeafletMap } from 'leaflet';

// INTERFACE DEFINITIONS
interface EarthquakeProperties { mag: number | null; place: string; time: number; url: string; }
interface Geometry { coordinates: [number, number, number]; }
interface EarthquakeFeature { id: string; properties: EarthquakeProperties; geometry: Geometry; }
interface Suggestion { osm_id: number; display_name: string; lat: string; lon: string; type: string; boundingbox: [string, string, string, string]; }

// CUSTOM HOOK for debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

// GET MARKER ICON FUNCTION
const getMarkerIcon = (magnitude: number | null) => {
  const mag = magnitude || 0;
  let className = 'marker-green';
  if (mag >= 5) className = 'marker-red';
  else if (mag >= 3) className = 'marker-yellow';
  const iconSize = Math.max(mag * 6, 18);
  return L.divIcon({ html: ``, className: `custom-marker ${className}`, iconSize: [iconSize, iconSize] });
};

// LEGEND COMPONENT
const Legend = () => ( <div className="legend"><h4>Magnitude</h4><div><i style={{ background: '#d9534f' }}></i> 5.0+</div><div><i style={{ background: '#f0ad4e' }}></i> 3.0 - 4.9</div><div><i style={{ background: '#5cb85c' }}></i> &lt; 3.0</div></div> );

// SIDE PANEL COMPONENT
const SidePanel = ({ earthquake, onClose }: { earthquake: EarthquakeFeature | null; onClose: () => void; }) => {
  if (!earthquake) return <div className="side-panel hidden"></div>;
  const { place, mag, time, url } = earthquake.properties;
  return ( <div className="side-panel"><button className="close-btn" onClick={onClose}>&times;</button><h2>Event Details</h2><div className="details-grid"><div className="detail-item"><strong>📍 Location</strong><span>{place || 'Unknown location'}</span></div><div className="detail-item"><strong>⚡ Magnitude</strong><span>{mag !== null ? mag.toFixed(1) : 'N/A'}</span></div><div className="detail-item"><strong>🕒 Time</strong><span>{new Date(time).toLocaleString()}</span></div><div className="detail-item"><a href={url} target="_blank" rel="noopener noreferrer">View Full Report on USGS</a></div></div></div> );
};

// Theme Toggle Button Component
const ThemeToggleButton = ({ theme, setTheme }: { theme: 'light' | 'dark', setTheme: (theme: 'light' | 'dark') => void }) => {
  const toggleTheme = () => { setTheme(theme === 'light' ? 'dark' : 'light'); };
  return ( <button className="theme-toggle-button" onClick={toggleTheme} title="Toggle UI Theme">{theme === 'light' ? '🌙' : '☀️'}</button> );
};

function App() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEarthquake, setSelectedEarthquake] = useState<EarthquakeFeature | null>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);
  
  useEffect(() => {
    if (debouncedSearchQuery.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedSearchQuery)}&limit=5`);
          const data = await response.json();
          setSuggestions(data.map((item: any) => ({ osm_id: item.osm_id, display_name: item.display_name, lat: item.lat, lon: item.lon, type: item.type, boundingbox: item.boundingbox, })));
        } catch (searchError) { console.error("Failed to fetch suggestions:", searchError); }
      };
      fetchSuggestions();
    } else { setSuggestions([]); }
  }, [debouncedSearchQuery]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    if (!map) return;
    if (suggestion.type === 'country' && suggestion.boundingbox) {
      const [minLat, maxLat, minLon, maxLon] = suggestion.boundingbox.map(parseFloat);
      map.fitBounds([[minLat, minLon], [maxLat, maxLon]], { animate: true, duration: 1.5, easeLinearity: 0.2 });
    } else {
      map.flyTo([parseFloat(suggestion.lat), parseFloat(suggestion.lon)], 12, { animate: true, duration: 1.5, easeLinearity: 0.2 });
    }
  };

  useEffect(() => {
    if (selectedEarthquake && map) {
      const [lng, lat] = selectedEarthquake.geometry.coordinates;
      map.flyTo([lat, lng], 8, { animate: true, duration: 1.5, easeLinearity: 0.2 });
    }
  }, [selectedEarthquake, map]);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        if (!response.ok) throw new Error('Failed to fetch data.');
        const data = await response.json();
        setEarthquakes(data.features);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEarthquakes();
  }, []);

  if (isLoading) return <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading seismic data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <SidePanel earthquake={selectedEarthquake} onClose={() => setSelectedEarthquake(null)} />
      
      <MapContainer 
        center={[20, 0]} 
        zoom={3} 
        scrollWheelZoom={true} 
        minZoom={2} 
        style={{ height: "100vh", width: "100vw" }} 
        ref={setMap}
        zoomControl={false}
        // CORRECTED: These three lines stop the map from repeating or showing blank space
        noWrap={true}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark Map">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='Tiles &copy; Esri' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topographic Map">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        <ZoomControl position="bottomright" />
        <ThemeToggleButton theme={theme} setTheme={setTheme} />

        <div className="info-card">
          <h1>🌎 Recent Earthquake Tracker</h1>
          <div className="search-wrapper">
            <form onSubmit={(e) => { e.preventDefault(); if (suggestions.length > 0) handleSuggestionClick(suggestions[0]); }} className="search-container">
              <input type="text" placeholder="Search for a country or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoComplete="off" />
              <button type="submit">Go</button>
            </form>
            {suggestions.length > 0 && ( <ul className="suggestions-list">{suggestions.map((s) => ( <li key={s.osm_id} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>{s.display_name}</li> ))}</ul> )}
          </div>
        </div>

        <Legend />

        {earthquakes.map(earthquake => {
          const position: LatLngExpression = [ earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0] ];
          return (
            <Marker key={earthquake.id} position={position} icon={getMarkerIcon(earthquake.properties.mag)} eventHandlers={{ click: () => { setSelectedEarthquake(earthquake); } }}>
              <Popup><b>{earthquake.properties.place}</b><br />Magnitude: {earthquake.properties.mag !== null ? earthquake.properties.mag : 'N/A'}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}

export default App;
