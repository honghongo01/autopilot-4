import { expect } from '@playwright/test';
import { test } from "@core/fixtures";
import { LoginPage } from '@pages/storefront/login';
import { link } from 'fs';

test.describe("Login storefront", () => {
    test('has title @LG_01', async ({ conf, page }, testInfo) => {
        testInfo.snapshotSuffix = "";
        const loginPage = new LoginPage(page, conf.suiteConf.domain)
        await test.step("Login storefront", async () => {
            await loginPage.goto(conf.suiteConf.domain);
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_beforLogin, {
                maxDiffPixelRatio: 0.05,
                threshold: 0.1,
                maxDiffPixels: 2000,
            });
            await loginPage.inputForm(conf.suiteConf.info_login);
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_formLogin,
                {
                    maxDiffPixelRatio: 0.05,
                    threshold: 0.1,
                    maxDiffPixels: 2000,
                }
            );
            await loginPage.clickButtonByName("Đăng nhập");
            const textMessage = await loginPage.getTextContent(loginPage.xpathMessage);
            expect(textMessage).toEqual(conf.caseConf.messgae);
            await loginPage.page.waitForSelector(loginPage.xpathMessage, { state: "hidden" });
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_afterLogin, {
                maxDiffPixelRatio: 0.05,
                threshold: 0.1,
                maxDiffPixels: 2000,
            });
        });
    });

    test('has title @LG_02', async ({ },) => {
        await test.step("Login storefront", async () => {
            expect("OK").toBe("OK");
        });
    })

});
