import express from "express";
import ApiAuthController from "./ApiAuthController";
import { validateRequestInput } from "../Resources/middleware/ValidateSchema";
import { CreateApiKeySchema } from "./ApiAuthSchema";
import { validateApiKey } from "../Resources/middleware/ValidateApiKey";

const apiAuthRouter = express.Router();

apiAuthRouter.post(
  "/create-api-key",
  validateRequestInput(CreateApiKeySchema),
  ApiAuthController.createApiKey
);
apiAuthRouter.get("/test-api-key-middleware", validateApiKey, (req, res) => {
  res.status(200).json({ user: req.authorizedUser });
});

export default apiAuthRouter;
