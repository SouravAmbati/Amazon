import { ZodError } from "zod";

export function validate(schema) {
    return async (req, res, next) => {

        try {

            req.validated = await schema.parseAsync(req.body);

            next();

        } catch (error) {

            if (error instanceof ZodError) {

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                });

            }

            next(error);

        }

    };
}