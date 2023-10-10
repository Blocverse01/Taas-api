import express from "express";
import apiAuthRouter from "./ApiAuth/ApiAuthRoutes";
import projectAssetRouter from "./ProjectAsset/ProjectAssetRoute";

const appRouter = express.Router();

appRouter.use("/auth", apiAuthRouter);
appRouter.use("/assets", projectAssetRouter);
// Todo: Add other routes

export default appRouter;
