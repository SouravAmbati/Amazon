export function productConcurrencyLimiter(req, res, next) {
    let activeRequests=0;
    let MAX_CONCURRENT=20;
    if (activeRequests >= MAX_CONCURRENT) {
        return res.status(503).json({
            success: false,
            message: "Server is currently busy.",
        });
    }

    activeRequests++;

    const release = () => {
        activeRequests--;

        res.removeListener("finish", release);
        res.removeListener("close", release);
    };

    res.once("finish", release);
    res.once("close", release);

    next();
}