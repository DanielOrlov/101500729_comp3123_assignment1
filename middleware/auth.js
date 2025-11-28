const jwt = require("jsonwebtoken");

function auth(required = true) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";
      let token = null;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }

      if (!token) {
        if (!required) return next(); // allow anonymous access if not required
        return res.status(401).json({ status: false, message: "No token provided" });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          console.error(err);
          return res.status(401).json({ status: false, message: "Invalid token" });
        }

        // Attach user info from token to request
        req.user = payload; // e.g. { id: "123", role: "admin" }
        next();
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: "Auth error" });
    }
  };
}

module.exports = auth;
