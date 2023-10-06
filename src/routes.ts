import express from "express";
import apiAuthRouter from "./ApiAuth/ApiAuthRoutes";

const appRouter = express.Router();

appRouter.use("/auth", apiAuthRouter);
// Todo: Add other routes

export default appRouter;
