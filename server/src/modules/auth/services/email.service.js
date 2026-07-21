export async function sendVerificationEmail({
    email,
    firstName,
    otp,
}) {
    console.log("=================================");
    console.log("EMAIL VERIFICATION");
    console.log("To:", email);
    console.log("Hello,", firstName);
    console.log("Your verification code is:", otp);
    console.log("=================================");
}