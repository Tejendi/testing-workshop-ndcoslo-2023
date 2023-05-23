
using Microsoft.Playwright;

IPlaywright playwright = await Playwright.CreateAsync();

IBrowser browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
{
    Headless = false,
    SlowMo = 2000
});

IBrowserContext browserContext = await browser.NewContextAsync(new BrowserNewContextOptions
{
    IgnoreHTTPSErrors = true
});


IPage page = await browserContext.NewPageAsync();

await page.GotoAsync("https://localhost:5001/add-customer");

await page.GetByPlaceholder("Fullname").FillAsync("Nick Chapsas");

await page.GetByText("Submit").ClickAsync();

playwright.Dispose();
