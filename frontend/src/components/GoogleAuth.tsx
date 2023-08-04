import { CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useAuthGoogleMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

const GoogleAuth = () => {
    var clientId: string = "286829291882-d5m5frt1qd9m16pjv0lho10aii043bin.apps.googleusercontent.com";

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const [googleAuth, { isLoading }] = useAuthGoogleMutation();
    const handleOnSucces = async (credentialResponse: CredentialResponse) => {
        try {
            const res = await googleAuth({ ...credentialResponse }).unwrap();
            console.log(res);
            dispatch(setCredentials({ ...res }));
            navigate("/");
        } catch (err: any) {
            console.log(err?.data?.message || err.error);
        }
    };
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={handleOnSucces}
                    onError={() => {
                        console.log("Login Failed");
                    }}
                    useOneTap
                    auto_select></GoogleLogin>
            </GoogleOAuthProvider>
        </>
    );
};

export default GoogleAuth;