async function register(data) {

    const email =
        data.email.trim().toLowerCase();

    const existingUser =
        await prisma.user.findUnique({
            where: { email }
        });

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const passwordHash =
        await hashPassword(data.password);

    await prisma.$transaction(async (tx) => {

        const user =
            await tx.user.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email
                }
            });

        await tx.authCredential.create({
            data: {
                userId: user.id,
                passwordHash
            }
        });

    });

    return {
        success: true,
        message:
            "Registration successful. Please verify your email."
    };

}