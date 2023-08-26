module.exports = env => {
  const isEnv = env === 'production';
  const url = isEnv && process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:5000';
  return {
    api: {
      url
    }
  };
};
