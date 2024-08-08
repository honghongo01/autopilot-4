import { Page } from "@playwright/test";
import { SFPage } from "@pages/page";
import { Login } from "@types"
export class LoginPage extends SFPage {
    xpathEinvoice = "//section[@id='einvoice-container']";
    xpathMessage = "//div[@class='Toastify__toast-body']";
    constructor(page: Page, domain: string) {
        super(page, domain);
    }

    /**
     * Input infor form login
     * @param infoLogin : infor login include email, pass
     */
    async inputForm(infoLogin: Login) {
        await this.page.locator("//input[@name='companyUsername']").fill(infoLogin.email);
        await this.page.locator("//input[@name='password']").fill(infoLogin.password);
    }

}