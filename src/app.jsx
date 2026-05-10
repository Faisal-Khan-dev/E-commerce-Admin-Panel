import AppRoutes from "./routes/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <>
            <AppRoutes />
            <Toaster />
        </>
    );
};

export default App;