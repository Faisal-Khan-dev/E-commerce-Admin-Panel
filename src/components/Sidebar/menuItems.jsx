import { MdOutlineDashboard } from "react-icons/md";
import { FaUsers, FaShoppingCart, FaBoxOpen, FaLayerGroup, FaCog } from "react-icons/fa";

const menuItems = [
    { label: "Dashboard", icon: <MdOutlineDashboard />, path: "/" },
    { label: "Customers", icon: <FaUsers />, path: "/customers" },
    { label: "Orders", icon: <FaShoppingCart />, path: "/orders" },
    { label: "Products", icon: <FaBoxOpen />, path: "/products" },
    { label: "Categories", icon: <FaLayerGroup />, path: "/categories" },
    { label: "Settings", icon: <FaCog />, path: "/settings" },
];

export default menuItems;