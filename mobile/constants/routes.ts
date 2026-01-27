export const isPublicRoute = (path: string) => {
  const publicPaths = [
    "settings",
    "forgot-password",
    "(media-browser)",
    "camera",
    "history",
    "tree",
    "guest-info",
  ];
  const authPaths = ["(auth)"];

  return publicPaths.includes(path) || authPaths.includes(path);
};
