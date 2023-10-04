import { allowedOrigins, allowedOriginPatterns } from "./AllowedOrigins";
import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const isAllowedOrigin = !origin || allowedOrigins.indexOf(origin) !== -1;
    const matchesPattern =
      origin && allowedOriginPatterns.some((pattern) => pattern.test(origin));

    if (isAllowedOrigin || matchesPattern) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} Is Not allowed by CORS`));
    }
  },

  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
