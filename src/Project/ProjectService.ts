import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../Resources/constants/statusCodes";
import { getXataClient } from "../xata";
import { HttpException } from "../Resources/exceptions/HttpException";

const supportedAssetTypes = ["real estate"] as const;

type AssetType = (typeof supportedAssetTypes)[number];

const xata = getXataClient();

class ProjectService {

    async getProjectDetails(projectId: string, userId: string) {

        const record = await xata.db.Project
            .filter({ "id": projectId, "owner.id": userId })
            .select(["assetController", "assetType", "web3Environment",
                "treasuryWallet", "enabledPaymentMethods.*", "owner.walletAddress", "xata.createdAt"])
            .getFirst();

        if (!record) throw new HttpException(NOT_FOUND, "Project Not Found");

        return record;
    }

    async getProjectAssets(projectId: string, authUserId: string) {

        const validProject = await xata.db.Project.filter({
            id: projectId,
            "owner.id": authUserId,
        }).getFirst();

        if (!validProject) throw new HttpException(NOT_FOUND, "Project not found");

        const projectAssetType = validProject.assetType as AssetType;

        if (!supportedAssetTypes.includes(projectAssetType))
            throw new HttpException(BAD_REQUEST, "Asset Type Not supported yet");

        const property = await xata.db.TokenizedProperty.filter({
            "project.id": projectId
        }).select(["tokenAddress", "tokenPrice", "tokenTicker", "description", "location", "size", "photos", "project.assetType", {
            "name": "<-AssetDocument.property",
            "as": "documents",
            "columns": ["fileType", "fileURI", "fileSize", "label"],
        }]).getAll();

        // Map and transform the data
        const transformedData: any = property.map(item => ({
            id: item.id,
            description: item.description,
            location: item.location,
            size: item.size,
            assetType: item?.project?.assetType,
            tokenAddress: item.tokenAddress,
            tokenPrice: item.tokenPrice,
            tokenTicker: item.tokenTicker,
            documents: item.documents.records.map(record => ({
                id: record.id,
                fileSize: record.fileSize,
                fileType: record.fileType,
                fileURI: record.fileURI,
                label: record.label,
            })),
            media: item.photos!.map((photo) => ({
                type: "image",
                fileURI: photo,
            }))
        }));

        return transformedData;
    }
}
export default new ProjectService();
