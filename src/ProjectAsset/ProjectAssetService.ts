import { BAD_REQUEST, NOT_FOUND } from "../Resources/constants/statusCodes";
import { HttpException } from "../Resources/exceptions/HttpException";
import { AssetDocument, getXataClient } from "../xata";

const supportedAssetTypes = ["real estate"] as const;

type AssetType = (typeof supportedAssetTypes)[number];

interface TokenizedAsset {
  name: string;
  tokenAddress: string;
  tokenPrice: number;
  tokenTicker: string;
  description: string;
  media: Array<{
    type: string;
    fileURI: string;
  }>;
  documents: Array<Pick<AssetDocument, "fileType" | "fileSize" | "fileURI" | "label">>;
  type: AssetType;
}

interface TokenizedProperty extends TokenizedAsset {
  location: string;
  size: number;
}

const xata = getXataClient();

class AssetService {
  async getProjectAssetById(authUserId: string, projectId: string, assetId: string): Promise<TokenizedProperty> {
    if (!authUserId.trim() || !projectId.trim() || !assetId.trim()) {
      throw new HttpException(BAD_REQUEST, "Args cannot be empty string");
    }

    // Todo: Probably replace with function from project service
    const validProject = await xata.db.Project.filter({
      id: projectId,
      "owner.id": authUserId,
    }).getFirst();

    if (!validProject) throw new HttpException(NOT_FOUND, "Project not found");

    const projectAssetType = validProject.assetType as AssetType;

    // Todo: Replace with a better control statement when more asset types are supported

    if (!supportedAssetTypes.includes(projectAssetType))
      throw new HttpException(BAD_REQUEST, "Asset Type Not supported yet");

    // Since only real estate assets are supported at the moment, it's safe to do this, but, ideally a switch statement could be used to return an object that extends `TokenizedAsset`, based on the `projectAssetType`.

    const property = await xata.db.TokenizedProperty.filter({
      "project.id": projectId,
      id: assetId,
    }).getFirst();

    if (!property) throw new HttpException(NOT_FOUND, "Asset not found");

    const attachedDocuments = await xata.db.AssetDocument.filter({
      ownerId: property.id,
    }).getAll();

    // return an object that extends `TokenizedAsset`
    return {
      name: property.name,
      tokenAddress: property.tokenAddress,
      tokenPrice: property.tokenPrice,
      tokenTicker: property.tokenTicker,
      description: property.description,
      media: property.photos!.map((photo) => ({
        type: "image",
        fileURI: photo,
      })),
      documents: attachedDocuments.map((doc) => ({
        fileType: doc.fileType,
        fileURI: doc.fileURI,
        fileSize: doc.fileSize,
        label: doc.label,
      })),
      type: projectAssetType,
      location: property.location,
      size: property.size,
    };
  }
}

export default new AssetService();
