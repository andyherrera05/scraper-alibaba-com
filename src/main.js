import { Actor } from 'apify';
import { log, PuppeteerCrawler, RequestQueue } from 'crawlee';
import { router } from './routes.js';
await Actor.init();

const input = await Actor.getInput();

if (!input) {
    throw new Error('No input provided')
}

const startUrls = input?.startUrls;

log.info(`Processing search: ${startUrls}`);

const requestQueue = await RequestQueue.open();

await requestQueue.addRequest([
    {
        url: startUrls,
        label: "detail"
    }
])

const proxyConfiguration = await Actor.createProxyConfiguration();
const crawler = new PuppeteerCrawler({
    proxyConfiguration,
    requestQueue,
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



await crawler.run();

await Actor.exit();
