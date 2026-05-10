import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import { MdEmail, MdLock } from "react-icons/md";
import toast from "react-hot-toast";
import { useLogin } from "../hooks/useAuth";

const Login = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const { mutate, isPending } = useLogin();

    const onSubmit = (data) => {
        mutate(data, {
            onSuccess: (res) => {
                toast.success(res.message || "Login successful");
                navigate("/");
            },
            onError: (err) => {
                setError("root", { message: err?.response?.data?.message || "Login failed" });
            }
        });
    }

    return (
        <div className="page-center">
            <div className="w-full max-w-md">

                <form onSubmit={handleSubmit(onSubmit)} className="card">
                    <div className="mb-2">
                        <h1 className="title text-center">Login</h1>
                        <p className="subtitle mt-1 text-center">Use your admin email and password</p>
                    </div>

                    {errors.root && (
                        <div className="text-sm rounded-lg p-3 border" style={{
                            color: "#b91c1c",
                            background: "color-mix(in srgb, #ef4444 10%, white)",
                            borderColor: "color-mix(in srgb, #ef4444 25%, var(--border-color))",
                        }}>
                            {errors.root.message}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="label">Email Address</label>
                        <CustomInput
                            id="email"
                            type="text"
                            placeholder="admin@example.com"
                            startIcon={<MdEmail style={{ color: "var(--text-secondary)" }} />}
                            height={48}
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "var(--bg-page)",
                                    "& fieldset": {
                                        borderColor: "var(--border-color)",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "color-mix(in srgb, var(--color-primary) 45%, var(--border-color))",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "var(--color-primary)",
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="label">Password</label>
                        <CustomInput
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            startIcon={<MdLock style={{ color: "var(--text-secondary)" }} />}
                            height={48}
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            {...register("password", {
                                required: "Password is required"
                            })}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "var(--bg-page)",
                                    "& fieldset": {
                                        borderColor: "var(--border-color)",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "color-mix(in srgb, var(--color-primary) 45%, var(--border-color))",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "var(--color-primary)",
                                    },
                                },
                            }}
                        />
                    </div>
                    <CustomButton
                        type="submit"
                        loading={isPending}
                        disabled={isPending}
                        fullWidth
                        height={46}
                        bgColor="var(--color-primary)"
                        sx={{
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                            boxShadow: "0 10px 26px color-mix(in srgb, var(--color-primary) 22%, transparent)",
                            "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: "0 14px 34px color-mix(in srgb, var(--color-primary) 28%, transparent)",
                            },
                        }}
                    >
                        Sign In
                    </CustomButton>

                    <div className="pt-2 text-xs text-center" style={{ color: "var(--text-secondary)" }}>
                        By signing in, you agree to the admin usage policy.
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;