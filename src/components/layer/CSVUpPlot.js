import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import Papa from 'papaparse';

const CSVUpPlot = ({ setCSVData, fit2screen }, ref) => {
  const fileInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
    }
  }));

  const cleanAndParse = (coordString) => {
    if (!coordString) return NaN;
    const cleanedString = String(coordString).trim().replace(',', ''); 
    return parseFloat(cleanedString);
  };

  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true, 
      complete: (results) => {
        const rawData = results.data;

        const processedData = rawData
          .map(item => {
            const lat = cleanAndParse(item['緯度']); 
            const lng = cleanAndParse(item['経度']); 
            return {
              ...item, 
              lat: lat,
              lng: lng,
            };
          })
          .filter(item => !isNaN(item.lat) && !isNaN(item.lng));

        setCSVData(processedData);
        fit2screen(processedData);

        // 👇 Reset the input so the same file can be chosen again
        if (event.target) {
          event.target.value = "";
        }
      }
    });
  };

  return (
    <div style={{ padding: '10px', background: '#eee' }}>
      <label htmlFor="csv-upload">Upload CSV File:</label>
      <input 
        id="csv-upload" 
        type="file" 
        accept=".csv" 
        onChange={handleSelectFile}
        ref={fileInputRef}
      />
    </div>
  );
};

export default forwardRef(CSVUpPlot);
