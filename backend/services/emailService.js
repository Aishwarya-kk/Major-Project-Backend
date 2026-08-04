const nodemailer = require("nodemailer");

/**
 * Create Email Transporter
 */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


/**
 * Send OTP to Email
 * @param {string} email
 * @param {string} otp
 */

const sendOTPEmail = async (email, otp) => {
    try {

        const mailOptions = {
            from: `"Blockchain Voting System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP for Blockchain Voting Verification",

            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Blockchain Voting System</h2>

                    <p>Your One-Time Password (OTP) is:</p>

                    <h1 style="color:#2563eb;">${otp}</h1>

                    <p>This OTP is valid for <b>5 minutes</b>.</p>

                    <p>If you did not request this OTP, please ignore this email.</p>

                    <hr>

                    <p>Thank You</p>
                    <p>Blockchain Voting Team</p>
                </div>
            `,
        };


        await transporter.sendMail(mailOptions);

        console.log("✅ OTP Email Sent Successfully");


    } catch (error) {

        console.error("❌ Failed to Send OTP Email");
        console.error(error.message);

        throw error;
    }
};


module.exports = sendOTPEmail;