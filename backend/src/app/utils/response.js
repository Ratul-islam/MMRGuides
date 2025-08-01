export const successResponse = (res, status, payload) => {
  res.status(status).json({
    success: true,
    message: payload.message,
    data: payload.data,
  });
};

export const errorResponse = (res, status, message, extra = {}) => {
  res.status(status).json({
    success: false,
    message,
    error: extra.error || null,
  });
};
