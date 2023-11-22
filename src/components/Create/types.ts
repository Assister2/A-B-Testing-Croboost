export type TestInputs = {
  codeJS: string;
  codeCSS: string;
  // sampleRate: number;
};
export interface IExperimentParameters {
  id: string;
  name: string;
  // state: string; // live, staging, inactive
  trigger: string;
  sampleRate: number;
  description: string;
  Original: TestInputs;
  Variant: TestInputs;
}
export const TEST_NAMES = ["Original", "Variant"];
