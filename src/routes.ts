import express from "express";
import apiAuthRouter from "./ApiAuth/ApiAuthRoutes";
import projectRouter from "./Project/ProjectRoutes";

const appRouter = express.Router();

appRouter.use("/auth", apiAuthRouter);
appRouter.use("/projects", projectRouter);
// Todo: Add other routes

export default appRouter;
