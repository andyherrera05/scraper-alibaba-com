import { createPuppeteerRouter, Dataset } from 'crawlee';

export const router = createPuppeteerRouter();

router.addHandler('detail', async ({ request, page, log }) => {
    try {
        await page.waitForSelector('h1', { timeout: 60000 });
        const title = await page.title();
        log.info(`Successfully scraped title: ${title}`, { url: request.loadedUrl });
        const productData = await page.evaluate(async () => {
        const nameProductSelector = ".product-title-container h1";
        const imageProductSelector = 'div[data-testid="product-image-list"] div div  div[aria-roledescription=slide] > div';
        const ladderPriceSelector = 'div[data-testid="ladder-price"] .price-item:first-child span';
        const rangePriceSelector = 'div[data-testid="range-price"] > span';
        const packageSizeSelector = 'div[data-testid="module-attribute"] div[title="Single package size"] + div';

          let price = "N/A";
          const nameProductElement =
            document.querySelector(nameProductSelector);
          
          const imageElements = document.querySelectorAll(imageProductSelector);
          const uniqueImageUrls = new Set();
          imageElements.forEach(imageElement => {
            const style = imageElement.style.backgroundImage;
            if (style) {
              const imageUrl = style
                .replace(/^url\("/, "")
                .replace(/"\)$/, "")
                .trim();
              uniqueImageUrls.add(`https:${imageUrl.replace(/_\d+x\d+\.jpg$/, '_960x960q80.jpg')}`);
            }
          });
          const imageUrls = Array.from(uniqueImageUrls);

          const ladderPriceElement =
            document.querySelector(ladderPriceSelector);
          if (ladderPriceElement) {
            price = ladderPriceElement.innerText.trim();
          } else {
            const rangePriceElement =
              document.querySelector(rangePriceSelector);
            if (rangePriceElement) {
              price = rangePriceElement.innerText.trim();
            }
          }

          const packageSizeElement =
            document.querySelector(packageSizeSelector);

          return {
            name: nameProductElement
              ? nameProductElement.innerText.trim()
              : "N/A",
            images: imageUrls,
            price: price,
            packageSize: packageSizeElement
              ? packageSizeElement.innerText.trim()
              : "N/A",
          };
        });
        

        await Dataset.pushData({
            url: request.loadedUrl,
            ...productData
        });
    } catch (error) {
        log.error(`Failed to process ${request.url}. Waiting for selector failed with error: ${error.message}`);
    }
});
