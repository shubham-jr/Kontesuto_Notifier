module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log({
    status: err.status,
    message: err.message,
  });
  res.status(res.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
