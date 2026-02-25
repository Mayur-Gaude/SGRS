import Complaint from "../models/complaint.model.js";

export const generateComplaintNumber = async () => {
    const count = await Complaint.countDocuments();

    const padded = String(count + 1).padStart(5, "0");

    const year = new Date().getFullYear();

    return `CMP-${year}-${padded}`;
};