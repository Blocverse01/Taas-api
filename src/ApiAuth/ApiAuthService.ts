import { randomBytes } from "crypto";
import { getXataClient } from "../xata";
import bcrypt from "bcrypt";
import { HttpException } from "../Resources/exceptions/HttpException";
import { BAD_REQUEST, UNAUTHORIZED } from "../Resources/constants/statusCodes";
import { API_KEY_SALT, API_KEY_LENGTH } from "../Resources/constants/env";

const xata = getXataClient();

class ApiAuthService {
  private generateApiKey() {
    return randomBytes(+API_KEY_LENGTH).toString("base64");
  }

  private hashApiKey(apiKey: string) {
    return bcrypt.hashSync(apiKey, API_KEY_SALT);
  }

  async createUserApiKey(userId: string) {
    const existingActiveApiKey = await xata.db.ApiKey.filter({
      "user.id": userId,
    }).getFirst();

    if (existingActiveApiKey) {
      await existingActiveApiKey.delete();
    }

    const newApiKey = this.generateApiKey();

    await xata.db.ApiKey.create({
      apiKey: this.hashApiKey(newApiKey),
      user: userId,
    });

    return newApiKey;
  }

  async validateApiKey(apiKey: string) {
    if (!apiKey.trim()) throw new HttpException(BAD_REQUEST, "API key cannot be an empty string");

    const hashedApiKey = this.hashApiKey(apiKey);

    const existingApiKey = await xata.db.ApiKey.filter("apiKey", hashedApiKey).getFirst();

    if (!existingApiKey) throw new HttpException(UNAUTHORIZED, "Invalid API key");

    if (!existingApiKey.user) throw new HttpException(UNAUTHORIZED, "API key has no user relation");

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
