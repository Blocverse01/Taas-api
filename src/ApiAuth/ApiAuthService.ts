import { randomBytes } from "crypto";
import { getXataClient } from "../xata";
import bcrypt from "bcrypt";
import { HttpException } from "../Resources/exceptions/HttpException";
import { BAD_REQUEST, UNAUTHORIZED } from "../Resources/constants/statusCodes";

const xata = getXataClient();
const API_KEY_SALT = process.env.API_KEY_SALT;

class ApiAuthService {
  private API_KEY_LENGTH = 16;

  private generateApiKey() {
    return randomBytes(this.API_KEY_LENGTH).toString("base64");
  }
  private hashApiKey(apiKey: string) {
    if (!API_KEY_SALT) throw Error("Add missing env variable: API_KEY_SALT");
    return bcrypt.hashSync(apiKey, API_KEY_SALT);
  }

  async createUserApiKey(userId: string) {
    const existingActiveApiKey = await xata.db.ApiKey.filter({
      "user.id": userId,
      isRevoked: false,
    }).getFirst();
    if (existingActiveApiKey) {
      await existingActiveApiKey.update({
        isRevoked: true,
      });
    }

    const newApiKey = this.generateApiKey();
    await xata.db.ApiKey.create({
      apiKey: this.hashApiKey(newApiKey),
      user: userId,
    });

    return newApiKey;
  }

  async validateApiKey(apiKey: string) {
    if (apiKey.trim() === "")
      throw new HttpException(BAD_REQUEST, "API key cannot be an empty string");

    const hashedApiKey = this.hashApiKey(apiKey);
    const existingApiKey = await xata.db.ApiKey.filter(
      "apiKey",
      hashedApiKey
    ).getFirst();

    if (!existingApiKey) throw new HttpException(UNAUTHORIZED, "Invalid API key");
    if (existingApiKey.isRevoked)
      throw new HttpException(UNAUTHORIZED, "API key is revoked");
    if (!existingApiKey.user)
      throw new HttpException(UNAUTHORIZED, "API key has no user relation");

    const authorizedUser = await existingApiKey.user.read();

    if (!authorizedUser) throw new HttpException(UNAUTHORIZED, "Invalid user relation");

    return {
      authorizedUser: {
        id: authorizedUser.id,
        email: authorizedUser.email!,
        walletAddress: authorizedUser.walletAddress,
      },
    };
  }
}

export default new ApiAuthService();
