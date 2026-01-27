import { useState, useCallback } from "react";

interface UseImagePreviewReturn {
  isVisible: boolean;
  currentIndex: number;
  open: (index: number) => void;
  close: () => void;
  next: (totalImages: number) => void;
  previous: (totalImages: number) => void;
  goTo: (index: number) => void;
}

/**
 * Hook do zarządzania stanem podglądu obrazków w modalu.
 *
 * @example
 * const preview = useImagePreview();
 *
 * // Otwórz podgląd dla konkretnego obrazka
 * <Pressable onPress={() => preview.open(index)}>
 *
 * // Modal
 * <ImagePreviewModal
 *   visible={preview.isVisible}
 *   initialIndex={preview.currentIndex}
 *   onClose={preview.close}
 * />
 */
export function useImagePreview(): UseImagePreviewReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const open = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  const next = useCallback((totalImages: number) => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, []);

  const previous = useCallback((totalImages: number) => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return {
    isVisible,
    currentIndex,
    open,
    close,
    next,
    previous,
    goTo,
  };
}

export default useImagePreview;
