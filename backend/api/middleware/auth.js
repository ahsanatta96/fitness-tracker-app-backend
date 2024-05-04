const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Check it the user is authenticated or not
exports.auth = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Login first to access the resource" });
  }

  await jwt.verify(token, process.env.SECRET, async function (err, decoded) {
    if (err) {
      return res
        .status(401)
        .send({ message: "Login first to access the resource" });
    }
    if (decoded) {
      const user = await User.findById(decoded.id);

      if (user && user?.status === "inactive") {
        return res.status(400).send({ message: "User account not found." });
      }

      req.user = user._id;
      next();
    }
  });
};

exports.adminAuth = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Login first to access the resource" });
  }

  await jwt.verify(token, process.env.SECRET, async function (err, decoded) {
    if (err) {
      return res
        .status(401)
        .send({ message: "Login first to access the resource" });
    }
    if (decoded) {
      const user = await User.findById(decoded.id);

      if (user && user?.role !== "admin") {
        return res.status(400).send({ message: "Unauthorized Access!" });
      }

      req.user = user;
      next();
    }
  });
};
