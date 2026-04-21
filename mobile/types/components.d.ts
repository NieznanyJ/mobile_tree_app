export interface PredictionImageGridProps {
  slots: (null | { id: string; uri: string })[];
  preview: {
    open: (index: number) => void;
  };
  removeAssetForPrediction: (id: string) => void;
  colors: {
    text: {
      muted: string;
    };
  };
  GRID_SPACING: number;
  SLOT_SIZE: number;
}

export interface AssetModalProps {
  visible: boolean;
  album: MediaLibrary.Album | null;
  assets: MediaLibrary.Asset[];
  onClose: () => void;
  onPhotoSelected: (asset: MediaLibrary.Asset) => void;
}

export interface SecondaryPredictionCardProps {
  prediction: SinglePrediction;
  tree: Tree | undefined;
  onGoToAtlas: (treeId: string) => void;
}

export interface Tree {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  occurrence: string;
  images: string[];
}

export interface PredictionModalProps {
  prediction: PredictionResult | null;
  setPrediction: (val: PredictionResult | null) => void;
  isLoading: boolean;
}
