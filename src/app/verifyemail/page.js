import Footer from "@/components/sharedUI/Footer";
import EmailVerification from "@/components/ui/EmailVerification";
import { Box } from "@mui/material";

const VerifyEmail = () => {
    return (
        <Box className="min-h-[70vh]">
            <EmailVerification />
            <Footer />
        </Box>
    );
};

export default VerifyEmail;

export function generateMetadata() {
    return {
        title: "Verify Email - WedPlan BD",
        description: "Verify your email address to complete your registration on WedPlan BD. This step ensures the security of your account and allows you to access all our wedding planning services."
    }
}