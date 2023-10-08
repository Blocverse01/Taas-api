import express from "express";
import ApiAuthController from "./ApiAuthController";
import { validateRequestInput } from "../Resources/middleware/ValidateSchema";
import { CreateApiKeySchema } from "./ApiAuthSchema";
import { validateApiKey } from "../Resources/middleware/ValidateApiKey";
import { OK } from "../Resources/constants/statusCodes";

const apiAuthRouter = express.Router();

apiAuthRouter
  .post("/create-api-key", validateRequestInput(CreateApiKeySchema), ApiAuthController.createApiKey)
  .get("/test-api-key-middleware", validateApiKey, (req, res) => {
    res.status(OK).json({ user: req.authorizedUser });
  });

export default apiAuthRouter;
