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
    const topStoryWrapper = document.querySelector('.top-story-wrapper');
    const imgReference = topStoryWrapper.querySelector('.img-container img');
    const textReference = topStoryWrapper.querySelector('.article-meta .leadin');
    const linkReference = topStoryWrapper.querySelector('a.image-link');
  
    let imgSource = imgReference ? imgReference.getAttribute('src') || imgReference.getAttribute('data-src') : null;
    let textContent = textReference ? textReference.textContent : null;
    let link = linkReference ? linkReference.getAttribute('href') : null;
  
    // Ensure the link is a full URL
    if (link && !link.startsWith('http')) {
      link = 'https://www.rte.ie' + link;
    }
  
    return { imgSource, textContent, link };
  });

  await browser.close();

  return body;
}

// Export the scrapeData function
module.exports = { scrapeData };