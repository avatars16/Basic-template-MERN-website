import Header from "./components/shared/Header";
import InstallPwaPrompt from "./components/InstallPwaPrompt";
import { Outlet } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import CheckLocaleChange from "./components/CheckLocale";

const App = () => {
    return (
        <>
            <CssBaseline />
            <Header />
            <main>
                <Container maxWidth="md" sx={{ mt: 5 }}>
                    <Outlet /> {/* Puts the element passed in the router inside of this element */}
                    <CheckLocaleChange />
                </Container>
            </main>
            <InstallPwaPrompt />
        </>
    );
};

export default App;
