import { expect } from '@playwright/test';
import { test } from "@core/fixtures";
import { LoginPage } from '@pages/storefront/login';
import { link } from 'fs';

test.describe("Login storefront", () => {
    test('has title @LG_01', async ({ conf, page }, testInfo) => {
        const loginPage = new LoginPage(page, conf.suiteConf.domain)
        await test.step("Login storefront", async () => {
            await loginPage.goto(conf.suiteConf.domain);
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_beforLogin);
            await loginPage.inputForm(conf.suiteConf.info_login);
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_formLogin);
            await loginPage.clickButtonByName("Đăng nhập");
            await loginPage.page.waitForLoadState("load");
            await loginPage.page.waitForSelector(loginPage.xpathEinvoice);
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_afterLogin);
            console.log(testInfo)
        });
    })
});
