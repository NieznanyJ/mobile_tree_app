/**
 * Type declarations for TensorFlow.js model files
 */

declare module "*.bin" {
  const content: number;
  export default content;
}

declare module "@/assets/models/labels.json" {
  interface TreeClass {
    name: string;
    id: string;
  }

  interface LabelsData {
    classes: TreeClass[];
    imageSize: number;
    inputShape: number[];
  }

  const data: LabelsData;
  export default data;
}
