// import axios from "axios";

// export const sendSMSOTP = async (phone, otp) => {
//     try {
//         const response = await axios.post(
//             "https://www.fast2sms.com/dev/bulkV2",
//             {
//                 sender_id: "FSTSMS",
//                 route: "otp",
//                 message: otp,
//                 language: "english",
//                 numbers: phone,
//             },
//             {
//                 headers: {
//                     authorization: process.env.FAST2SMS_API_KEY,
//                 },
//             }
//         );
//         console.log("SMS sent:", response.data);
//     } catch (err) {
//         console.error("Fast2SMS error:", err.response?.data || err.message);
//     }


// };

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;   // from Twilio Console
const authToken = process.env.TWILIO_AUTH_TOKEN;     // from Twilio Console
const client = twilio(accountSid, authToken);



export const sendSMSOTP = async (phone, otp) => {
    try {
        // console.log(accountSid, authToken, process.env.TWILIO_PHONE_NUMBER, phone); // Debug logs
        const message = await client.messages.create({
            body: `Your OTP code is ${otp}`,
            to: phone, // e.g. "+919999999999"
            from: process.env.TWILIO_PHONE_NUMBER, // Twilio number
        });

        // console.log("SMS sent:", message.sid);
        return { success: true, sid: message.sid };
    } catch (err) {
        console.error("Twilio error:", err.message);
        return { success: false, error: err.message };
    }
};