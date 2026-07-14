const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
        page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));

        console.log('Navigating to login...');
        await page.goto('http://localhost:5173/');
        
        await page.type('input[type="email"]', 'admin@gokuldham.com');
        await page.type('input[type="password"]', 'admin12345');
        await page.click('button[type="submit"]');
        
        await page.waitForNavigation();
        
        console.log('Navigating to documents...');
        await page.goto('http://localhost:5173/documents');
        
        await page.waitForSelector('.add-document-btn');
        console.log('Clicking Add Document button...');
        await page.click('.add-document-btn');
        
        await new Promise(r => setTimeout(r, 2000));
        console.log('Current URL:', page.url());
        
        const content = await page.content();
        console.log('Body length:', content.length);
        if (content.length < 500) {
           console.log('Page might be blank:', content);
        }
        
        await browser.close();
    } catch (error) {
        console.error('SCRIPT_ERROR:', error);
    }
})();
