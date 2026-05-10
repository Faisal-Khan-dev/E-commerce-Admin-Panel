import { MdMenu } from "react-icons/md";

const Topbar = ({ toggleSidebar, isMobile }) => {

    return (
        <div className="sticky top-0 z-10 w-full">
            <div
                className="h-14 w-full flex items-center justify-between px-4 sm:px-6 shadow-sm"
                style={{
                    background: "linear-gradient(to bottom, var(--bg-surface), var(--bg-page))",
                    borderBottom: "1px solid var(--border-color)",
                }}
            >
                {/* Left */}
                <div className="flex items-center gap-1">
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg transition-colors mr-1"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border-color)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <MdMenu size={22} />
                        </button>
                    )}
                    <h1
                        className="text-lg sm:text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Admin
                    </h1>
                </div>

                {/* Right */}
            </div>
        </div>
    );
};

export default Topbar;