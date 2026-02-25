import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        // Simple routing (current)
        pincode: {
            type: String,
            required: true,
        },

        ward: {
            type: String,
        },

        // 🔥 Future Geofencing Support
        geo_boundary: {
            type: {
                type: String,
                enum: ["Polygon"],
            },
            coordinates: [[[Number]]], // GeoJSON Polygon
        },

        // Hierarchy
        parent_area_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Area",
            default: null,
        },

        level: {
            type: Number,
            default: 1,
        },

        is_active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// 🔥 Geospatial Index (Future ready)
areaSchema.index({ geo_boundary: "2dsphere" });

export default mongoose.model("Area", areaSchema);