import { allowedOrigins, allowedOriginPatterns } from "./constants/AllowedOrigins";
import { CorsOptions } from "cors";
import { OK } from "./constants/statusCodes";

const MINUS_ONE_INDEX = -1;

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const isAllowedOrigin =
      !origin || allowedOrigins.indexOf(origin) !== MINUS_ONE_INDEX;
    const matchesPattern =
      origin && allowedOriginPatterns.some((pattern) => pattern.test(origin));

    if (isAllowedOrigin || matchesPattern) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} Is Not allowed by CORS`));
    }
  },

  optionsSuccessStatus: OK,
  credentials: true,
};

export default corsOptions;
