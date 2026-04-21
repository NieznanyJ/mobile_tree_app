import colors from "@/constants/colors";

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Dzisiaj, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  } else if (diffDays === 1) {
    return "Wczoraj";
  } else if (diffDays < 7) {
    return `${diffDays} dni temu`;
  } else {
    return date.toLocaleDateString("pl-PL");
  }
};

export const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return colors.success;
  if (confidence >= 75) return colors.warning;
  return colors.error;
};

export const getConfidenceBgColor = (confidence: number) => {
  if (confidence >= 70) return "rgba(34, 197, 94, 0.15)";
  if (confidence >= 40) return "rgba(234, 179, 8, 0.15)";
  return "rgba(239, 68, 68, 0.15)";
};
