import Complaint from "../../models/complaint.model.js";
import ComplaintMedia from "../../models/complaintMedia.model.js";

export const uploadComplaintMedia = async (
    complaint_id,
    file,
    currentUser
) => {
    const complaint =
        await Complaint.findById(complaint_id);

    if (!complaint)
        throw new Error("Complaint not found");

    const media = await ComplaintMedia.create({
        complaint_id,
        media_type: "PHOTO",
        media_url: file.path,
        uploaded_by: currentUser._id,
    });

    return media;
};

export const getComplaintMedia = async (
    complaint_id
) => {
    return ComplaintMedia.find({
        complaint_id,
    }).sort({ createdAt: -1 });
};