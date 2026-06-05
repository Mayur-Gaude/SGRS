//area.service.js
import Area from "../../models/area.model.js";
import Department from "../../models/department.model.js";
import { validatePolygonGeoBoundary } from "../../utils/geofence.js";

const normalizeGeoBoundary = (geoBoundary) => {
    if (!geoBoundary) return undefined;

    if (geoBoundary.type !== "Polygon") {
        return geoBoundary;
    }

    const normalizedCoordinates = (geoBoundary.coordinates || []).map((ring) =>
        Array.isArray(ring)
            ? ring.map((point) =>
                Array.isArray(point) && point.length === 2
                    ? [Number(point[0]), Number(point[1])]
                    : point
            )
            : ring
    );

    return {
        type: "Polygon",
        coordinates: normalizedCoordinates,
    };
};

export const createArea = async (data) => {
    const department = await Department.findById(data.department_id);
    if (!department) throw new Error("Department not found");

    let level = 1;

    if (data.parent_area_id) {
        const parent = await Area.findById(data.parent_area_id);
        if (!parent) throw new Error("Parent area not found");

        level = parent.level + 1;
    }

    const payload = {
        ...data,
        level,
        geo_boundary: normalizeGeoBoundary(data.geo_boundary),
    };

    validatePolygonGeoBoundary(payload.geo_boundary);

    const area = await Area.create(payload);

    return area;
};

export const getAllAreas = async () => {
    return Area.find()
        .populate("department_id", "name code")
        .populate("parent_area_id", "name")
        .sort({ createdAt: -1 });
};

export const getAreaById = async (id) => {
    const area = await Area.findById(id)
        .populate("department_id", "name")
        .populate("parent_area_id", "name");

    if (!area) throw new Error("Area not found");
    return area;
};

export const updateArea = async (id, data) => {
    const payload = { ...data };

    if (data.geo_boundary !== undefined) {
        payload.geo_boundary = normalizeGeoBoundary(data.geo_boundary);
        validatePolygonGeoBoundary(payload.geo_boundary);
    }

    const area = await Area.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!area) throw new Error("Area not found");
    return area;
};

export const deactivateArea = async (id) => {
    const area = await Area.findByIdAndUpdate(
        id,
        { is_active: false },
        { new: true }
    );

    if (!area) throw new Error("Area not found");
    return area;
};
