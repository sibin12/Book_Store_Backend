import PurchaseHistory from "../models/PurchaseHistory.js";

// function for revenue calculation
export async function calculateRevenue(month, year) {

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const purchaseHistory = await PurchaseHistory.find({
            purchaseDate: { $gte: startDate, $lte: endDate }
        });

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