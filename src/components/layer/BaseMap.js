import React from 'react'
import { LayersControl, TileLayer } from 'react-leaflet'

const BaseMap = () => {
  return (
    <LayersControl position='topright'>
        <LayersControl.BaseLayer name = "MainMapLayer">
            <TileLayer url='https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}'> </TileLayer>
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name = "Another Map Layer">
        <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
        </LayersControl.BaseLayer>
    </LayersControl>
  )
}

export default BaseMap