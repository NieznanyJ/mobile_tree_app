declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";
declare module "*.svg";

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL: string;
  }
}