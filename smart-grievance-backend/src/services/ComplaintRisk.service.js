// export const calculateComplaintRisk = (data) => {
//     let score = 0;

//     // Short description
//     if (data.description.length < 15) {
//         score += 30;
//     }

//     // Suspicious keywords
//     const spamWords = ["fake", "test", "spam"];

//     spamWords.forEach((word) => {
//         if (data.description.toLowerCase().includes(word)) {
//             score += 20;
//         }
//     });

//     let level = "LOW";

//     if (score >= 60) {
//         level = "HIGH";
//     } else if (score >= 30) {
//         level = "MEDIUM";
//     }

//     return {
//         score,
//         level,
//     };
// };

// export const calculateComplaintRisk = (data) => {
//     let score = 0;
//     const reasons = [];

//     const description = data.description?.toLowerCase() || "";
//     const title = data.title?.toLowerCase() || "";

//     // 1. Very short complaint
//     if (description.length < 20) {
//         score += 25;
//         reasons.push("Very short description");
//     }

//     // 2. Repeated characters (aaaaaa, !!!!!)
//     if (/(.)\1{5,}/.test(description)) {
//         score += 20;
//         reasons.push("Repeated characters detected");
//     }

//     // 3. Spam keywords
//     const spamWords = [
//         "fake",
//         "spam",
//         "test",
//         "dummy",
//         "random",
//         "checking"
//     ];

//     const foundWords = spamWords.filter(word =>
//         description.includes(word) || title.includes(word)
//     );

//     if (foundWords.length > 0) {
//         score += foundWords.length * 15;
//         reasons.push(`Suspicious keywords: ${foundWords.join(", ")}`);
//     }

//     // 4. Excessive special characters
//     const specialChars =
//         (description.match(/[!@#$%^&*()_+=<>?{}[\]~]/g) || []).length;

//     if (specialChars > 15) {
//         score += 15;
//         reasons.push("Too many special characters");
//     }

//     // 5. Extremely short title
//     if (title.length < 5) {
//         score += 10;
//         reasons.push("Title too short");
//     }

//     // Cap score at 100
//     score = Math.min(score, 100);

//     let level = "LOW";

//     if (score >= 70) {
//         level = "HIGH";
//     } else if (score >= 40) {
//         level = "MEDIUM";
//     }

//     return {
//         score,
//         level,
//         reasons,
//     };
// };

export const calculateComplaintRisk = ({ title, description }) => {
    let score = 0;
    const reasons = [];

    const titleText = (title || "").trim().toLowerCase();
    const descText = (description || "").trim().toLowerCase();

    const fullText = `${titleText} ${descText}`;

    const words = fullText
        .split(/\s+/)
        .filter(word => word.length > 0);

    // -------------------------------------------------
    // 1. Very Short Description
    // -------------------------------------------------
    if (descText.length < 20) {
        score += 25;
        reasons.push("Very short description");
    }

    // -------------------------------------------------
    // 2. Very Short Title
    // -------------------------------------------------
    if (titleText.length < 5) {
        score += 10;
        reasons.push("Title too short");
    }

    // -------------------------------------------------
    // 3. Suspicious Keywords
    // -------------------------------------------------
    const spamWords = [
        "fake",
        "spam",
        "test",
        "dummy",
        "random",
        "checking",
        "trial",
        "sample"
    ];

    const foundWords = spamWords.filter(
        word =>
            titleText.includes(word) ||
            descText.includes(word)
    );

    if (foundWords.length > 0) {
        score += foundWords.length * 15;
        reasons.push(
            `Suspicious keywords detected (${foundWords.join(", ")})`
        );
    }

    // -------------------------------------------------
    // 4. Repeated Characters
    // Example: AAAAAAA, !!!!!!!!
    // -------------------------------------------------
    if (/(.)\1{4,}/i.test(fullText)) {
        score += 20;
        reasons.push("Repeated characters detected");
    }

    // -------------------------------------------------
    // 5. Excessive Special Characters
    // -------------------------------------------------
    const specialCharCount =
        (fullText.match(/[!@#$%^&*()_+=<>?{}[\]~]/g) || [])
            .length;

    if (specialCharCount > 10) {
        score += 15;
        reasons.push("Too many special characters");
    }

    // -------------------------------------------------
    // 6. Mostly Uppercase Title
    // -------------------------------------------------
    const uppercaseCount =
        (title.match(/[A-Z]/g) || []).length;

    if (
        title.length > 0 &&
        uppercaseCount / title.length > 0.8
    ) {
        score += 10;
        reasons.push("Title contains excessive uppercase letters");
    }

    // -------------------------------------------------
    // 7. Gibberish Detection
    // Detect long words with no vowels
    // Example: skdnkjd, qwrtypl
    // -------------------------------------------------
    const gibberishWords = words.filter(word => {
        return (
            word.length >= 6 &&
            !/[aeiou]/i.test(word)
        );
    });

    if (gibberishWords.length >= 3) {
        score += 25;
        reasons.push("Possible gibberish content detected");
    }

    // -------------------------------------------------
    // 8. Too Many Random Long Words
    // -------------------------------------------------
    const suspiciousLongWords = words.filter(
        word => word.length >= 10
    );

    if (
        suspiciousLongWords.length >= 4
    ) {
        score += 15;
        reasons.push("Unusually large number of long random words");
    }

    // -------------------------------------------------
    // 9. Low Word Count
    // -------------------------------------------------
    if (words.length < 5) {
        score += 15;
        reasons.push("Too few meaningful words");
    }

    // -------------------------------------------------
    // Cap Score
    // -------------------------------------------------
    score = Math.min(score, 100);

    let level = "LOW";

    if (score >= 70) {
        level = "HIGH";
    } else if (score >= 40) {
        level = "MEDIUM";
    }

    return {
        score,
        level,
        reasons,
    };
};