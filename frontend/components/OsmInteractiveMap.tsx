import React, { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

type Point = { latitude: number; longitude: number };

type Props = {
  mode: 'marker' | 'polygon';
  center: Point;
  marker?: Point;
  polygon?: Point[];
  height?: number;
  onMarkerChange?: (point: Point) => void;
  onAddPoint?: (point: Point) => void;
};

const buildHtml = (mode: 'marker' | 'polygon', center: Point, marker?: Point, polygon: Point[] = []) => {
  const centerJson = JSON.stringify(center);
  const markerJson = JSON.stringify(marker || null);
  const polygonJson = JSON.stringify(polygon || []);

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      .leaflet-container {
        background: #f1f5f9;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
      const MODE = ${JSON.stringify(mode)};
      const center = ${centerJson};
      const initialMarker = ${markerJson};
      const points = ${polygonJson};

      const map = L.map('map').setView([center.latitude, center.longitude], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      let markerLayer = null;
      let polygonLayer = null;

      const post = (payload) => {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      };

      const renderPolygon = (polyPoints) => {
        if (polygonLayer) {
          map.removeLayer(polygonLayer);
          polygonLayer = null;
        }

        if (!polyPoints || polyPoints.length < 3) return;
        polygonLayer = L.polygon(polyPoints.map((p) => [p.latitude, p.longitude]), {
          color: '#1d4ed8',
          fillColor: '#1d4ed8',
          fillOpacity: 0.2,
          weight: 2,
        }).addTo(map);
      };

      if (points.length >= 3) renderPolygon(points);

      const upsertMarker = (latlng) => {
        if (!markerLayer) {
          markerLayer = L.marker(latlng, { draggable: true }).addTo(map);
          markerLayer.on('dragend', () => {
            const ll = markerLayer.getLatLng();
            post({ type: 'markerChange', latitude: ll.lat, longitude: ll.lng });
          });
        } else {
          markerLayer.setLatLng(latlng);
        }
      };

      if (initialMarker) {
        upsertMarker([initialMarker.latitude, initialMarker.longitude]);
      }

      map.on('click', (e) => {
        const latitude = e.latlng.lat;
        const longitude = e.latlng.lng;

        if (MODE === 'marker') {
          upsertMarker([latitude, longitude]);
          post({ type: 'markerChange', latitude, longitude });
          return;
        }

        post({ type: 'addPoint', latitude, longitude });
      });
    </script>
  </body>
</html>`;
};

export default function OsmInteractiveMap({
  mode,
  center,
  marker,
  polygon = [],
  height = 220,
  onMarkerChange,
  onAddPoint,
}: Props) {
  const html = useMemo(
    () => buildHtml(mode, center, marker, polygon),
    [mode, center, marker, polygon]
  );

  return (
    <View style={{ height, borderRadius: 12, overflow: 'hidden' }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data?.type === 'markerChange' && onMarkerChange) {
              onMarkerChange({ latitude: Number(data.latitude), longitude: Number(data.longitude) });
            }
            if (data?.type === 'addPoint' && onAddPoint) {
              onAddPoint({ latitude: Number(data.latitude), longitude: Number(data.longitude) });
            }
          } catch {
            // Ignore malformed messages from web content.
          }
        }}
      />
    </View>
  );
}
