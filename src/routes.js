import { createPuppeteerRouter, Dataset } from 'crawlee';

export const router = createPuppeteerRouter();

router.addHandler('detail', async ({ request, page, log }) => {
    try {
        await page.waitForSelector('h1', { timeout: 60000 });
        const title = await page.title();
        log.info(`Successfully scraped title: ${title}`, { url: request.loadedUrl });

        await Dataset.pushData({
            url: request.loadedUrl,
            title,
        });
    } catch (error) {
        log.error(`Failed to process ${request.url}. Waiting for selector failed with error: ${error.message}`);
    }
});
