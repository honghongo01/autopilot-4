import { Page } from "@playwright/test";
export class SFPage {
    page: Page;
    readonly domain: string;
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
    async clickButtonByName(name: string) {
        await this.page.locator(`//button[normalize-space()='${name}']`).click();
    }
}