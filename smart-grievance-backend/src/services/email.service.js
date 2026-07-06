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

export const sendComplaintStatusUpdateEmail = async ({
    email,
    full_name,
    complaint_number,
    status,
    rejection_reason,
    department_name,
    category_name,
}) => {
    const statusMessages = {
        UNDER_REVIEW: "Your complaint is now under review by our team.",
        IN_PROGRESS: "Your complaint is being actively worked on.",
        RESOLVED: "Your complaint has been successfully resolved.",
        REJECTED: `Your complaint has been rejected. Reason: ${rejection_reason || "No reason provided"}`,
    };

    const statusColors = {
        UNDER_REVIEW: "#FFA500",
        IN_PROGRESS: "#1E90FF",
        RESOLVED: "#28A745",
        REJECTED: "#DC3545",
    };

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-bottom: 20px;">Complaint Status Update</h2>
                
                <p style="color: #555; font-size: 14px;">Hello ${full_name || "User"},</p>
                
                <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
                    We wanted to inform you about an update to your complaint.
                </p>

                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid ${statusColors[status]}; margin: 20px 0;">
                    <p style="margin: 0; color: #555; font-size: 14px;">
                        <strong>Complaint Number:</strong> ${complaint_number}
                    </p>
                    <p style="margin: 10px 0 0 0; color: #555; font-size: 14px;">
                        <strong>Department:</strong> ${department_name || "N/A"}
                    </p>
                    <p style="margin: 10px 0 0 0; color: #555; font-size: 14px;">
                        <strong>Category:</strong> ${category_name || "N/A"}
                    </p>
                </div>

                <div style="background-color: #f0f8ff; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 0; color: #333; font-size: 14px;">
                        <strong>Status:</strong> 
                        <span style="display: inline-block; background-color: ${statusColors[status]}; color: white; padding: 4px 8px; border-radius: 3px; margin-left: 8px;">
                            ${status.replace(/_/g, " ")}
                        </span>
                    </p>
                </div>

                <p style="color: #555; font-size: 14px; margin: 20px 0;">
                    ${statusMessages[status]}
                </p>

                <p style="color: #555; font-size: 14px; margin: 20px 0;">
                    You can view more details and updates about your complaint by logging into your account.
                </p>

                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

                <p style="color: #999; font-size: 12px; margin: 0;">
                    This is an automated email. Please do not reply to this email. If you have any questions, please contact our support team.
                </p>
            </div>
        </div>
    `;

    await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: "Smart Grievance System",
                email: process.env.BREVO_SENDER,
            },
            to: [{ email }],
            subject: `Your Complaint ${complaint_number} - Status Updated to ${status.replace(/_/g, " ")}`,
            htmlContent,
        },
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );
};