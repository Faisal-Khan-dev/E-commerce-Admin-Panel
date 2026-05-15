import { MdOutlineDashboard, MdPerson } from "react-icons/md";
import { FaUsers, FaShoppingCart, FaBoxOpen } from "react-icons/fa";

const menuItems = [
    { label: "Dashboard", icon: <MdOutlineDashboard />, path: "/" },
    { label: "Customers", icon: <FaUsers />, path: "/customers" },
    { label: "Orders", icon: <FaShoppingCart />, path: "/orders" },
    { label: "Products", icon: <FaBoxOpen />, path: "/products" },
    { label: "Profile", icon: <MdPerson />, path: "/profile" },
    // { label: "Settings", icon: <FaCog />, path: "/settings" },
];

export default menuItems;