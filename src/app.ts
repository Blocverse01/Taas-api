import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { OK } from "./Resources/constants/statusCodes";
import corsOptions from "./Resources/CorsOption";
dotenv.config();

const app = express();

// Todo: Replace with actual routes
const corsRoutes = ["/cors-route1", "/cors-route2"];

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
app.get("/", (_, res) => {
  res.status(OK).send(`TAAS API is up 🚀`);
});

app.all("*", (_, res) => {
  res.status(404).json({
    message: "Invalid Api Endpoint",
  });
});

export default app;
