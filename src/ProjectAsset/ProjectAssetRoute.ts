import express from "express";
import ProjectAssetController from "./ProjectAssetController";
import { validateApiKey } from "../Resources/middleware/ValidateApiKey";
import { validateRequestInput } from "../Resources/middleware/ValidateSchema";
import { GetProjectAssetSchema } from "./ProjectAssetSchema";

const projectAssetRouter = express.Router();

projectAssetRouter.get(
  "/:assetId",
  validateApiKey,
  validateRequestInput(GetProjectAssetSchema),
  ProjectAssetController.getProjectAsset
);

export default projectAssetRouter;
