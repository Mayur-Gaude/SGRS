export type LngLat = [number, number];

export type GeoBoundary = {
  type: 'Polygon';
  coordinates: LngLat[][];
};

export type LatLngPoint = {
  latitude: number;
  longitude: number;
};

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export const normalizePolygonFromGeoBoundary = (geoBoundary?: GeoBoundary | null): LatLngPoint[] => {
  if (!geoBoundary || geoBoundary.type !== 'Polygon' || !Array.isArray(geoBoundary.coordinates)) {
    return [];
  }

  const ring = geoBoundary.coordinates[0];
  if (!Array.isArray(ring)) return [];

  return ring
    .filter((point) => Array.isArray(point) && point.length === 2)
    .map((point) => ({ latitude: Number(point[1]), longitude: Number(point[0]) }))
    .filter((point) => isFiniteNumber(point.latitude) && isFiniteNumber(point.longitude));
};

export const normalizeGeoBoundaryFromMapPoints = (points: LatLngPoint[]): GeoBoundary | null => {
  if (!Array.isArray(points) || points.length < 3) return null;

  const ring = points.map((point) => [Number(point.longitude), Number(point.latitude)] as LngLat);
  const first = ring[0];
  const last = ring[ring.length - 1];

  if (!first || !last) return null;

  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }

  return {
    type: 'Polygon',
    coordinates: [ring],
  };
};

export const isPointInPolygon = (point: LatLngPoint, polygon: LatLngPoint[]): boolean => {
  if (!Array.isArray(polygon) || polygon.length < 4) return false;

  let inside = false;
  const x = point.longitude;
  const y = point.latitude;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude;
    const yi = polygon[i].latitude;
    const xj = polygon[j].longitude;
    const yj = polygon[j].latitude;

    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
};
