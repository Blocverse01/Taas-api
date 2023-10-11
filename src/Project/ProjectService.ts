import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../Resources/constants/statusCodes";
import { getXataClient } from "../xata";
import { HttpException } from "../Resources/exceptions/HttpException";
const xata = getXataClient();

class ProjectService {

    async getProjectDetails(projectId: string) {

        const record = await xata.db.Project
            .filter({ "id": projectId })
            .select(["assetController", "assetType", "web3Environment",
                "treasuryWallet", "enabledPaymentMethods.*", "owner.walletAddress", "xata.createdAt"])
            .getFirst();

        if (!record) throw new HttpException(NOT_FOUND, "Project Not Found");

        return record;
    }
}
export default new ProjectService();
