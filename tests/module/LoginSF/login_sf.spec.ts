import { expect } from '@playwright/test';
import { test } from "@core/fixtures";
import { LoginPage } from '@pages/storefront/login';

test.describe("Login storefront", () => {
    test('has title @LG_01', async ({ conf, page }) => {
        const loginPage = new LoginPage(page, conf.suiteConf.domain)
        // testInfo.snapshotSuffix = "";
        await test.step("Login storefront", async () => {
            await loginPage.goto(conf.suiteConf.domain);
            await loginPage.loginSFPage(conf.suiteConf.info_login);
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture);
        });
    })
});
