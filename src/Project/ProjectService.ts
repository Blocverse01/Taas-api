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

    async getProjectAssets(projectId: string, authUserId: string, paginate: boolean, number_of_records: number, page_number: number) {

        const validProject = await xata.db.Project.filter({
            id: projectId,
            "owner.id": authUserId,
        }).getFirst();

        if (!validProject) throw new HttpException(NOT_FOUND, "Project not found");

        const projectAssetType = validProject.assetType as AssetType;

        if (!supportedAssetTypes.includes(projectAssetType))
            throw new HttpException(BAD_REQUEST, "Asset Type Not supported yet");

        let property: any = [];
        if (paginate === true) {
            const propertyData = await xata.db.TokenizedProperty.filter({
                "project.id": projectId
            }).select(["tokenAddress", "tokenPrice", "tokenTicker", "description", "location", "size", "photos", "project.assetType", {
                "name": "<-AssetDocument.property",
                "as": "documents",
                "columns": ["fileType", "fileURI", "fileSize", "label"],
            }]).getPaginated({
                pagination: { size: number_of_records, offset: page_number }
            });

            property = propertyData.records;

        } else {
            property = await xata.db.TokenizedProperty.filter({
                "project.id": projectId
            }).select(["tokenAddress", "tokenPrice", "tokenTicker", "description", "location", "size", "photos", "project.assetType", {
                "name": "<-AssetDocument.property",
                "as": "documents",
                "columns": ["fileType", "fileURI", "fileSize", "label"],
            }]).getAll();
        }

        const transformedData = property.map((item: any) => ({
            id: item.id,
            description: item.description,
            location: item.location,
            size: item.size,
            assetType: item?.project?.assetType,
            tokenAddress: item.tokenAddress,
            tokenPrice: item.tokenPrice,
            tokenTicker: item.tokenTicker,
            documents: item.documents.records.map((record: any) => ({
                id: record.id,
                fileSize: record.fileSize,
                fileType: record.fileType,
                fileURI: record.fileURI,
                label: record.label,
            })),
            media: !item.photos ? [] : item.photos.map((photo: any) => ({
                type: "image",
                fileURI: photo,
            }))
        }));

        return transformedData;
    }
}
export default new ProjectService();
