import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Avatar, Paper, IconButton, TextField, Divider, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment } from "@mui/material";
import { MdArrowBack, MdEdit, MdEmail, MdPhone, MdLocationOn, MdDomain, MdLogout, MdLock, MdVerified, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useMe, useLogout } from "../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../services/user";
import { changePassword } from "../services/auth";
import CustomButton from "../components/common/CustomButton";
import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";

const Profile = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMe();
  const { mutate: logout } = useLogout();
  const [isEditing, setIsEditing] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    role: "user",
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (data) => {
      toast.success("Profile updated");
      queryClient.setQueryData(["me"], data);
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    }
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setOpenPasswordDialog(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSavePassword = () => {
    if (!passwordData.oldPassword.trim()) {
      return toast.error("Old password is required");
    }
    if (!passwordData.newPassword.trim()) {
      return toast.error("New password is required");
    }
    if (!passwordData.confirmPassword.trim()) {
      return toast.error("Confirm password is required");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New password and confirm password do not match");
    }
    if (passwordData.oldPassword === passwordData.newPassword) {
      return toast.error("New password must be different from old password");
    }
    
    passwordMutation.mutate({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword
    });
  };

  const handleSaveChanges = () => {
    if (!user?._id) return toast.error("User not loaded");
    const payload = { ...formData };
    mutation.mutate({ id: user._id, data: payload });
  };

  const fullName = `${user?.firstName || formData.firstName || ''} ${user?.lastName || formData.lastName || ''}`.trim();
  

  const handleLogout = () => {
    logout(null, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/login");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Logout failed");
      }
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <SyncLoader size={8} color="var(--color-primary)" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            "&:hover": { bgcolor: "var(--bg-page)" },
          }}
        >
          <MdArrowBack size={20} />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
            My Profile
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
            Manage your account settings and preferences
          </Typography>
        </Box>
      </Stack>

      {/* Profile Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2.5,
          bgcolor: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          mb: 3,
        }}
      >
        {/* Profile Header */}
        <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4, pb: 3, borderBottom: "1px solid var(--border-color)" }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "var(--color-primary)",
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            {(fullName.charAt(0) || "").toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 0.5 }}>
              {`${user?.firstName || formData.firstName || ""} ${user?.lastName || formData.lastName || ""}`.trim()}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--text-secondary)", mb: 1.5 }}>
              {user?.email || formData.email}
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "rgba(59, 130, 246, 0.12)",
                px: 2,
                py: 0.75,
                borderRadius: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#1e40af", textTransform: "capitalize" }}>
                {formData.role}
              </Typography>
            </Box>
          </Box>
          {!isEditing && (
            <IconButton
              onClick={() => {
                // populate form data when entering edit mode
                setFormData({
                  firstName: user?.firstName || "",
                  lastName: user?.lastName || "",
                  email: user?.email || "",
                  phone: user?.phone || "",
                  address: user?.address || "",
                  city: user?.city || "",
                  postalCode: user?.postalCode || "",
                  role: user?.role || "user",
                });
                setIsEditing(true);
              }}
              sx={{
                bgcolor: "var(--color-primary)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(59, 130, 246, 0.9)" },
              }}
            >
              <MdEdit size={20} />
            </IconButton>
          )}
        </Stack>

        {/* Profile Form */}
        {isEditing ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                disabled
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <CustomButton onClick={handleSaveChanges} label="Save Changes" sx={{}} />
                <CustomButton
                  onClick={() => setIsEditing(false)}
                  label="Cancel"
                  sx={{
                    bgcolor: "var(--bg-page)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    "&:hover": { bgcolor: "var(--bg-surface)" },
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Box>
            {/* Contact Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
                <MdEmail size={20} />
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <MdEmail size={24} style={{ color: "var(--color-primary)" }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                        Email
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {user?.email || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <MdPhone size={24} style={{ color: "var(--color-primary)" }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                        Phone
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {user?.phone || 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <MdLocationOn size={24} style={{ color: "var(--color-primary)" }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                        Address
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {user?.address || 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <MdLocationOn size={24} style={{ color: "var(--color-primary)" }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                        City
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {user?.city || 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Account Information Section */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
                <MdDomain size={20} />
                Account Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(107, 114, 128, 0.05)" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                      First Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
                      {user?.firstName || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(107, 114, 128, 0.05)" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                      Last Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
                      {user?.lastName || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(107, 114, 128, 0.05)" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                      Postal Code
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
                      {user?.postalCode || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(107, 114, 128, 0.05)" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                      Role
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500, textTransform: "capitalize" }}>
                        {user?.role == "user" && (user?.role || 'User')}
                      {user?.role === 'admin' && <Chip icon={<MdVerified />} label="admin" size="small" sx={{ bgcolor: "#dbeafe", color: "#0369a1" }} />}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: user?.isActive ? "rgba(34, 197, 94, 0.05)" : "rgba(239, 68, 68, 0.05)" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                      Account Status
                    </Typography>
                    <Chip
                      label={user?.isActive ? 'Active' : 'Blocked'}
                      icon={user?.isActive ? <MdVerified /> : undefined}
                      size="small"
                      sx={{
                        bgcolor: user?.isActive ? "#dcfce7" : "#fee2e2",
                        color: user?.isActive ? "#166534" : "#991b1b",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(107, 114, 128, 0.05)" }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-secondary)", display: "block", mb: 0.5 }}>
                      Member Since
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-primary)", fontWeight: 500 }}>
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Account Actions */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2.5,
          bgcolor: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <MdLock size={20} />
          Security & Actions
        </Typography>
        <Divider sx={{ mb: 2.5 }} />
        <Stack direction="column" spacing={2}>
          <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
                <MdLock size={20} style={{ color: "var(--color-primary)" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  Change Password
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", ml: 4.5 }}>
                Update your password to keep your account secure
              </Typography>
            </Box>
            <CustomButton
              onClick={() => setOpenPasswordDialog(true)}
              label="Change"
              sx={{
                bgcolor: "var(--color-primary)",
                color: "#fff",
                padding: "6px 16px",
                fontSize: 12,
                "&:hover": { bgcolor: "rgba(59, 130, 246, 0.9)" },
              }}
            />
          </Box>

          <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
                <MdLogout size={20} style={{ color: "#dc2626" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  Logout
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", ml: 4.5 }}>
                Sign out from your account
              </Typography>
            </Box>
            <CustomButton
              onClick={handleLogout}
              label="Logout"
              sx={{
                bgcolor: "#fee2e2",
                color: "#dc2626",
                padding: "6px 16px",
                fontSize: 12,
                border: "1px solid #fecaca",
                "&:hover": { bgcolor: "#fecaca" },
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "var(--text-primary)" }}>
          Change Password
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Old Password"
              name="oldPassword"
              type={showPasswords.oldPassword ? "text" : "password"}
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => togglePasswordVisibility("oldPassword")}>
                      {showPasswords.oldPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showPasswords.newPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => togglePasswordVisibility("newPassword")}>
                      {showPasswords.newPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPasswords.confirmPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => togglePasswordVisibility("confirmPassword")}>
                      {showPasswords.confirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <CustomButton
            onClick={() => setOpenPasswordDialog(false)}
            label="Cancel"
            sx={{
              bgcolor: "var(--bg-page)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              "&:hover": { bgcolor: "var(--bg-surface)" },
            }}
          />
          <CustomButton
            onClick={handleSavePassword}
            label="Save"
            sx={{
              bgcolor: "var(--color-primary)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(59, 130, 246, 0.9)" },
            }}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
