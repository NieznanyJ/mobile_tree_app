export const isPublicRoute = (path: string) => {
  const publicPaths = [
    "settings",
    "forgot-password",
    "(media-browser)",
    "predict",
    "history",
  ];
  const authPaths = ["(auth)"];

  return publicPaths.includes(path) || authPaths.includes(path);
};
