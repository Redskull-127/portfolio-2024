"use server";
import { google } from "googleapis";

export type keyParameterTypes = {
  PROJECT_ID: string;
  PRIVATE_KEY_ID: string;
  PRIVATE_KEY: string;
  CLIENT_EMAIL: string;
  universe_domain?: "googleapis.com" | string;
};

class GetAuth {
  public static async getAuth(
    keyParameter: keyParameterTypes,
    scopes: string[],
  ) {
    // base64 decode
    const decoded = Buffer.from(keyParameter.PRIVATE_KEY, "base64").toString(
      "utf-8",
    );
    return await google.auth.getClient({
      credentials: {
        type: "service_account",
        private_key: decoded.replace(/\\n/g, "\n") ?? "",
        client_email: keyParameter.CLIENT_EMAIL,
        project_id: keyParameter.PROJECT_ID,
        private_key_id: keyParameter.PRIVATE_KEY_ID,
        universe_domain: keyParameter.universe_domain,
      },
      scopes: scopes,
    });
  }
}

export { GetAuth };
