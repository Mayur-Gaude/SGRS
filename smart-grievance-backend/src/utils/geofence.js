const isFiniteNumber = (value) =>
    typeof value === "number" && Number.isFinite(value);

const isValidLongitude = (value) =>
    isFiniteNumber(value) && value >= -180 && value <= 180;

const isValidLatitude = (value) =>
    isFiniteNumber(value) && value >= -90 && value <= 90;

const coordinatesEqual = (a, b) =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === 2 &&
    b.length === 2 &&
    a[0] === b[0] &&
    a[1] === b[1];

export const validatePolygonGeoBoundary = (geoBoundary) => {
    if (!geoBoundary) return;

    if (geoBoundary.type !== "Polygon") {
        throw new Error("geo_boundary.type must be Polygon");
    }

    if (
        !Array.isArray(geoBoundary.coordinates) ||
        geoBoundary.coordinates.length === 0
    ) {
        throw new Error("geo_boundary.coordinates must contain at least one linear ring");
    }

    const outerRing = geoBoundary.coordinates[0];

    if (!Array.isArray(outerRing) || outerRing.length < 4) {
        throw new Error("Polygon outer ring must contain at least 4 points");
    }

    for (const point of outerRing) {
        if (!Array.isArray(point) || point.length !== 2) {
            throw new Error("Each polygon point must be [longitude, latitude]");
        }

        const [lng, lat] = point;
        if (!isValidLongitude(lng) || !isValidLatitude(lat)) {
            throw new Error("Polygon coordinates must be valid longitude/latitude values");
        }
    }

    const firstPoint = outerRing[0];
    const lastPoint = outerRing[outerRing.length - 1];
    if (!coordinatesEqual(firstPoint, lastPoint)) {
        throw new Error("Polygon outer ring must be closed (first point equals last point)");
    }
};

export const isPointInsidePolygon = (latitude, longitude, polygonCoordinates = []) => {
    if (!Array.isArray(polygonCoordinates) || polygonCoordinates.length < 4) {
        return false;
    }

    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
        return false;
    }

    let inside = false;
    for (let i = 0, j = polygonCoordinates.length - 1; i < polygonCoordinates.length; j = i++) {
        const pointI = polygonCoordinates[i];
        const pointJ = polygonCoordinates[j];

        if (!Array.isArray(pointI) || !Array.isArray(pointJ)) {
            continue;
        }

        const xi = pointI[0];
        const yi = pointI[1];
        const xj = pointJ[0];
        const yj = pointJ[1];

        const intersects =
            yi > latitude !== yj > latitude &&
            longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi;

        if (intersects) inside = !inside;
    }

    return inside;
};
