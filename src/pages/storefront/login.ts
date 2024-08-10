import { Page } from "@playwright/test";
import { SFPage } from "@pages/page";
import { Login } from "@types"
export class LoginPage extends SFPage {
    xpathEinvoice = "//section[@id='einvoice-container']";
    constructor(page: Page, domain: string) {
        super(page, domain);
    }

    /**
     * Input infor form login
     * @param infoLogin : infor login include email, pass
     */
    async inputForm(infoLogin: Login) {
        if (infoLogin.email) {
            await this.page.locator("//input[@name='companyUsername']").fill(infoLogin.email);
        }
        if (infoLogin.password) {
            await this.page.locator("//input[@name='password']").fill(infoLogin.password);
        }
        if (infoLogin.MST) {
            await this.page.locator("//input[@name='taxCode']").fill(infoLogin.MST);
        }
    }

    async loginDashboard(infoLogin: Login) {
        await this.inputForm(infoLogin);
        await this.checkButtonVisible("Đăng nhập");
        await this.clickButtonByName("Đăng nhập");
        await this.page.waitForSelector(this.xpathMessage);
        await this.page.waitForSelector(this.xpathMessage, { state: "hidden" });
    }

}