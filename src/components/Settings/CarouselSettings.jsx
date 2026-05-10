import { useState, useEffect } from "react";
import { MdAdd, MdDelete, MdSave, MdLink, MdAddPhotoAlternate, MdInfoOutline } from "react-icons/md";
import toast from "react-hot-toast";

import { useSiteConfig, useUpdateSiteConfig } from "../../hooks/useSiteConfig";
import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";

const MAX_SLIDES = 6;

const SlideRow = ({ slide, index, onChange, onRemove }) => (
    <div
        className="rounded-xl p-4 transition-colors duration-200"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
    >
        <div className="flex gap-4 items-start">

            {/* Slide number badge */}
            <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1"
                style={{
                    background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                    color: "var(--color-primary)",
                }}
            >
                {index + 1}
            </div>

            {/* Image preview / upload trigger */}
            <label className="cursor-pointer flex-shrink-0 group/img">
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(index, "file", file);
                    }}
                />
                <div
                    className="w-36 h-20 rounded-lg flex items-center justify-center overflow-hidden transition-opacity"
                    style={{
                        background: slide.preview
                            ? `url(${slide.preview}) center/cover no-repeat`
                            : "var(--bg-page)",
                        border: "1px dashed var(--border-color)",
                    }}
                >
                    {!slide.preview ? (
                        <div className="flex flex-col items-center gap-1">
                            <MdAddPhotoAlternate size={22} style={{ color: "var(--color-primary)" }} />
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                Click to upload
                            </span>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/40 rounded-lg">
                            <MdAddPhotoAlternate size={22} color="white" />
                        </div>
                    )}
                </div>
            </label>

            {/* Link field */}
            <div className="flex-1 form-group">
                <label className="label flex items-center gap-1.5">
                    <MdLink size={13} style={{ color: "var(--color-primary)" }} />
                    Destination Link
                    <span
                        className="text-xs font-normal px-1.5 py-0.5 rounded"
                        style={{ background: "var(--bg-page)", color: "var(--text-secondary)" }}
                    >
                        optional
                    </span>
                </label>
                <CustomInput
                    value={slide.link}
                    onChange={(e) => onChange(index, "link", e.target.value)}
                    placeholder="/products/winter-collection"
                    height={40}
                />
            </div>

            {/* Delete button */}
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-150"
                style={{ color: "var(--text-secondary)", background: "transparent" }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                    e.currentTarget.style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                }}
                title="Remove slide"
            >
                <MdDelete size={18} />
            </button>
        </div>
    </div>
);

const EmptySlides = ({ onAdd }) => (
    <div
        className="rounded-xl py-16 flex flex-col items-center justify-center text-center gap-4"
        style={{ border: "2px dashed var(--border-color)", background: "transparent" }}
    >
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
                background: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                color: "var(--color-primary)",
            }}
        >
            <MdAddPhotoAlternate size={28} />
        </div>
        <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                No carousel slides yet
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Add up to {MAX_SLIDES} banner images to display on your homepage
            </p>
        </div>
        <CustomButton onClick={onAdd} startIcon={<MdAdd size={17} />} sx={{ px: 3 }}>
            Add Your First Slide
        </CustomButton>
    </div>
);

const CarouselSettings = () => {
    const { data: config } = useSiteConfig();
    const { mutate: updateConfig, isPending: isUpdating } = useUpdateSiteConfig();

    const [slides, setSlides] = useState([]);

    useEffect(() => {
        if (config?.carousel) {
            setSlides(
                config.carousel.map((s) => ({ image: s.image, preview: s.image, link: s.link || "" }))
            );
        }
    }, [config]);

    const handleAdd = () => {
        if (slides.length >= MAX_SLIDES) {
            toast.error(`Maximum ${MAX_SLIDES} slides allowed`);
            return;
        }
        setSlides((prev) => [...prev, { image: "", preview: "", link: "", file: null }]);
    };

    const handleRemove = (index) => {
        setSlides((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        setSlides((prev) => {
            const updated = [...prev];
            if (field === "file") {
                updated[index] = {
                    ...updated[index],
                    file: value,
                    preview: URL.createObjectURL(value),
                };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            return updated;
        });
    };

    const handleSave = () => {
        console.log(slides);
        const allHaveImage = slides.every((s) => s.image || s.file);
        if (!allHaveImage) return toast.error("All slides must have an image");

        const newFiles = slides.filter((s) => s.file);
        const existingSlides = slides.filter((s) => !s.file).map(({ image, link }) => ({ image, link }));

        if (newFiles.length > 0) {
            const formData = new FormData();
            formData.append("existingSlides", JSON.stringify(existingSlides));
            newFiles.forEach((s, i) => {
                formData.append("images", s.file);
                formData.append(`link_${i}`, s.link);
            });
            updateConfig(formData, {
                onSuccess: () => toast.success("Carousel updated successfully"),
                onError: (err) => toast.error(err?.response?.data?.message || "Failed to update carousel"),
            });
        } else {
            updateConfig(
                { carousel: existingSlides },
                {
                    onSuccess: () => toast.success("Carousel updated successfully"),
                    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update carousel"),
                }
            );
        }
    };

    return (
        <div className="p-1">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                        Hero Carousel Slides
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        Manage the banners displayed on your homepage · {slides.length}/{MAX_SLIDES} slides
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={slides.length >= MAX_SLIDES}
                        className="btn-secondary flex items-center gap-2 !w-auto px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdAdd size={17} />
                        Add Slide
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isUpdating || slides.length === 0}
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
            </div>

            {/* Slide list or empty state */}
            {slides.length > 0 ? (
                <div className="space-y-3">
                    {slides.map((slide, index) => (
                        <SlideRow
                            key={index}
                            slide={slide}
                            index={index}
                            onChange={handleChange}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>
            ) : (
                <EmptySlides onAdd={handleAdd} />
            )}

            {/* Info banner */}
            {slides.length > 0 && (
                <div
                    className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                    style={{
                        background: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                        color: "var(--color-primary)",
                        border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)",
                    }}
                >
                    <MdInfoOutline size={16} className="flex-shrink-0" />
                    <span>Click the image area to pick a photo from your device. Changes go live after saving.</span>
                </div>
            )}
        </div>
    );
};

export default CarouselSettings;