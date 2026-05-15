import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Customers, AddCustomer, EditCustomer, Dashboard, Login, Orders, OrderDetails, Products, AddProduct, EditProduct, ProductReviews, WebSettings, ViewProductDetails, Profile } from "../pages";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/login" element={<Login />} />

                {/* Protected */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/edit-product/:id" element={<EditProduct />} />
                        <Route path="/view-product/:slug" element={<ViewProductDetails />} />
                        <Route path="/product-reviews/:slug" element={<ProductReviews />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/add-customer" element={<AddCustomer />} />
                        <Route path="/edit-customer/:id" element={<EditCustomer />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<WebSettings />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;