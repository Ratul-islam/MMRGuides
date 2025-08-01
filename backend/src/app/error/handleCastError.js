const handleCastError = (err) => {
  const errorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;