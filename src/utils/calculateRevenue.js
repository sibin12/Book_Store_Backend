import PurchaseHistory from "../models/PurchaseHistory.js";

export async function calculateRevenue(month, year) {

    try {
        // Calculate the start and end dates of the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Query purchase history collection to get total revenue for the month
        const purchaseHistory = await PurchaseHistory.find({
            purchaseDate: { $gte: startDate, $lte: endDate }
        });

        // Calculate total revenue
        let totalRevenue = 0;
        for (const purchase of purchaseHistory) {
            totalRevenue += purchase.price * purchase.quantity;
        }

        return {
            currentMonth: month,
            currentYear: year,
            totalRevenue: totalRevenue
        };
    } catch (error) {
        console.error('Error calculating revenue:', error);
        throw error;
    }

}