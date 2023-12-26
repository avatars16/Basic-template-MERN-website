import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Typography, Box, Button } from "@mui/material";
import FormContainer from "../../../components/forms/FormContainer";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import TranslateText from "../../../components/shared/TranslateText";
import PasswordInput from "../../../components/inputs/PasswordInput";
import useAuth from "../../../hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserLogin, userLoginSchema } from "../../../../../backend/types/schemas/User.schema";
import { snackbarContext } from "../../../services/providers/Snackbar.provider";
import { handleFormErrors } from "../../../utils/handle-form-errors";
import PrimaryButton from "../../UI/buttons/PrimaryButton";

const AuthScreen = () => {
    const { loginUser, userInfo } = useAuth();
    const { setSnackbarContext } = useContext(snackbarContext);
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UserLogin>({
        mode: "onChange",
        resolver: zodResolver(userLoginSchema),
    });

    useEffect(() => {
        if (userInfo) navigate("/");
    }, [navigate, userInfo]);

    const submitHandler = async (data: UserLogin) => {
        console.log(data);
        try {
            await loginUser.mutateAsync(data);
            navigate("/");
        } catch (error: unknown) {
            handleFormErrors<UserLogin>(error, setError, setSnackbarContext);
        }
    };

    return (
        <FormContainer formProps={{ onSubmit: handleSubmit(submitHandler) }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                <TranslateText tKey={"authPage:login"} />
            </Typography>
            <Controller
                name="email"
                control={control}
                render={({ field: { ref, ...field } }) => (
                    <TextField
                        autoFocus
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        label={<TranslateText tKey="email" params={{ ns: "input" }} />}
                        type="email"
                        margin="normal"
                        fullWidth
                        required
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        {...field}
                    />
                )}
            />
            <Controller
                name="password"
                control={control}
                render={({ field: { ref, ...field } }) => (
                    <PasswordInput
                        label={<TranslateText tKey="password" params={{ ns: "input" }} />}
                        changeVisibility={true}
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                        {...field}
                    />
                )}
            />
            <Grid container spacing={1} sx={{ justifyContent: "end", mt: 2 }}>
                <Grid xs={12} sm={6}>
                    <PrimaryButton buttonProps={{ type: "submit" }} tKey="authPage:login" loading={false} />
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                <Typography paragraph>
                    <TranslateText tKey="noAccount" params={{ ns: "authPage" }} />{" "}
                    <Link to="/register">
                        <TranslateText tKey="registerHere" params={{ ns: "authPage" }} />!
                    </Link>
                </Typography>
            </Box>
        </FormContainer>
    );
};

export default AuthScreen;