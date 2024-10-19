import { Box, Typography } from "@mui/material";
import img from "@/assets/signup/signup.svg";
import Image from "next/image";
import SignUpForm from "@/components/ui/SignupUI";

const SignUp = () => {
    return (
        <Box className="py-10 flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-10 xl:gap-20">
            <SignUpForm />
            <Image className="hidden lg:flex lg:w-[300px] xl:w-[400px]" src={img} height={250} width={250} alt="Signup Image" />
        </Box>
    );
};

export default SignUp;

export function generateMetadata() {
    return {
        title: "Sign Up - WedPlan BD",
        description: "Create your account on WedPlan BD to start planning your dream wedding effortlessly. Join us to access exclusive services, connect with trusted vendors, and manage your wedding details all in one place."
    }
}