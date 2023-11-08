export type TestInputs = {
  codeJS: string;
  codeCSS: string;
  // sampleRate: number;
};

export type TriggerForV2 = {
  path_name : string;
};

export interface IExperimentParameters {
  id: string;
  name: string;
  // state: string; // live, staging, inactive
  trigger: string;
  sampleRate: number;
  Original: TestInputs;
  Variant: TestInputs;
}
export interface IExperimentParameters2 {
  id: string;
  name: string;
  // state: string; // live, staging, inactive
  trigger: TriggerForV2;
  sampleRate: number;
  Original: TestInputs;
  Variant: TestInputs;
  
}
export const TEST_NAMES = ["Original", "Variant"];
