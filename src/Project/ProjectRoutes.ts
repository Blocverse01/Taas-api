import express from "express";
import ProjectController from "./ProjectController";
import { validateRequestInput } from "../Resources/middleware/ValidateSchema";
import { getProjectDetailsSchema } from "./ProjectSchema";
import { validateApiKey } from "../Resources/middleware/ValidateApiKey";

const projectRouter = express.Router();

projectRouter
    .get("/:projectId/:userId", validateApiKey, validateRequestInput(getProjectDetailsSchema), ProjectController.getProjectDetails)

export default projectRouter;
