import "dotenv/config";

export const AdminLoginController = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Fill The Required Fields"
            });
        }

        if (
            email === process.env.ADMIN_EMAIL_ID &&
            password === process.env.ADMIN_PASSWORD
        ) {
            return res.status(200).json({
                success: true,
                message: "Login Successful"
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};