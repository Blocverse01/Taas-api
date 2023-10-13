import express from "express";
import ProjectController from "./ProjectController";
import { validateRequestInput } from "../Resources/middleware/ValidateSchema";
import { GetAllProjectAssetsSchema, getProjectDetailsSchema } from "./ProjectSchema";
import { validateApiKey } from "../Resources/middleware/ValidateApiKey";

const projectRouter = express.Router();

projectRouter.get("/:projectId",
    validateApiKey,
    validateRequestInput(getProjectDetailsSchema),
    ProjectController.getProjectDetails)

projectRouter.get(
    "/:projectId/assets",
    validateApiKey,
    validateRequestInput(GetAllProjectAssetsSchema),
    ProjectController.getAllProjectAssets
);

export default projectRouter;
