import { expect } from '@playwright/test';
import { test } from "@core/fixtures";
import { LoginPage } from '@pages/storefront/login';
import { WorkUnit } from '@pages/workunit/workunit';

test.describe("Login dashboard hoa don icorp", () => {
    let loginPage: LoginPage;
    let workUnitpage: WorkUnit;

    test.beforeEach(async ({ conf, page }, testInfo) => {
        testInfo.snapshotSuffix = "";
        loginPage = new LoginPage(page, conf.suiteConf.domain);
        workUnitpage = new WorkUnit(page, conf.suiteConf.domain);
        await loginPage.goto(conf.suiteConf.domain);
        await loginPage.loginDashboard(conf.suiteConf.info_login);
        await workUnitpage.clickMenuInDashboard("Danh mục", "Đơn vị");
        expect(await workUnitpage.isDBPageDisplay("Đơn vị")).toBeTruthy();
        await workUnitpage.clickButtonByName("Thêm đơn vị");
    });

    test('Add unit sucess @DV_01', async ({ conf }) => {
        await test.step("Verify form add unit", async () => {
            await workUnitpage.page.waitForSelector(workUnitpage.xpathFormInput);
            await workUnitpage.page.waitForTimeout(1000);
            expect(await workUnitpage.page.locator(workUnitpage.xpathFormInput).screenshot()).toMatchSnapshot(conf.caseConf.picture_form_input,
                {
                    maxDiffPixelRatio: 0.05,
                    threshold: 0.1,
                    maxDiffPixels: 2000,
                }
            );

        });

        await test.step("Kiem tra hien thi message khi them thong tin thanh cong", async () => {
            await workUnitpage.addUnitInfor(conf.caseConf.infor_unit);
            const textMessage = await workUnitpage.getTextContent(workUnitpage.xpathMessage);
            expect(textMessage).toEqual(conf.caseConf.messgae);
        })

        await test.step("Kiem tra data sau khi thon thanh cong", async () => {
            await workUnitpage.page.reload({ waitUntil: "load" });
            const dataUnit = await workUnitpage.getInforUnit();
            expect(dataUnit).toEqual(
                expect.objectContaining(conf.caseConf.infor_unit),
            );


        })
    });

    test('Add unit khong thanh cong @DV_02', async ({ conf }) => {
        const stepInfo = conf.caseConf.step_infor;
        for (let i = 0; i < stepInfo.length; i++) {
            await test.step(`${stepInfo[i].stepName}`, async () => {
                await workUnitpage.page.waitForSelector(workUnitpage.xpathFormInput);
                await workUnitpage.addUnitInfor(stepInfo[i].infor_unit, stepInfo[i].index_btn);
                if (stepInfo[i].picture) {
                    await workUnitpage.page.waitForTimeout(1000);
                    expect(await workUnitpage.page.locator(workUnitpage.xpathFormInput).screenshot()).toMatchSnapshot(conf.caseConf.picture,
                        {
                            maxDiffPixelRatio: 0.05,
                            threshold: 0.1,
                            maxDiffPixels: 2000,
                        }
                    );
                }
                if (stepInfo[i].messgae) {
                    const textMessage = await workUnitpage.getTextContent(workUnitpage.xpathMessage);
                    expect(textMessage).toEqual(stepInfo[i].messgae);
                    await workUnitpage.waitForToastMessageHide()
                }
            })
        }
    });
});