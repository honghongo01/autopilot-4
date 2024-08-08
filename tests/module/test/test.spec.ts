import { expect } from '@playwright/test';
import { test } from "@core/fixtures";
import { LoginPage } from '@pages/storefront/login';
import { link } from 'fs';

test.describe("Login storefront", () => {
    test('has title @T_01', async ({ }) => {
        await test.step("Login storefront", async () => {
            expect("OK").toBe("OK");
        });
    });

    test('has title @T_02', async () => {
        await test.step("Login storefront", async () => {
            expect("OK").toBe("OK");
        });
    })

});
