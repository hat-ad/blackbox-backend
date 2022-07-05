exports.OK = (res, result, message = "", code = true) => {
  res.status(200).json({
    code,
    message: message || "",
    result: result || null,
  });
};

exports.ERROR = (res, result, message = "Error", code = false) => {
  res.status(200).json({
    code,
    message: message || "",
    result,
  });
};

exports.UNAUTHORIZED = (res, result, message = "Error", code = false) => {
  res.status(401).json({
    code,
    message: message || "",
    result,
  });
};

exports.BAD = (res, result, message = "Error", code = false) => {
  res.status(400).json({
    code,
    result,
    message: message || "",
  });
};

exports.UNKNOWN = (res, result, message = "Error", code = false) => {
  res.status(500).json({
    code,
    result,
    message: message || "",
  });
};
