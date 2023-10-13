import express from "express";
import apiAuthRouter from "./ApiAuth/ApiAuthRoutes";

import projectRouter from "./Project/ProjectRoutes";
import assetRouter from "./ProjectAsset/ProjectAssetRoute";

const appRouter = express.Router();

appRouter
    .use("/auth", apiAuthRouter)
    .use("/projects", projectRouter)
    .use("/assets", assetRouter);

// Todo: Add other routes

export default appRouter;
