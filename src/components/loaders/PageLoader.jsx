import { SyncLoader } from "react-spinners";

const PageLoader = () => {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--bg-page)",
            }}
        >
            <SyncLoader color={"var(--color-primary)"} size={12} />
        </div>
    );
}

export default PageLoader;