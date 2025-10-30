import { Actor } from 'apify';
import { log, PuppeteerCrawler, RequestQueue } from 'crawlee';
import { router } from './routes.js';
await Actor.init();

const input = await Actor.getInput();

if (!input) {
    throw new Error('No input provided')
}

const startUrls = input?.startUrls;

log.info(`Processing ${startUrls.length} start URLs`);

const requestQueue = await RequestQueue.open();

for (const startUrl of startUrls) {
    await requestQueue.addRequest({
        url: startUrl.url,
        label: 'detail',
    });
}

const proxyConfiguration = await Actor.createProxyConfiguration();
const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    requestQueue,
    requestHandler: router,
    launchContext: {
        useChrome: true,
        launchOptions: {
            args: [
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-infobars',
                '--window-size=1920,1080',
            ],
        },
    },
    headless: true,
    navigationTimeoutSecs: 120,
});



await crawler.run();

await Actor.exit();
