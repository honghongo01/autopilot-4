import { Page } from "@playwright/test";
import { SFPage } from "@pages/page";
import { Login } from "@types"
export class LoginPage extends SFPage {
    xpathNameGroup = "//div[@class='main-group group']"
    constructor(page: Page, domain: string) {
        super(page, domain);
    }
    async loginSFPage(infoLogin: Login) {
        await this.page.locator("//input[@name='email']").fill(infoLogin.email);
        await this.page.locator("//input[@name='password']").fill(infoLogin.password);
        await this.page.locator("//button[normalize-space()='Đăng nhập']").click();
        await this.page.waitForSelector(`//header//img[@alt="${infoLogin.name}"]`)
    }


}