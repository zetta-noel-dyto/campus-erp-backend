// *************** QUERY ***************
const resolver = {
  Query: {
    ping: () => {
      return 'pong';
    },
  },
};

// *************** EXPORT MODULE ***************
export { resolver };
