import { expect } from '@playwright/test';
import { test } from "@core/fixtures";

import { ConfigImpl } from '@core/conf/conf'
import fs from "fs";
test.describe("Example", () => {
    test('has title @TC_01', async ({ page, conf }) => {
        test.step("go to URL", async () => {
            console.log("step 1");
        });
        test.step("Click button ", async () => {
            console.log("step 2");
        })
    })

    test('has title @TC_02', async ({ page, conf }) => {
        test.step("go to URL", async () => {
            console.log("step 1");
        });
        test.step("Click button ", async () => {
            console.log("step 2");
        })
    })


});
