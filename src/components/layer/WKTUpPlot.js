import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import WKT from 'ol/format/WKT';

const WKTUpPlot = ({ setWKTGeoJSONData, fitToBounds }, ref) => {
  const fileInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
    }
  }));

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const wktString = e.target.result;
      let geojsonData = null;

      try {
        const format = new WKT();
        const feature = format.readFeature(wktString, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326'
        });

        const geometry = feature.getGeometry();

        geojsonData = {
          type: "Feature",
          geometry: {
            type: geometry.getType(),
            coordinates: geometry.getCoordinates()
          },
          properties: {}
        };

        setWKTGeoJSONData(geojsonData);

        if (fitToBounds) {
          const coords = geometry.getExtent();
          fitToBounds([
            [coords[1], coords[0]],
            [coords[3], coords[2]]
          ]);
        }

      } catch (error) {
        console.error("Error parsing WKT file:", error);
        alert("Error parsing WKT file. Please ensure it is valid WKT.");
        setWKTGeoJSONData(null);
      }

      // 👇 Reset the input so the same file can be uploaded again
      if (event.target) {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '10px', background: '#eee', marginBottom: '10px' }}>
      <label htmlFor="wkt-upload">Upload WKT File:</label>
      <input 
        id="wkt-upload" 
        type="file" 
        accept=".wkt, text/plain" 
        onChange={handleFileChange} 
        ref={fileInputRef}
      />
    </div>
  );
};

export default forwardRef(WKTUpPlot);
