import jwt from "express-jwt";
import jwks from "jwks-rsa";

export const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://geoguessr-leaderboard.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://geoguessr-leaderboard-api.vercel.app/",
  issuer: "https://geoguessr-leaderboard.us.auth0.com/",
  algorithms: ["RS256"],
});
