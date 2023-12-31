import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormContainer from "../../../components/forms/FormContainer";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import TranslateText from "../../../components/shared/TranslateText";
import PasswordInput from "../../../components/inputs/PasswordInput";
import useAuth from "../../../hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    UserCreateOrUpdateClient,
    userCreateOrUpdateClientSchema,
} from "../../../../../shared/types/schemas/user.schema";
import { snackbarContext } from "../../../services/providers/Snackbar.provider";
import { handleFormErrors } from "../../../utils/handle-form-errors";
import PrimaryButton from "../../UI/buttons/PrimaryButton";
import { ErrorResponse } from "../../../../../shared/types/responses/error-response";

const RegisterUserForm = () => {
    const { registerUser, userInfo } = useAuth();
    const { setSnackbarContext } = useContext(snackbarContext);
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UserCreateOrUpdateClient>({
        mode: "onChange",
        resolver: zodResolver(userCreateOrUpdateClientSchema),
    });

    useEffect(() => {
        if (userInfo) navigate("/");
    }, [navigate, userInfo]);

    const submitHandler = async (data: UserCreateOrUpdateClient) => {
        console.log(data);
        try {
            await registerUser.mutateAsync(data);
            navigate("/");
        } catch (error: unknown) {
            const API_ERROR = error as unknown as ErrorResponse;
            handleFormErrors<UserCreateOrUpdateClient>(API_ERROR, setError, setSnackbarContext);
        }
    };

    return (
        <FormContainer formProps={{ onSubmit: handleSubmit(submitHandler) }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                <TranslateText tKey={"authPage:register"} />
            </Typography>
            <Controller
                name="name"
                control={control}
                defaultValue={""}
                render={({ field: { ref, ...field } }) => (
                    <TextField
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        label={<TranslateText tKey="input:name" />}
                        margin="normal"
                        fullWidth
                        required
                        autoFocus
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                        {...field}
                    />
                )}
            />
            <Controller
                name="email"
                control={control}
                defaultValue={""}
                render={({ field: { ref, ...field } }) => (
                    <TextField
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        label={<TranslateText tKey="input:email" />}
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
                defaultValue={""}
                render={({ field: { ref, ...field } }) => (
                    <PasswordInput
                        label={<TranslateText tKey="input:password" />}
                        changeVisibility={true}
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                        {...field}
                    />
                )}
            />
            <Controller
                name="confirmPassword"
                control={control}
                defaultValue={""}
                render={({ field: { ref, ...field } }) => (
                    <PasswordInput
                        label={<TranslateText tKey="input:confirmPassword" />}
                        changeVisibility={false}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword?.message}
                        {...field}
                    />
                )}
            />
            <Grid container spacing={1} sx={{ justifyContent: "end", mt: 2 }}>
                <Grid xs={12} sm={6}>
                    <PrimaryButton
                        buttonProps={{ type: "submit" }}
                        tKey="authPage:register"
                        loading={registerUser.isPending}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
                <Typography paragraph>
                    <TranslateText tKey="authPage:alreadyAccount" />{" "}
                    <Link to="/login">
                        <TranslateText tKey="authPage:loginHere" />!
                    </Link>
                </Typography>
            </Box>
        </FormContainer>
    );
};

export default RegisterUserForm;
