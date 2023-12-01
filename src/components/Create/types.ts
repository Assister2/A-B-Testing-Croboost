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
  Original: TestInputs;
  description: string;
  Variant: TestInputs;
}
export const TEST_NAMES = ["Original", "Variant"];
