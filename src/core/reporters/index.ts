import type {
    Reporter, FullConfig, Suite, TestCase, TestResult, FullResult
} from '@playwright/test/reporter';
import type { RunResult } from "@types";
import { extractCodeName } from "@core/untis/string";
import fs from "fs";
import path from "path";

export class MyReporter implements Reporter {
    private testCases = new Map<string, RunResult>();
    private suiteName = "";
    private startedAt: Date;
    private config: FullConfig;
    private suite: Suite;
    private fileName = "";
    private dir = "";
    private passCount = 0;
    private failCount = 0;

    constructor(options: { customOption?: string } = {}) {
        console.log(`my-awesome-reporter setup with customOption set to ${options.customOption}`);
    }

    onBegin(config: FullConfig, suite: Suite) {
        this.config = config;
        this.suite = suite;
        this.startedAt = new Date();
    }

    onTestBegin(test: TestCase) {
        console.log(`Test started: ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        console.log(test);
        console.log(`Test ended: ${test.title} with status: ${result.status}`);
        const codeName = extractCodeName(test.title);
        if (codeName.length > 0) {
            const runResult: RunResult = {
                codeName: codeName[0],
                startAt: result.startTime,
                finishedAt: new Date(result.startTime.getTime() + result.duration),
                result: result.status == "passed" ? "pass" : "fail",
                testResult: "",
                realResult: result.status,
                fileTrace: `http://localhost:9323/#?testId=${test.id}`,
                error: result.errors.map(e => e.message)
            };
            // overwrite with result of the last run
            this.testCases.set(codeName[0], runResult);
            const dirPath = test.parent.parent.title;
            const dir = path.dirname(dirPath);
            const fileName = path.basename(dirPath, ".spec.ts");
            this.fileName = fileName;
            this.dir = dir;
            if (result.status === 'passed') {
                this.passCount += 1;
            } else if (result.status === 'failed') {
                this.failCount += 1;
            }
        } else {
            console.error(`Cannot extract code name from ${test.title}`);
        }
    }
    onEnd(result: FullResult) {
        const projectSuites = this.suite.suites;
        console.log(projectSuites);
        for (const suite of projectSuites) {
            const project = suite.project();
            const basePath = path.dirname(project.outputDir);
            const reportFolder = path.join(basePath, "reports", this.dir);
            // const reportFolder = path.join(project.outputDir, "reports", this.dir);
            console.log(project.outputDir);
            if (!fs.existsSync(reportFolder)) {
                fs.mkdirSync(reportFolder, { recursive: true });
            }
            let reportFile: string | undefined;
            for (let i = 0; i < 10; ++i) {
                reportFile = path.join(
                    reportFolder, `${this.fileName}.json`,
                );
                try {
                    if (fs.existsSync(reportFile)) continue;
                } catch (e) {
                    console.log(e);
                }
                break;
            }
            if (!reportFile) throw new Error("Internal error, could not create report file");
            console.log(result);
            const report = {
                "case": Array.from(this.testCases.values()), "summery": {
                    "totalPass": this.passCount, "totalFalse": this.failCount, "sstartTime": result.startTime, "duration": result.duration
                }
            };
            fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        }
    }
}
export default MyReporter;