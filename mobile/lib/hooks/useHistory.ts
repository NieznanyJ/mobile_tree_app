import { useCallback, useRef, useState } from "react";

import { useAuth } from "@/lib/context/AuthContext";
import {
  clearAllHistory,
  deletePrediction,
  fetchHistory,
  HistoryItem,
} from "@/lib/services/historyService";

interface UseHistoryReturn {
  history: HistoryItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  clearAll: () => Promise<void>;
  isDeleting: boolean;
}

const PAGE_SIZE = 10;

export function useHistory(): UseHistoryReturn {
  const { token } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);

  const loadHistory = useCallback(
    async (cursor?: string | null) => {
      if (!token) return null;

      const response = await fetchHistory(token, cursor, PAGE_SIZE);
      cursorRef.current = response.next_cursor;
      hasMoreRef.current = response.has_more;
      return response;
    },
    [token]
  );

  const refresh = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    cursorRef.current = null;
    hasMoreRef.current = true;

    try {
      const response = await loadHistory(null);
      if (response) {
        setHistory(response.items);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
    } finally {
      setIsLoading(false);
    }
  }, [token, loadHistory]);

  const loadMore = useCallback(async () => {
    if (!token || isLoadingMore || !hasMoreRef.current) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const response = await loadHistory(cursorRef.current);
      if (response) {
        setHistory((prev) => [...prev, ...response.items]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
    } finally {
      setIsLoadingMore(false);
    }
  }, [token, isLoadingMore, loadHistory]);

  const deleteItem = useCallback(
    async (id: number) => {
      if (!token) return;

      setIsDeleting(true);
      setError(null);

      try {
        await deletePrediction(token, id);
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się usunąć");
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [token]
  );

  const clearAll = useCallback(async () => {
    if (!token) return;

    setIsDeleting(true);
    setError(null);

    try {
      await clearAllHistory(token);
      setHistory([]);
      cursorRef.current = null;
      hasMoreRef.current = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wyczyścić");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [token]);

  return {
    history,
    isLoading,
    isLoadingMore,
    error,
    hasMore: hasMoreRef.current,
    loadMore,
    refresh,
    deleteItem,
    clearAll,
    isDeleting,
  };
}
