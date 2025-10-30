import { Actor } from 'apify';
import { PuppeteerCrawler } from 'crawlee';
import { router } from './routes.js';
await Actor.init();

const input = await Actor.getInput();
const startUrls = input?.startUrls || [{ url: 'https://apify.com' }];

const proxyConfiguration = await Actor.createProxyConfiguration();
const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    requestHandler: router,
    launchContext: {
        launchOptions: {
            args: [
                '--disable-gpu', 
                '--no-sandbox', 
            ],
        },
    },
});

await crawler.run(startUrls);

await Actor.exit();
