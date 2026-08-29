const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.baseUrl}${req.path}`,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

module.exports = limiter;