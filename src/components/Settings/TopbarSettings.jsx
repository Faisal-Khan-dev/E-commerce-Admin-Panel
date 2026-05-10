import { useState, useEffect } from "react";
import { useSiteConfig, useUpdateSiteConfig } from "../../hooks/useSiteConfig";
import toast from "react-hot-toast";
import { MdAdd, MdDelete, MdSave, MdInfoOutline, MdLink, MdCampaign } from "react-icons/md";
import {
    TbBrandFacebook,
    TbBrandTwitter,
    TbBrandInstagram,
    TbBrandLinkedin,
    TbBrandYoutube,
    TbShare3,
} from "react-icons/tb";
import { SyncLoader } from "react-spinners";

const PLATFORMS = [
    { value: "facebook", label: "Facebook", Icon: TbBrandFacebook },
    { value: "twitter", label: "Twitter", Icon: TbBrandTwitter },
    { value: "instagram", label: "Instagram", Icon: TbBrandInstagram },
    { value: "linkedin", label: "LinkedIn", Icon: TbBrandLinkedin },
    { value: "youtube", label: "YouTube", Icon: TbBrandYoutube },
];

const getPlatformIcon = (value) => {
    const match = PLATFORMS.find((p) => p.value === value);
    if (!match) return <TbShare3 size={16} />;
    const { Icon } = match;
    return <Icon size={16} />;
};

const Toggle = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none"
        style={{
            background: checked
                ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
                : "var(--border-color)",
        }}
    >
        <span
            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
            style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
    </button>
);

const TopbarSettings = () => {
    const { data: config, isLoading } = useSiteConfig();
    const { mutate: updateConfig, isPending: isUpdating } = useUpdateSiteConfig();

    const [topbar, setTopbar] = useState({ text: "", link: "", enabled: true });
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
        if (config) {
            setTopbar(config.topbar || { text: "", link: "", enabled: true });
            setSocialLinks(config.socialLinks || []);
        }
    }, [config]);

    const handleAddSocial = () => {
        setSocialLinks([...socialLinks, { platform: "facebook", link: "" }]);
    };

    const handleRemoveSocial = (index) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const handleSocialChange = (index, field, value) => {
        const updated = [...socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setSocialLinks(updated);
    };

    const handleSave = () => {
        updateConfig(
            { topbar, socialLinks },
            {
                onSuccess: () => toast.success("Topbar settings updated"),
                onError: () => toast.error("Failed to update topbar"),
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <SyncLoader size={12} color="var(--color-primary)" />
            </div>
        );
    }

    return (
        <div className="p-1">

            <div className="flex items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                        Topbar Configuration
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        Announcement bar &amp; social media links
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="btn-primary flex items-center gap-2 !w-auto px-5 text-sm"
                >
                    {isUpdating ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Saving…
                        </>
                    ) : (
                        <>
                            <MdSave size={17} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-4">

                <div
                    className="rounded-xl p-5 space-y-4"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-color)",
                    }}
                >
                    {/* Card header */}
                    <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <div className="flex items-center gap-2.5">
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                                    color: "var(--color-primary)",
                                }}
                            >
                                <MdCampaign size={17} />
                            </span>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                    Announcement Bar
                                </p>
                                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                    Shown at the very top of your storefront
                                </p>
                            </div>
                        </div>

                        {/* Toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm hidden sm:block" style={{ color: "var(--text-secondary)" }}>
                                {topbar.enabled ? "Enabled" : "Disabled"}
                            </span>
                            <Toggle
                                checked={topbar.enabled}
                                onChange={(val) => setTopbar({ ...topbar, enabled: val })}
                            />
                        </div>
                    </div>

                    {/* Fields */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 transition-opacity duration-200"
                        style={{ opacity: topbar.enabled ? 1 : 0.45, pointerEvents: topbar.enabled ? "auto" : "none" }}
                    >
                        <div className="form-group">
                            <label className="label flex items-center gap-1.5">
                                <MdCampaign size={13} style={{ color: "var(--color-primary)" }} />
                                Announcement Text
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. Free shipping on orders over $50 🎉"
                                value={topbar.text}
                                onChange={(e) => setTopbar({ ...topbar, text: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label flex items-center gap-1.5">
                                <MdLink size={13} style={{ color: "var(--color-primary)" }} />
                                Link
                                <span
                                    className="text-xs font-normal px-1.5 py-0.5 rounded"
                                    style={{ background: "var(--bg-page)", color: "var(--text-secondary)" }}
                                >
                                    optional
                                </span>
                            </label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://yourstore.com/sale"
                                value={topbar.link}
                                onChange={(e) => setTopbar({ ...topbar, link: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="rounded-xl p-5 space-y-4"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-color)",
                    }}
                >
                    {/* Card header */}
                    <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <div className="flex items-center gap-2.5">
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                                    color: "var(--color-accent)",
                                }}
                            >
                                <TbShare3 size={16} />
                            </span>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                    Social Media Links
                                </p>
                                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                    {socialLinks.length} link{socialLinks.length !== 1 ? "s" : ""} added
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddSocial}
                            className="btn-secondary flex items-center gap-1.5 !w-auto px-3 text-sm"
                        >
                            <MdAdd size={16} />
                            Add Link
                        </button>
                    </div>

                    {/* Rows */}
                    {socialLinks.length > 0 ? (
                        <div className="space-y-2.5">
                            {socialLinks.map((social, idx) => (
                                <div key={idx} className="flex items-center gap-3">

                                    {/* Platform icon */}
                                    <span style={{ color: "var(--color-primary)" }} className="flex-shrink-0">
                                        {getPlatformIcon(social.platform)}
                                    </span>

                                    {/* Platform select */}
                                    <select
                                        value={social.platform}
                                        onChange={(e) => handleSocialChange(idx, "platform", e.target.value)}
                                        className="input !h-9 !w-36 flex-shrink-0 cursor-pointer"
                                        style={{ paddingLeft: "0.75rem" }}
                                    >
                                        {PLATFORMS.map((p) => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>

                                    {/* URL */}
                                    <input
                                        type="url"
                                        className="input !h-9 flex-1"
                                        placeholder={`https://${social.platform}.com/yourpage`}
                                        value={social.link}
                                        onChange={(e) => handleSocialChange(idx, "link", e.target.value)}
                                    />

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSocial(idx)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150"
                                        style={{ color: "var(--text-secondary)", background: "transparent" }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                                            e.currentTarget.style.color = "#ef4444";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = "var(--text-secondary)";
                                        }}
                                    >
                                        <MdDelete size={17} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="rounded-lg py-8 flex flex-col items-center gap-2 text-center"
                            style={{ border: "2px dashed var(--border-color)" }}
                        >
                            <TbShare3 size={22} style={{ color: "var(--text-secondary)" }} />
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                No social links added yet
                            </p>
                            <button
                                type="button"
                                onClick={handleAddSocial}
                                className="btn-primary flex items-center gap-1.5 !w-auto px-4 text-sm mt-1"
                            >
                                <MdAdd size={15} />
                                Add Your First Link
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                style={{
                    background: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                    color: "var(--color-primary)",
                    border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)",
                }}
            >
                <MdInfoOutline size={16} className="flex-shrink-0" />
                <span>Changes are applied immediately after saving.</span>
            </div>
        </div>
    );
};

export default TopbarSettings;