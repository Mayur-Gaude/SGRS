export const allowBannedForAppeal = (req, res, next) => {
    req.allowBanned = true;
    console.log("Inside Allowed appeal ban api", req.allowBanned);
    next();
};