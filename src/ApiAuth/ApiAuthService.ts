import { randomBytes } from "crypto";
import { getXataClient } from "../xata";
import bcrypt from "bcrypt";
import { HttpException } from "../Resources/exceptions/HttpException";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "../Resources/constants/statusCodes";
import { API_KEY_SALT, API_KEY_LENGTH } from "../Resources/constants/env";

const xata = getXataClient();

class ApiAuthService {
  private generateApiKey() {
    return randomBytes(+API_KEY_LENGTH).toString("base64");
  }

  private hashApiKey(apiKey: string) {
    return bcrypt.hashSync(apiKey, API_KEY_SALT);
  }

  async createUserApiKey(userId: string, projectId: string) {
    const [trimmedUserId, trimmedProjectId] = [userId.trim(), projectId.trim()];

    if (!trimmedUserId || !trimmedProjectId) throw new HttpException(BAD_REQUEST, "Args cannot be empty string");

    // check that project exists and user owns project
    const validProject = await xata.db.Project.filter({
      "owner.id": trimmedUserId,
      id: trimmedProjectId,
    }).getFirst();

    if (!validProject) throw new HttpException(NOT_FOUND, "User/project pair not found");

    const existingActiveApiKey = await xata.db.ApiKey.filter({
      "user.id": trimmedUserId,
      "project.id": trimmedProjectId,
    }).getFirst();

    if (existingActiveApiKey) {
      await existingActiveApiKey.delete();
    }

    const newApiKey = this.generateApiKey();

    await xata.db.ApiKey.create({
      apiKey: this.hashApiKey(newApiKey),
      user: trimmedUserId,
      project: trimmedProjectId,
    });

    return newApiKey;
  }

  async validateApiKey(apiKey: string) {
    if (!apiKey.trim()) throw new HttpException(BAD_REQUEST, "API key cannot be an empty string");

    const hashedApiKey = this.hashApiKey(apiKey);

    const existingApiKey = await xata.db.ApiKey.filter("apiKey", hashedApiKey)
      .select(["*", "project.owner.id", "project.id", "project.name"])
      .getFirst();

    if (!existingApiKey) throw new HttpException(UNAUTHORIZED, "Invalid API key");

    if (!existingApiKey.user) throw new HttpException(UNAUTHORIZED, "API key has no user relation");

    if (!existingApiKey.project) throw new HttpException(UNAUTHORIZED, "API key has no project relation");

    const authorizedUser = await existingApiKey.user.read();

    if (!authorizedUser) throw new HttpException(UNAUTHORIZED, "Invalid user relation");

    if (authorizedUser.id !== existingApiKey.project.owner!.id)
      throw new HttpException(UNAUTHORIZED, "Invalid API Key");

    return {
      authorizedUser: {
        id: authorizedUser.id,
        email: authorizedUser.email!,
        walletAddress: authorizedUser.walletAddress,
        projectId: existingApiKey.project.id,
      },
    };
  }
}

export default new ApiAuthService();
