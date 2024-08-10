import { expect } from '@playwright/test';
import { test } from "@core/fixtures";

test.describe("Login storefront", () => {
    test('has title @T_01', async ({ }) => {
        await test.step("Login storefront", async () => {
            expect("OK").toBe("hanh");
        });
    });

    test('has title @T_02', async () => {
        await test.step("Login storefront", async () => {
            expect("OK").toBe("OK");
        });
    })

});
