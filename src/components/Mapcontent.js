import React, { useState , useRef} from 'react';
import { Marker, MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import CSVUpPlot from './layer/CSVUpPlot';
import WKTUpPlot from './layer/WKTUpPlot';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12.5, 20.5]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Mapcontent = () => {
    const mapRef = useRef();
    const [CSVUpData, setCSVUpData] = useState(null);
    const [WKTGeoJSONData, setWKTGeoJSONData] = useState(null);
    const csvPlotRef = useRef(null);
    const wktPlotRef = useRef(null);

    const fit2screen = (objects) => {
        const bounds = objects.reduce(
            function(acc, cur) {
                return acc.extend([cur.lat, cur.lng]); 
            },
            L.latLngBounds()
        );
        
        if (mapRef.current && bounds.isValid()) {
            mapRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
    };

    const fitToBoundsWKT = (boundsArray) => {
        const bounds = L.latLngBounds(boundsArray);
        if (mapRef.current && bounds.isValid()) {
            mapRef.current.fitBounds(bounds, { padding: [20, 20] });
        }
    };

    const clearCSVMarkers = () => {
        setCSVUpData(null);
        csvPlotRef.current?.reset();
    };

    const clearWKTPolygons = () => {
        setWKTGeoJSONData(null);
        wktPlotRef.current?.reset();
    };

    return (
        <div>
            
            <div
            style={{
                display: 'flex',
                gap: '10px',
                padding: '10px',
                backgroundColor: '#f8f8f8',
                borderBottom: '1px solid #ddd',
                flexWrap: 'wrap',
                flexDirection: 'column' // stack vertically
            }}
            >
            <div style={{ display: 'flex', gap: '10px' }}>
                <CSVUpPlot 
                ref={csvPlotRef}
                setCSVData={setCSVUpData}
                fit2screen={fit2screen}
                />
                
                <WKTUpPlot 
                ref={wktPlotRef}
                setWKTGeoJSONData={setWKTGeoJSONData}
                fitToBounds={fitToBoundsWKT}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                onClick={clearCSVMarkers}
                style={{ padding: '8px 15px', border: '1px solid #e74c3c', background: '#f9f9f9', cursor: 'pointer', color: '#e74c3c' }}
                disabled={!CSVUpData}
                >
                Clear Markers
                </button>
                
                <button 
                onClick={clearWKTPolygons}
                style={{ padding: '8px 15px', border: '1px solid #3498db', background: '#f9f9f9', cursor: 'pointer', color: '#3498db' }}
                disabled={!WKTGeoJSONData}
                >
                Clear Polygons
                </button>
            </div>
            </div>
            
            <MapContainer 
                ref={mapRef}
                style={{ width: '100%', height: '100vh' }}
                center={[35, 137]}
                zoom={10} 
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            
                {WKTGeoJSONData && (
                    <GeoJSON 
                        key={JSON.stringify(WKTGeoJSONData)}
                        data={WKTGeoJSONData} 
                        style={() => ({
                            color: 'red',
                            weight: 3,
                            opacity: 0.7,
                            fillColor: 'red',
                            fillOpacity: 0.2 
                        })}
                    />
                )}
                
                {CSVUpData && CSVUpData.map((item, index) =>
                    <Marker
                        key={`csv-${index}`}
                        position={[item.lat, item.lng]}>
                        <Popup
                            maxHeight={270}
                            maxWidth={150}>
                            
                            {Object.entries(item).map(([key, value]) => {
                                const stringValue = String(value).trim();
                                
                                
                                if (key === 'lat' || key === 'lng' || key === '緯度' || key === '経度' || stringValue === '') {
                                    return null; 
                                }

                                if (key === '画像1' || key === '画像2') {
                                    return (
                                        <div key={key} style={{ marginBottom: '10px' }}>
                                            <strong>{key}:</strong>
                                            <img 
                                                src={stringValue}
                                                alt={`Image for ${key}`} 
                                                style={{ 
                                                    maxWidth: '100%', 
                                                    height: 'auto', 
                                                    display: 'block', 
                                                    marginTop: '5px' 
                                                }}
                                            />
                                        </div>
                                    );
                                }
                                
                                if (key === '公式ホームページ') {
                                    const safeUrl = stringValue.startsWith('http') ? stringValue : `http://${stringValue}`;
                                    return (
                                        <div key={key}>
                                            <strong>{key}:</strong>
                                            <a href={safeUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                                                {stringValue}
                                            </a>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <div key={key}>
                                        <strong>{key}:</strong> {stringValue}
                                    </div>
                                );
                            })}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}

export default Mapcontent;