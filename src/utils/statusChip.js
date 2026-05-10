export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case "delivered":
            return { bg: "rgba(4, 120, 87, 0.1)", text: "#047857" };
        case "pending":
            return { bg: "rgba(217, 119, 6, 0.1)", text: "#d97706" };
        case "confirmed":
        case "shipped":
            return { bg: "rgba(2, 132, 199, 0.1)", text: "#0284c7" };
        case "cancelled":
            return { bg: "rgba(220, 38, 38, 0.1)", text: "#dc2626" };
        default:
            return { bg: "#f1f5f9", text: "#475569" };
    }
};

export const getStockStatusColor = (stock) => {
    if (stock > 0) {
        return {
            bg: "rgba(22, 163, 74, 0.1)",
            text: "#16a34a",
            label: `${stock} in stock`,
        };
    }

    return {
        bg: "rgba(220, 38, 38, 0.1)",
        text: "#dc2626",
        label: "Out of stock",
    };
};