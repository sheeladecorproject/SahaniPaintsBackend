const errorMessage = {
    NOTFOUND: {
        status: 404,
        message: "Resource not found!"
    },
    LOGINERROR: {
        status: 401,
        message: "Invalid login credentials"
    },
    UNAUTHORIZED: {
        status: 403,
        message: "Forbidden!"
    },
    INVALIDDATA: {
        status: 400,
        message: "Please provide valid data"
    },
    EXISTS: {
        status: 409,
        message: "Resource already exists"
    },
    OUTOFSTOCK: {
        status: 400,
        message: "Product out of stock"
    },
    NOTBALANCE: {
        status: 400,
        message: "Not enough balance"
    },
    EXHAUSTED: {
        status: 400,
        message: "Retries exhausted"
    },
    ALREADYTAKEN: {
        status: 409,
        message: "The provided data is already taken"
    },
    IDEMPOTENCYKEYREUSED: {
        status: 400,
        message: "Idempotency key reused"
    }
};

export { errorMessage };
