/**
 * Serwis do komunikacji z API historii predykcji.
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- TYPY ---

export interface SinglePrediction {
  predicted_class: string;
  tree_id: string;
  confidence: number;
}

export interface HistoryItem {
  id: number;
  predicted_class: string;
  tree_id: string;
  confidence: number;
  thumbnail_url: string;
  created_at: string;
}

export interface HistoryDetail {
  id: number;
  predicted_class: string;
  tree_id: string;
  confidence: number;
  all_predictions: SinglePrediction[];
  image_urls: string[];
  created_at: string;
}

export interface PaginatedHistoryResponse {
  items: HistoryItem[];
  next_cursor: string | null;
  has_more: boolean;
}

// --- FUNKCJE API ---

/**
 * Pobiera listę historii predykcji z paginacją.
 */
export async function fetchHistory(
  token: string,
  cursor?: string | null,
  limit: number = 10
): Promise<PaginatedHistoryResponse> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  if (cursor) {
    params.append("cursor", cursor);
  }

  const response = await fetch(`${API_URL}/predictions/?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Nie udało się pobrać historii");
  }

  return response.json();
}

/**
 * Pobiera szczegóły pojedynczej predykcji.
 */
export async function fetchPredictionDetail(
  token: string,
  predictionId: number
): Promise<HistoryDetail> {
  const response = await fetch(`${API_URL}/predictions/${predictionId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (response.status === 404) {
      throw new Error("Predykcja nie została znaleziona");
    }
    throw new Error("Nie udało się pobrać szczegółów predykcji");
  }

  return response.json();
}

/**
 * Usuwa pojedynczą predykcję z historii.
 */
export async function deletePrediction(
  token: string,
  predictionId: number
): Promise<void> {
  const response = await fetch(`${API_URL}/predictions/${predictionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (response.status === 404) {
      throw new Error("Predykcja nie została znaleziona");
    }
    throw new Error("Nie udało się usunąć predykcji");
  }
}

/**
 * Usuwa całą historię predykcji użytkownika.
 */
export async function clearAllHistory(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/predictions/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Nie udało się wyczyścić historii");
  }
}

/**
 * Buduje pełny URL do obrazu.
 */
export function getImageUrl(relativePath: string): string {
  if (!relativePath) return "";
  // Jeśli ścieżka już zaczyna się od http, zwróć bez zmian
  if (relativePath.startsWith("http")) return relativePath;
  // Usuń początkowy slash jeśli jest
  const cleanPath = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;
  return `${API_URL}/${cleanPath}`;
}
