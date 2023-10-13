import { Request, Response } from "express";
import type { GetProjectAssetSchemaType } from "./ProjectAssetSchema";
import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "../Resources/constants/statusCodes";
import ProjectAssetService from "./ProjectAssetService";
import { HttpException } from "../Resources/exceptions/HttpException";

class ProjectAssetController {
  async getProjectAsset(req: Request<GetProjectAssetSchemaType["params"]>, res: Response) {
    try {
      const { assetId } = req.params;
      const authorizedUser = req.authorizedUser;

      if (!authorizedUser) throw new HttpException(UNAUTHORIZED, "Unauthorized");

      const asset = await ProjectAssetService.getProjectAssetById(authorizedUser.id, authorizedUser.projectId, assetId);

      res.status(OK).json({ data: asset });
    } catch (error: any) {
      return res
        .status(error?.status ?? error?.response?.status ?? INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}

export default new ProjectAssetController();
