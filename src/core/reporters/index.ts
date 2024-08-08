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
                error: result.errors.map(e => e.message)
            };
            // overwrite with result of the last run
            this.testCases.set(codeName[0], runResult);
            const dirPath = test.parent.parent.title;
            const dir = path.dirname(dirPath);
            const fileName = path.basename(dirPath, ".spec.ts");
            this.fileName = fileName;
            this.dir = dir
        } else {
            console.error(`Cannot extract code name from ${test.title}`);
        }
    }
    onEnd(result: FullResult) {
        const projectSuites = this.suite.suites;
        for (const suite of projectSuites) {
            const project = suite.project();
            const basePath = path.dirname(project.outputDir);
            const reportFolder = path.join(basePath, "reports", this.dir);
            // const reportFolder = path.join(project.outputDir, "reports", this.dir);
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
            let existingReport = [];
            if (fs.existsSync(reportFile)) {
                const existingReportData = fs.readFileSync(reportFile, 'utf-8');
                existingReport = JSON.parse(existingReportData)["testCases"];
                for (const [title, runResult] of this.testCases.entries()) {
                    const index = existingReport.findIndex((caseReport: any) => caseReport.codeName === title);
                    if (index !== -1) {
                        existingReport[index] = runResult;
                    } else {
                        existingReport.push(runResult);
                    }
                }
            } else {
                existingReport = Array.from(this.testCases.values());
            }
            existingReport.forEach(testRult => {
                if (testRult.result === 'pass') {
                    this.passCount += 1;
                } else if (testRult.result === 'fail') {
                    this.failCount += 1;
                }
            })
            const newReport = {
                testCases: existingReport,
                summary: {
                    passed: this.passCount,
                    failed: this.failCount,
                    total: this.passCount + this.failCount,
                }
            };

            fs.writeFileSync(reportFile, JSON.stringify(newReport, null, 2));
        }
    }
}
export default MyReporter;