import { Client, Account, Databases, Storage, Avatars } from "appwrite";
import { appwriteConfig } from "@/config/appwrite";

const client = new Client();

client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export { client };
