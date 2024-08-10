import { expect } from '@playwright/test';
import { test } from "@core/fixtures";
import { LoginPage } from '@pages/storefront/login';
import { link } from 'fs';

test.describe("Login dashboard hoa don icorp", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ conf, page }, testInfo) => {
        testInfo.snapshotSuffix = "";
        loginPage = new LoginPage(page, conf.suiteConf.domain);
        await loginPage.goto(conf.suiteConf.domain);
    });

    test('Login dashboard thành công @LG_01', async ({ conf, page }) => {
        await test.step("Verify UI form login", async () => {
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_beforLogin, {
                maxDiffPixelRatio: 0.05,
                threshold: 0.1,
                maxDiffPixels: 2000,
            });
        })

        await test.step("Kiểm tra UI form login khi input đata thành công", async () => {
            console.log(conf.caseConf);
            await loginPage.inputForm(conf.caseConf.info_login);
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_formLogin,
                {
                    maxDiffPixelRatio: 0.05,
                    threshold: 0.1,
                    maxDiffPixels: 2000,
                }
            );
        })

        await test.step("Kiểm tra thông tin khi thực hiện login dashboard thành công", async () => {
            await loginPage.clickButtonByName("Đăng nhập");
            const textMessage = await loginPage.getTextContent(loginPage.xpathMessage);
            expect(textMessage).toEqual(conf.caseConf.messgae);
            await loginPage.page.waitForSelector(loginPage.xpathMessage, { state: "hidden" });
            expect(await page.screenshot()).toMatchSnapshot(conf.caseConf.picture_afterLogin, {
                maxDiffPixelRatio: 0.05,
                threshold: 0.1,
                maxDiffPixels: 2000,
            });
        })
    });

    test('Verify UI khi thực hiện login không thành công @LG_02', async ({ conf }) => {
        const stepInfo = conf.caseConf.step_info;
        console.log("abc", stepInfo);
        for (let i = 0; i < stepInfo.length; i++) {
            await test.step(stepInfo[i].step_name, async () => {
                await loginPage.inputForm(stepInfo[i].info_login);
                await loginPage.clickButtonByName("Đăng nhập");
                await loginPage.page.waitForTimeout(3000);
                expect(await loginPage.page.screenshot()).toMatchSnapshot(stepInfo[i].picture,
                    {
                        maxDiffPixelRatio: 0.05,
                        threshold: 0.1,
                        maxDiffPixels: 2000,
                    }
                );
            })
        }
    })
});