import { request, test as base } from "@playwright/test";
import type { Config } from "@core/types";
import { ConfigImpl } from '@core/conf/conf'
import { extractCodeName } from "@core/untis/string";

export const test = base.extend<{
    conf: Config
}>({
    conf: [
        async ({ }, use, testInfo) => {
            const caseCodes = extractCodeName(testInfo.title);
            const conf = new ConfigImpl(testInfo.file, caseCodes[0]);
            conf.loadConfigFromFile();
            await use(conf);
        },
        { scope: "test" },
    ],

})