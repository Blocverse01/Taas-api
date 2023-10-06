import { Request, Response } from "express";
import { CreateApiKeySchemaType } from "./ApiAuthSchema";
import ApiAuthService from "./ApiAuthService";
import { INTERNAL_SERVER_ERROR, OK } from "../Resources/constants/statusCodes";

class ApiAuthController {
  async createApiKey(
    req: Request<{}, {}, CreateApiKeySchemaType["body"]>,
    res: Response
  ) {
    try {
      const { userId } = req.body;
      const newApiKey = await ApiAuthService.createUserApiKey(userId);

      res.status(OK).json({ apiKey: newApiKey });
    } catch (error: any) {
      return res
        .status(error?.status ?? error?.response?.status ?? INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}

export default new ApiAuthController();
