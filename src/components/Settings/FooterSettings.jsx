import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { MdSave, MdEmail, MdPhone, MdCopyright, MdInfoOutline } from "react-icons/md";
import { HiOfficeBuilding } from "react-icons/hi";
import toast from "react-hot-toast";

import { useSiteConfig, useUpdateSiteConfig } from "../../hooks/useSiteConfig";
import CustomInput from "../common/CustomInput";
import CustomTextarea from "../common/CustomTextArea";

const SettingsCard = ({ icon, iconColor = "var(--color-primary)", title, subtitle, children }) => (
    <div
        className="rounded-xl p-5 space-y-4"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
    >
        {/* Card header */}
        <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <span
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                    background: `color-mix(in srgb, ${iconColor} 10%, transparent)`,
                    color: iconColor,
                }}
            >
                {icon}
            </span>
            <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
            </div>
        </div>

        {children}
    </div>
);

const FooterSettings = () => {

    const { data: config } = useSiteConfig();
    const { mutate: updateConfig, isPending: isUpdating } = useUpdateSiteConfig();

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            copyright: "",
            aboutUs: "",
            contactInfo: { email: "", phone: "" },
        },
    });

    useEffect(() => {
        if (config?.footer) reset(config.footer);
    }, [config, reset]);

    const onSubmit = (data) => {
        updateConfig(
            { footer: data },
            {
                onSuccess: () => toast.success("Footer settings updated successfully"),
                onError: (err) => toast.error(err?.response?.data?.message || "Failed to update footer"),
            }
        );
    };

    return (
        <div className="p-1">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                            Footer Configuration
                        </h1>
                        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                            Manage what appears in your storefront footer
                        </p>
                    </div>

                    <button
                        type="submit"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

                    <SettingsCard
                        icon={<MdPhone size={16} />}
                        title="Contact Information"
                        subtitle="How customers can reach you"
                    >
                        <div className="form-group">
                            <label className="label">Email Address</label>
                            <Controller
                                name="contactInfo.email"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        {...field}
                                        type="email"
                                        placeholder="hello@yourstore.com"
                                        startIcon={<MdEmail style={{ color: "var(--color-primary)" }} />}
                                        height={42}
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Phone Number</label>
                            <Controller
                                name="contactInfo.phone"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        {...field}
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        startIcon={<MdPhone style={{ color: "var(--color-primary)" }} />}
                                        height={42}
                                    />
                                )}
                            />
                        </div>
                    </SettingsCard>

                    {/* Global Information */}
                    <SettingsCard
                        icon={<HiOfficeBuilding size={16} />}
                        iconColor="var(--color-accent)"
                        title="Global Information"
                        subtitle="Shown sitewide in the footer"
                    >
                        <div className="form-group">
                            <label className="label">Copyright Text</label>
                            <Controller
                                name="copyright"
                                control={control}
                                render={({ field }) => (
                                    <CustomInput
                                        {...field}
                                        placeholder="© 2026 Your Store Name"
                                        startIcon={<MdCopyright style={{ color: "var(--color-primary)" }} />}
                                        height={42}
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">About Us</label>
                            <Controller
                                name="aboutUs"
                                control={control}
                                render={({ field }) => (
                                    <CustomTextarea
                                        {...field}
                                        rows={4}
                                        placeholder="Tell customers about your mission and what makes you unique…"
                                    />
                                )}
                            />
                        </div>
                    </SettingsCard>
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

            </form>
        </div>
    );
};

export default FooterSettings;