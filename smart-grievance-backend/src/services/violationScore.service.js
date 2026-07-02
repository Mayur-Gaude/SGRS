// // Configurable scoring system
// const SEVERITY_POINTS = {
//     MINOR: 1,
//     MODERATE: 3,
//     SEVERE: 5,
//     CRITICAL: 10,
// };

// const BAN_THRESHOLDS = {
//     WARNING: 5,
//     TEMP_BAN: 10,
//     PERMANENT_BAN: 20,
// };

// export const getPointsFromSeverity = (severity) => {
//     return SEVERITY_POINTS[severity] || 0;
// };

// export const calculateUserScore = (violations) => {
//     return violations.reduce((total, v) => {
//         return total + getPointsFromSeverity(v.severity);
//     }, 0);
// };

// export const getSuggestedAction = (score, severity) => {
//     // Immediate ban for critical
//     if (severity === "CRITICAL") {
//         return "PERMANENT_BAN";
//     }

//     if (score >= BAN_THRESHOLDS.PERMANENT_BAN) {
//         return "PERMANENT_BAN";
//     }

//     if (score >= BAN_THRESHOLDS.TEMP_BAN) {
//         return "TEMP_BAN";
//     }

//     if (score >= BAN_THRESHOLDS.WARNING) {
//         return "WARNING";
//     }

//     return "NONE";
// };












// new risk score
export const SEVERITY_POINTS = {
    MINOR: 2,
    MODERATE: 5,
    SEVERE: 10,
    CRITICAL: 20,
};

export const ACTION_THRESHOLDS = {
    WARNING: 10,
    TEMP_BAN_7_DAYS: 20,
    TEMP_BAN_30_DAYS: 40,
    REVIEW_FOR_PERMANENT_BAN: 60,
};

export const getPointsFromSeverity = (severity) => {
    return SEVERITY_POINTS[severity] || 0;
};

export const calculateUserScore = (violations) => {
    return violations.reduce((total, violation) => {
        return total + getPointsFromSeverity(violation.severity);
    }, 0);
};

export const getViolationStats = (violations) => {
    return violations.reduce(
        (stats, violation) => {
            stats.total++;

            if (stats[violation.severity] !== undefined) {
                stats[violation.severity]++;
            }

            return stats;
        },
        {
            total: 0,
            MINOR: 0,
            MODERATE: 0,
            SEVERE: 0,
            CRITICAL: 0,
        }
    );
};

export const getSuggestedAction = ({
    score,
    violations,
}) => {
    const stats = getViolationStats(violations);

    // Multiple critical violations
    if (stats.CRITICAL >= 2) {
        return {
            action: "REVIEW_FOR_PERMANENT_BAN",
            duration: null,
            reason: "Multiple critical violations",
        };
    }

    // One critical violation
    if (stats.CRITICAL === 1) {
        return {
            action: "TEMP_BAN",
            duration: 30,
            reason: "Critical violation detected",
        };
    }

    if (score >= ACTION_THRESHOLDS.REVIEW_FOR_PERMANENT_BAN) {
        return {
            action: "REVIEW_FOR_PERMANENT_BAN",
            duration: null,
            reason: "Excessive violation score",
        };
    }

    if (score >= ACTION_THRESHOLDS.TEMP_BAN_30_DAYS) {
        return {
            action: "TEMP_BAN",
            duration: 30,
            reason: "High violation score",
        };
    }

    if (score >= ACTION_THRESHOLDS.TEMP_BAN_7_DAYS) {
        return {
            action: "TEMP_BAN",
            duration: 7,
            reason: "Repeated violations",
        };
    }

    if (score >= ACTION_THRESHOLDS.WARNING) {
        return {
            action: "WARNING",
            duration: null,
            reason: "Violation threshold reached",
        };
    }

    return {
        action: "NONE",
        duration: null,
        reason: null,
    };
};

export const getRecentViolations = (
    violations,
    months = 12
) => {
    const cutoff = new Date();

    cutoff.setMonth(
        cutoff.getMonth() - months
    );

    return violations.filter(
        v => new Date(v.created_at) >= cutoff
    );
};
