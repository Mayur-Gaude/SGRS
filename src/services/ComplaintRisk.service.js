export const calculateComplaintRisk = (data) => {
    let score = 0;

    // Short description
    if (data.description.length < 15) {
        score += 30;
    }

    // Suspicious keywords
    const spamWords = ["fake", "test", "spam"];

    spamWords.forEach((word) => {
        if (data.description.toLowerCase().includes(word)) {
            score += 20;
        }
    });

    let level = "LOW";

    if (score >= 60) {
        level = "HIGH";
    } else if (score >= 30) {
        level = "MEDIUM";
    }

    return {
        score,
        level,
    };
};