import { Page } from "@playwright/test";
export class SFPage {
    page: Page;
    readonly domain: string;
    xpathMessage = "(//div[@class='Toastify__toast-body'])[1]";
    constructor(page: Page, domain?: string) {
        this.page = page;
        this.domain = domain;
    }
    /**
     * navigate to any url
     * @param url: navigation url information
     */
    async goto(url: string) {
        await this.page.goto(url, { waitUntil: "load" });
        await this.page.waitForLoadState("load");
    }

    /**
    * Returns locator information
    * @param selector:
    */
    genLoc(selector: string) {
        return this.page.locator(selector)
    }

    /**
       * Return the text content of an element
       * @param locator:infor element
       */
    async getTextContent(locator: string): Promise<string> {
        return (await this.page.locator(locator).textContent()).trim();
    }

    /**
         * Click on the button by name
         * @param name:name button
         */
    async clickButtonByName(name: string, index = 1) {
        const xpathBtn = `(//button[normalize-space()='${name}'])[${index}]`;
        const isBtnEnable = this.page.isEnabled(xpathBtn);
        if (isBtnEnable) {
            await this.page.locator(xpathBtn).click();
        }
    }

    /**
     * Click memu in dashboard
     * @param nameParent: name menu parent
     * @param subMenu: name submenu
     */
    async clickMenuInDashboard(nameParent: string, subMenu: string) {
        const xpathMenuParent = `//span[normalize-space()='${nameParent}']`;
        const xpathMenuSub = `//span[normalize-space()='${subMenu}']`;
        await this.page.locator(xpathMenuParent).click();
        const xpathMenuActive = `${xpathMenuParent}//ancestor::li[contains(@class,'menu-item-open')]`;
        await this.page.waitForSelector(xpathMenuActive);
        await this.page.locator(`${xpathMenuActive}${xpathMenuSub}`).click();
    }

    /**
 * Verify dashboard page display with
 * @param pageTitle page name
 * @returns boolean
 */
    async isDBPageDisplay(pageTitle: string, timeout = 3000): Promise<boolean> {
        let result = false;
        const xpath = [
            `(//h4[normalize-space()='${pageTitle}'])[1]`,
            `(//h2[normalize-space()='${pageTitle}'])[1]`,
            `(//h3[normalize-space()='${pageTitle}'])[1]`,
            `(//h1[normalize-space()='${pageTitle}'])[1]`,
            `(//div[normalize-space()='${pageTitle}'])[1]`,
            `(//span[normalize-space()='${pageTitle}'])[1]`,
            `(//p[normalize-space()='${pageTitle}'])[1]`,
        ];
        const listResult = await Promise.all(
            xpath.map(item => {
                return this.page.locator(item).isVisible();
            }),
        );
        result = listResult.includes(true) ? true : false;
        return result;
    }

    /**
 * Wait for button is visible
 * @param labelName
 * @param index
 */
    async checkButtonVisible(labelName: string, index = 1): Promise<boolean> {
        await this.page.waitForTimeout(3000);
        return await this.page
            .locator(`(//button[normalize-space()='${labelName}'])[${index}]`).isVisible({ timeout: 5000 });
    }

    /**
 * wait for toast message hide
 * @param message
 */
    async waitForToastMessageHide(): Promise<void> {
        await this.page.waitForSelector(this.xpathMessage);
        await this.page.waitForSelector(this.xpathMessage, { state: "hidden" });
    }

}