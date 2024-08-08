
export type RunResult = {
    codeName: string;
    startAt: Date;
    finishedAt: Date;
    result: string;
    testResult: string;
    realResult: string;
    error: string[];
    fileTrace?: string

};