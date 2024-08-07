import { Page } from "@playwright/test";
import { SFPage } from "@pages/page";
import { Login } from "@types"
export class LoginPage extends SFPage {
    xpathEinvoice = "//section[@id='einvoice-container']";
    constructor(page: Page, domain: string) {
        super(page, domain);
    }
    async inputForm(infoLogin: Login) {
        await this.page.locator("//input[@name='companyUsername']").fill(infoLogin.email);
        await this.page.locator("//input[@name='password']").fill(infoLogin.password);
    }
    async clickButtonByName(name: string) {
        await this.page.locator(`//button[normalize-space()='${name}']`).click();
    }


}