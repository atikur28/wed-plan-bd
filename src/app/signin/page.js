import { Box } from "@mui/material";
import img from "@/assets/signup/signup.svg";
import Image from "next/image";
import SignInForm from "@/components/ui/SignInUI";
import Footer from "@/components/sharedUI/Footer";

const SignIn = () => {
    return (
        <>
        <Box className="py-10 flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-10 xl:gap-20 min-h-[70vh]">
            <SignInForm />
            <Image className="hidden lg:flex lg:w-[300px] xl:w-[400px]" src={img} height={250} width={250} alt="Signup Image" />
        </Box>
        <Footer />
        </>
    );
};

export default SignIn;

export function generateMetadata() {
    return {
        title: "Sign In - WedPlan BD",
        description: "Sign in to WedPlan BD to access your personalized wedding planning dashboard, manage your bookings, and connect with top vendors for your special day."
    }
}