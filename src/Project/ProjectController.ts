import { Request, Response } from "express";
import { ProjectSchemaType } from "./ProjectSchema";
import ProjectService from "./ProjectService";
import { INTERNAL_SERVER_ERROR, OK } from "../Resources/constants/statusCodes";

class ProjectController {

    async getProjectDetails(req: Request<ProjectSchemaType["params"]>, res: Response) {
        try {
            const { projectId } = req.params;

            const { authorizedUser: { id: userId } } = req.body;

            const record = await ProjectService.getProjectDetails(projectId, userId);

            res.status(OK).json({ data: record });
        } catch (error: any) {
            return res
                .status(error?.status ?? error?.response?.status ?? INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    }

}
export default new ProjectController();