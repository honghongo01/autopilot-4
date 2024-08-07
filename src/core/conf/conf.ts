import path from "path";
import fs from "fs";
import type { Config } from "@core/types";

export class ConfigImpl {
    fileName: string | undefined;
    caseName: string;
    directory: string;
    suiteConf: Record<string, any> = {};
    caseConf: Record<string, any> = {};

    constructor(directory: string, caseName: string) {
        let dirName = directory;
        if (path.extname(directory) === ".ts") {
            dirName = path.dirname(directory);
            this.fileName = path.basename(directory, ".spec.ts");
        }
        this.directory = dirName;
        this.caseName = caseName;
    }

    loadConfigFromFile() {
        const files = fs.readdirSync(this.directory);
        if (this.fileName) {
            const file = files.find(file => {
                const extension = path.extname(file);
                const isFileJson = extension === ".json";
                const fileName = path.basename(file, extension);
                return fileName === this.fileName && isFileJson;
            });
            if (file) {
                const filePath = path.join(this.directory, file);
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    this.suiteConf = JSON.parse(fileContent);
                    this.caseConf = this.suiteConf["cases"][this.caseName];
                } catch (err) {
                    console.error('Error reading or parsing file:', err);
                    return null;
                }
            }
        }
        return null;
    }
}