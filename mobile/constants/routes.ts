export const isPublicRoute = (path: string) => {
  const publicPaths = [
    "settings",
    "forgot-password",
    "(media-browser)",
    "(media-browser)",
    "predict",
  ];
  const authPaths = ["(auth)"];

  return publicPaths.includes(path) || authPaths.includes(path);
};
