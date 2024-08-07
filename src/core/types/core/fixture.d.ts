
export type CaseConf = Record<string, any>;

export type Config = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suiteConf: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  caseConf: Record<string, any>;
  // caseName: string;
  directory?: string;
  fileName?: string;
};