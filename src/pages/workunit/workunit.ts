import { Page } from "@playwright/test";
import { SFPage } from "@pages/page";
import { Unit } from "@types"
export class WorkUnit extends SFPage {

    xpathFormInput = "//div[@class='modal-content']";
    constructor(page: Page, domain: string) {
        super(page, domain);
    }

    async addUnitInfor(inforUnit: Unit, index = 1) {
        const xpathUnitCode = "//div[@class='modal-content']//input[@name='code']";
        await this.page.waitForSelector(xpathUnitCode);
        await this.page.locator(xpathUnitCode).fill(inforUnit.unitCode);
        await this.page.locator("//div[@class='modal-content']//input[@name='name']").fill(inforUnit.unitName);
        if (inforUnit.unitParent) {
            await this.selectInforUnitParent(inforUnit.unitParent);
        }
        await this.clickButtonByName("Lưu", index);
    }

    async selectInforUnitParent(inforUnitParent: string) {
        const unitParents = inforUnitParent.split(">");
        await this.page.locator("//span[normalize-space()='Đơn vị cha']//following-sibling::div").click();
        await this.page.waitForSelector("//div[@class='modal-content']//div[@class='modal-title h4']");
        await this.page.locator("//input[@type='text' and @placeholder='Tìm kiếm']").fill(unitParents[0]);
        let xpathInputUnitParent = `//button[contains(@class,'accordion-button collapsed') and normalize-space()='${unitParents[0]}']//parent::h2//following-sibling::div[@class='FolderTree_Input']//input`;
        if (unitParents.length > 1) {
            for (let i = 0; i < unitParents.length; i++) {
                await this.page.locator(`//button[contains(@class,"accordion-button collapsed") and normalize-space()="${unitParents[i]}"]//parent::h2`).click();
            }
            xpathInputUnitParent = `//button[normalize-space()='${unitParents[unitParents.length - 1]}']//parent::h2//following-sibling::div[@class='FolderTree_Input']//input`;
        }
        await this.page.locator(xpathInputUnitParent).click();
        await this.clickButtonByName("Lưu")
    }

    async getInforUnit(): Promise<Unit> {
        const xpathRowCode = "(//div[normalize-space()='Mã đơn vị'])[1]";
        const xpathRowName = "(//div[normalize-space()='Tên đơn vị'])[1]";
        const indexRowCode = await this.page.locator(xpathRowCode).getAttribute("data-column-id");
        const indexRowName = await this.page.locator(xpathRowName).getAttribute("data-column-id");
        const textCode = await this.page.locator(`//div[@data-column-id=${indexRowCode}]//p`).last().textContent();
        const textName = await this.page.locator(`//div[@data-column-id=${indexRowName}]//p`).last().textContent();
        const result = {
            unitCode: textCode,
            unitName: textName,
        }
        return result;
    }

}