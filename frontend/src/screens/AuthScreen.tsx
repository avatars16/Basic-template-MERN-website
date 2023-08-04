import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, TextField, IconButton, InputAdornment, Typography, Snackbar, Alert, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setCredentials } from "../slices/authSlice";
import { useRegisterMutation, useLoginMutation } from "../slices/usersApiSlice";
import FormContainer from "../components/FormContainer";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import GoogleAuth from "../components/GoogleAuth";

interface Props {
    isSignUp: Boolean;
}

const AuthScreen = ({ isSignUp }: Props) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
    });
    const [passwordsMatch, setPasswordMatch] = useState(true);
    const [formFeedback, setFormFeedback] = useState({ open: false, errorMessage: "" });
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleTogglePasswordVisibility = () => {
        if (formData.showConfirmPassword && !formData.showPassword) return;
        setFormData((prevFormData) => ({
            ...prevFormData,
            showPassword: !prevFormData.showPassword,
        }));
    };

    const handleToggleConfirmPasswordVisibility = () => {
        if (!formData.showConfirmPassword && formData.showPassword) return;
        setFormData((prevFormData) => ({
            ...prevFormData,
            showConfirmPassword: !prevFormData.showConfirmPassword,
        }));
    };

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [register, registerProp] = useRegisterMutation();
    const [login, loginProp] = useLoginMutation();
    const { userInfo } = useAppSelector((state) => state.auth);
    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMatch(true);
        if (isSignUp && formData.password !== formData.confirmPassword) return setPasswordMatch(false);
        try {
            if (isSignUp) {
                const res = await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }).unwrap();

                dispatch(setCredentials({ ...res }));
            } else {
                const res = await login({ ...formData }).unwrap();
                dispatch(setCredentials({ ...res }));
            }
            navigate("/");
        } catch (err: any) {
            setFormFeedback({ open: true, errorMessage: err?.data?.message || err.error });
        }
    };
    return (
        <FormContainer>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {isSignUp ? "Register" : "Login"}
            </Typography>
            <form
                onSubmit={(e) => {
                    submitHandler(e);
                }}>
                {isSignUp && (
                    <TextField
                        variant="standard"
                        label="Name"
                        InputLabelProps={{ shrink: true }}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        margin="normal"
                        fullWidth
                        required={!!isSignUp}
                    />
                )}

                <TextField
                    variant="standard"
                    label="Email"
                    InputLabelProps={{ shrink: true }}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                    fullWidth
                    required
                />

                <TextField
                    variant="standard"
                    label="Password"
                    name="password"
                    type={formData.showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    margin="normal"
                    fullWidth
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleTogglePasswordVisibility}>
                                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {isSignUp && (
                    <TextField
                        variant="standard"
                        label="Confirm password"
                        name="confirmPassword"
                        type={formData.showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        margin="normal"
                        fullWidth
                        required={!!isSignUp}
                        error={!passwordsMatch}
                        helperText={!passwordsMatch && "Passwords don't match"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                                        {formData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                )}

                <Grid container spacing={1} sx={{ justifyContent: "end", mt: 2 }}>
                    <Grid xs={12} sm={6}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={registerProp.isLoading || loginProp.isLoading}
                            fullWidth>
                            {isSignUp ? "Register" : "Login"}
                        </Button>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <GoogleAuth />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Typography paragraph>
                        {isSignUp ? (
                            <>
                                Already have an account? <Link to="/login">Login here!</Link>
                            </>
                        ) : (
                            <>
                                Don't have an account? <Link to="/register">Register here!</Link>
                            </>
                        )}
                    </Typography>
                </Box>
            </form>
            <Snackbar open={formFeedback.open} autoHideDuration={6000}>
                <Alert severity="error">{formFeedback.errorMessage}</Alert>
            </Snackbar>
        </FormContainer>
    );
};

export default AuthScreen;