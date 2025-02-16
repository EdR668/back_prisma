import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config(); // Cargar el archivo .env

export default cleanEnv(process.env, {
  MONGODB_URI_ID: str(),
  PORT_ID: port(),
  AWS_BUCKET_NAME_ID: str(),
  AWS_BUCKET_REGION_ID: str(),
  AWS_PUBLIC_KEY_ID: str(),
  AWS_SECRET_KEY_ID: str(),
  AUTH_SECRET_ID: str(),
  AUTH_CLIENT_ID: str(),
});
