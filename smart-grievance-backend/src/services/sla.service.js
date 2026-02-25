export const calculateSLA = (category) => {
    const now = new Date();

    const responseDeadline = new Date(
        now.getTime() + category.sla_response_hours * 60 * 60 * 1000
    );

    const resolutionDeadline = new Date(
        now.getTime() + category.sla_resolution_hours * 60 * 60 * 1000
    );

    return {
        responseDeadline,
        resolutionDeadline,
    };
};