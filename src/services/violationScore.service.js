// Configurable scoring system
const SEVERITY_POINTS = {
    MINOR: 1,
    MODERATE: 3,
    SEVERE: 5,
    CRITICAL: 10,
};

const BAN_THRESHOLDS = {
    WARNING: 5,
    TEMP_BAN: 10,
    PERMANENT_BAN: 20,
};

export const getPointsFromSeverity = (severity) => {
    return SEVERITY_POINTS[severity] || 0;
};

export const calculateUserScore = (violations) => {
    return violations.reduce((total, v) => {
        return total + getPointsFromSeverity(v.severity);
    }, 0);
};

export const getSuggestedAction = (score, severity) => {
    // Immediate ban for critical
    if (severity === "CRITICAL") {
        return "PERMANENT_BAN";
    }

    if (score >= BAN_THRESHOLDS.PERMANENT_BAN) {
        return "PERMANENT_BAN";
    }

    if (score >= BAN_THRESHOLDS.TEMP_BAN) {
        return "TEMP_BAN";
    }

    if (score >= BAN_THRESHOLDS.WARNING) {
        return "WARNING";
    }

    return "NONE";
};