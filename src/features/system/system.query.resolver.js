// *************** QUERY ***************
const resolver = {
    Query: {
        ping: () => {
            // *************** Returns baseline validation response to verify Apollo Server functionality
            return "pong"
        }
    }
}

// *************** EXPORT MODULE ***************
export {
    resolver
}