const { OK, ERROR } = require("../../../utils/responseHelper");

exports.uploadSingleFile = (req, res) => {
  try {
    const { file } = req;

    if (file) {
      const { key, location } = file;
      OK(res, { key, location }, "File uploaded successfully");
    } else {
      ERROR(res, null, "Something went wrong");
    }
  } catch (error) {
    ERROR(res, error, "Something went wrong");
  }
};
