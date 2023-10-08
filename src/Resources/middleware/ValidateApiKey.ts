import { Response, NextFunction, Request } from "express";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "../constants/statusCodes";
import ApiAuthService from "../../ApiAuth/ApiAuthService";

const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const providedApiKey = req.headers["taas-api-key"];

  if (!providedApiKey) {
    return res.status(UNAUTHORIZED).json({ message: "API key is missing" });
  }

  try {
    const { authorizedUser } = await ApiAuthService.validateApiKey(
      providedApiKey as string
    );

    req.authorizedUser = authorizedUser;

    return next();
  } catch (error: any) {
    return res
      .status(error?.status ?? error?.response?.status ?? INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export { validateApiKey };
