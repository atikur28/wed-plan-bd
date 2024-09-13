import { Box, Typography } from "@mui/material";
import img from "@/assets/signup/signup.svg";
import Image from "next/image";
import SignInForm from "@/components/ui/SignInUI";

const SignIn = () => {
    return (
        <Box className="py-10 flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-10 xl:gap-20">
            <SignInForm />
            <Image className="hidden lg:flex lg:w-[300px] xl:w-[400px]" src={img} height={250} width={250} alt="Signup Image" />
        </Box>
    );
};

export default SignIn;