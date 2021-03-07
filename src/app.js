import Boom from "@hapi/boom";
import compression from "compression";
import cors from "cors";
import express from "express";
import "express-async-errors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { GameRouter } from "./games/GameRouter";
import { authorizationErrorHandler } from "./utils/authorizationErrorHandler";
import { bodyParserErrorHandler } from "./utils/bodyParserErrorHandler";
import { errorHandler } from "./utils/errorHandler";
import { jwtCheck } from "./utils/jwtCheck";
import { notFoundHandler } from "./utils/notFoundHandler";
import { validationErrorHandler } from "./utils/validationErrorHandler";

const app = express();

/* istanbul ignore next */
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  // These middlewares are added for development purposes.
  // Depending on the use case, you can move these middleware outside of this `if` block or
  // you can edit your HTTP server (e.g.: Apache, NGINX, etc.) to handle the following cases:

  // Log HTTP requests
  app.use(morgan("dev"));
}

// Add security headers to every requests.
app.use(helmet());

// Add gzip compression.
app.use(compression());

// Add CORS headers.
app.use(cors());

// Allow express to parse JSON bodies.
app.use(express.json());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.enable("trust proxy");

// Limit request rate on API, `windowMs` and `max` can be adjusted to match the desired rate.
// see https://github.com/nfriedly/express-rate-limit for more information
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5000, // 5000 requests can be executed during the `windowMs` time window
    message: Boom.tooManyRequests("Too many requests, please try again later.").output.payload,
  })
);

app.use(jwtCheck);

// Our application routes:
app.use("/v1/games", GameRouter);

// Handle requests matching no routes.
app.use(notFoundHandler);

// Handle unauthorized requests.
app.use(authorizationErrorHandler);

// Handle body parser syntax errors
app.use(bodyParserErrorHandler);

// Add validation error information
app.use(validationErrorHandler);

// Handle errors passed using `next(error)`.
app.use(errorHandler);

export default app;
