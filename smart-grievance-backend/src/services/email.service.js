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

export const sendDepartmentAdminCredentialsEmail = async ({
    email,
    full_name,
    password,
    department_name,
}) => {
    await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: "Smart Grievance",
                email: process.env.BREVO_SENDER,
            },
            to: [{ email }],
            subject: "Your Department Admin Account Credentials",
            htmlContent: `
                <p>Hello ${full_name || "Admin"},</p>
                <p>Your Department Admin account has been created.</p>
                <p><strong>Department:</strong> ${department_name || "N/A"}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> ${password}</p>
                <p>Please login and change your password immediately.</p>
            `,
        },
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );
};