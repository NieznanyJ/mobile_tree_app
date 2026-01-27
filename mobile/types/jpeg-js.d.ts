declare module "jpeg-js" {
  interface RawImageData {
    width: number;
    height: number;
    data: Uint8Array;
  }

  interface DecodeOptions {
    useTArray?: boolean;
    colorTransform?: boolean;
    formatAsRGBA?: boolean;
    tolerantDecoding?: boolean;
    maxResolutionInMP?: number;
    maxMemoryUsageInMB?: number;
  }

  interface EncodeOptions {
    quality?: number;
  }

  export function decode(
    jpegData: Uint8Array | ArrayBuffer | Buffer,
    options?: DecodeOptions
  ): RawImageData;

  export function encode(
    imgData: { width: number; height: number; data: Uint8Array },
    quality?: number
  ): { width: number; height: number; data: Uint8Array };
}
