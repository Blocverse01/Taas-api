import { Request, Response } from "express";
import { GetAllProjectAssetsSchemaType, ProjectSchemaType } from "./ProjectSchema";
import ProjectService from "./ProjectService";
import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "../Resources/constants/statusCodes";
import { HttpException } from "../Resources/exceptions/HttpException";

class ProjectController {

    async getProjectDetails(req: Request<ProjectSchemaType["params"]>, res: Response) {
        try {
            const { projectId } = req.params;

            const authorizedUser: any = req.authorizedUser;

            if (!authorizedUser) throw new HttpException(UNAUTHORIZED, "Unauthorized");

            const record = await ProjectService.getProjectDetails(projectId, authorizedUser.id);

            res.status(OK).json({ data: record });
        } catch (error: any) {
            return res
                .status(error?.status ?? error?.response?.status ?? INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }

    async getAllProjectAssets(req: Request<GetAllProjectAssetsSchemaType['params'], {}, GetAllProjectAssetsSchemaType['body']>, res: Response) {
        try {
            const { projectId } = req.params;
            const { paginate, number_of_records, page_number }: any = req.body;
            const authorizedUser: any = req.authorizedUser;

            if (!authorizedUser) throw new HttpException(UNAUTHORIZED, "Unauthorized");

            const assets = await ProjectService.getProjectAssets(projectId, authorizedUser.id, paginate!, number_of_records!, page_number!);

            return res.status(OK).json({ data: assets });

        } catch (error: any) {
            return res
                .status(error?.status ?? error?.response?.status ?? INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }

}
export default new ProjectController();
