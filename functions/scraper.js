const puppeteer = require('puppeteer');

const scrapeData = async () => {
  await puppeteer.createBrowserFetcher().download(puppeteer.PUPPETEER_REVISIONS.chromium);
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto('https://www.rte.ie/news/', {
    waitUntil: "domcontentloaded"
  });

  const body = await page.evaluate(() => {
    const imgReference = document.querySelector('.top-story-wrapper .img-container img');
    const textReference = document.querySelector('.top-story-wrapper .article-meta .leadin');

    // Get the image source (use 'src' or 'data-src' if 'src' is empty)
    let imgSource = imgReference ? imgReference.getAttribute('src') || imgReference.getAttribute('data-src') : null;

    // Get the text content from the element
    let textContent = textReference ? textReference.textContent : null;

    return { imgSource, textContent };
  });

  await browser.close();

  return body;
}

// Export the scrapeData function
module.exports = { scrapeData };