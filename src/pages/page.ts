import { Page } from "@playwright/test";
export class SFPage {
    page: Page;
    readonly domain: string;
    constructor(page: Page, domain?: string) {
        this.page = page;
        this.domain = domain;
    }
    async goto(url: string) {
        await this.page.goto(url, { waitUntil: "load" });
        await this.page.waitForLoadState("load");
    }

    genLoc(selector: string) {
        return this.page.locator(selector)
    }
}