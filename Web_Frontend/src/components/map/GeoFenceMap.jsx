import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useRef } from "react";

const GeoFenceMap = ({ setPolygon, existingPolygon }) => {
  const featureGroupRef = useRef();

  const onCreated = (e) => {
    const layer = e.layer;

    if (layer.getLatLngs) {
      const coords = layer.getLatLngs()[0].map((latlng) => [
        latlng.lng,
        latlng.lat,
      ]);

      coords.push(coords[0]);

      setPolygon(coords);
    }
  };

  // 🔥 Convert GeoJSON → Leaflet format
  const convertToLatLng = (coords) => {
    return coords.map(([lng, lat]) => [lat, lng]);
  };

  return (
    <MapContainer
      center={[15.2993, 74.1240]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FeatureGroup ref={featureGroupRef}>
        {/* 🔥 SHOW EXISTING POLYGON */}
        {existingPolygon && (
          <Polygon positions={convertToLatLng(existingPolygon)} />
        )}

        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            rectangle: false,
            circle: false,
            marker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default GeoFenceMap;