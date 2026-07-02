import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },

    total_complaints: {
        type: Number,
        default: 0,
    },

    resolved_complaints: {
        type: Number,
        default: 0,
    },

    pending_complaints: {
        type: Number,
        default: 0,
    },

    avg_resolution_hours: {
        type: Number,
        default: 0,
    },

    sla_compliance_percent: {
        type: Number,
        default: 0,
    },

    report_period: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"],
        required: true,
    },

    period_start: {
        type: Date,
        required: true,
    },

    period_end: {
        type: Date,
        required: true,
    },

    report_date: {
        type: Date,
        default: Date.now,
    },

    generated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SuperAdmin",
        default: null, // for system cron jobs
    },

}, { timestamps: true });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;