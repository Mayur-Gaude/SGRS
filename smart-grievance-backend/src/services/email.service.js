import axios from "axios";

export const sendEmailOTP = async (email, otp) => {
    await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: { name: "Smart Grievance", email: process.env.BREVO_SENDER },
            to: [{ email }],
            subject: "Your OTP Verification Code",
            htmlContent: `<p>Your OTP is <strong>${otp}</strong></p>`,
        },
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );
};