import express from "express";
import dotenv from "dotenv";
dotenv.config(); // load env variables as early as possible
import cors from "cors";
import { OK } from "./Resources/constants/statusCodes";
import corsOptions from "./Resources/CorsOption";
import appRouter from "./routes";

const app = express();

const corsRoutes = ["/auth/create-api-key"];

// Middleware function to apply CORS to specific routes
const corsMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (corsRoutes.includes(req.path)) {
    cors(corsOptions)(req, res, next); // Apply CORS middleware for specific routes
  } else {
    next(); // Pass control to the next middleware for other routes
  }
};

// Use the CORS middleware for the specified routes
app.use(corsMiddleware);

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());

//routes
app.use(appRouter);

app.get("/", (_, res) => {
  res.status(OK).send(`TAAS API is up 🚀`);
});

app.all("*", (_, res) => {
  res.status(404).json({
    message: "Invalid Api Endpoint",
  });
});

export default app;
