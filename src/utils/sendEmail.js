import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

export const sendMail = async ({ email, emailType, userId }) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                    $set: {
                        verifyToken: hashedToken,
                        verifyTokenExpiry: Date.now() + 3600000
                    }
                }
            )
        }
        else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    $set: {
                        forgotPasswordToken: hashedToken,
                        forgotPasswordTokenExpiry: Date.now() + 3600000
                    }
                }
            )
        }

        const auth = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: "imposter45683@gmail.com",
                pass: "kbmmrhfrdqgrlius"
            }
        });

        const mailOptions = {
            from: 'imposter45683@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your account" : "Reset your Password",
            html: `<p>Click <a href="http://localhost:3012/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser.
                  <br> http://localhost:3012/verifyemail?token=${hashedToken}
                  </p>`,
        }

        const mailResponse = await auth.sendMail(mailOptions);

        return mailResponse;

    } catch (error) {
        throw new Error(error.message);
    }
}