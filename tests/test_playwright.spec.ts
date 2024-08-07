import { expect } from '@playwright/test';
import { test } from "@core/fixtures";

import { ConfigImpl } from '@core/conf/conf'
import fs from "fs";

test('has title @TC_01', async ({ page, conf }) => {
    console.log("test", conf);
});
