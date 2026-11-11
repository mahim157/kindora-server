
const JWKS_URL =
  `${process.env.CLIENT_URL || "http://localhost:3000"}/api/auth/jwks`;

const AUTH_ISSUER =
  process.env.BETTER_AUTH_URL || "http://localhost:3000";

let josePromise;
let JWKS;

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing.",
      });
    }

    // Load jose dynamically (compatible with CommonJS projects)
    if (!josePromise) {
      josePromise = import("jose");
    }

    const { createRemoteJWKSet, jwtVerify } = await josePromise;

    if (!JWKS) {
      JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: AUTH_ISSUER,
      audience: AUTH_ISSUER,
    });

    if (!payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = authenticate;
