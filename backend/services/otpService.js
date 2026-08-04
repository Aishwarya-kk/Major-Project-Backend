const OTP = require("../models/OTP");

const generateOTP = require("../utils/generateOTP");

const sendOTPEmail = require("./emailService");

const sendOTPPhone = require("./smsService");
/**
 * Generate and Send OTP
 * @param {string} email
 */

const createAndSendOTP = async (email,phone) => {
    try {

        // Generate 6-digit OTP
        const otp = generateOTP();

        // OTP expires in 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);


        // Delete old OTP if exists
        await OTP.deleteMany({ email });


        // Save new OTP
        const newOTP = new OTP({
            email,
            otp,
            expiresAt,
        });


        await newOTP.save();


        // Send OTP Email
        // Send OTP to Email
await sendOTPEmail(email, otp);


// Send OTP to Phone
await sendOTPPhone(phone, otp);


        return {
            success: true,
            message: "OTP sent successfully.",
        };


    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Failed to send OTP.",
        };
    }
};


/**
 * Verify OTP
 * @param {string} email
 * @param {string} enteredOTP
 */

const verifyOTP = async (email, enteredOTP) => {

    try {

        const otpData = await OTP.findOne({ email });


        if (!otpData) {
            return {
                success: false,
                message: "OTP not found."
            };
        }


        // Check Expiry
        if (otpData.expiresAt < new Date()) {

            await OTP.deleteOne({ _id: otpData._id });

            return {
                success: false,
                message: "OTP has expired."
            };
        }


        // Check OTP
        if (otpData.otp !== enteredOTP) {

            return {
                success: false,
                message: "Invalid OTP."
            };
        }


        // Mark as Verified
        otpData.isVerified = true;

        await otpData.save();


        return {
            success: true,
            message: "OTP verified successfully."
        };


    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "OTP verification failed."
        };
    }
};


module.exports = {
    createAndSendOTP,
    verifyOTP
};