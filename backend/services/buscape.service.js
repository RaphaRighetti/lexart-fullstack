const { getProducts } = require('./products.service');
const pup = require('puppeteer');
const { Product } = require('../models');

const buscapeUrls = (category, query) => {
  const newQuery = typeof query === 'string' && query.length > 0 ? query : category;
  const formattedQuery = `${newQuery}`.replaceAll(' ', '%20');
  const urls = {
    celular: `https://www.buscape.com.br/search?q=${formattedQuery}&refinements%5B0%5D%5Bid%5D=categoryId&refinements%5B0%5D%5Bvalues%5D%5B0%5D=7&isDealsPage=false`,

    tv: `https://www.buscape.com.br/search?q=${formattedQuery}&refinements%5B0%5D%5Bid%5D=categoryId&refinements%5B0%5D%5Bvalues%5D%5B0%5D=3&isDealsPage=false`,

    geladeira: `https://www.buscape.com.br/search?q=${formattedQuery}&refinements%5B0%5D%5Bid%5D=categoryId&refinements%5B0%5D%5Bvalues%5D%5B0%5D=8&isDealsPage=false`,
  };

  return urls;
};

const scrapBuscape = async (category, query) => {
  const urls = buscapeUrls(category, query);
  const dbProducts = await getProducts(category, 'buscape');
  if (dbProducts) return dbProducts;
  
  const scrapProducts = await (async () => {
    const browser = await pup.launch();
    const page = await browser.newPage();

    await page.goto(urls[category], { waitUntil: 'load', timeout: 0 });
    await page.waitForSelector('.SearchCard_ProductCard_Inner__7JhKb');
    await page.waitForSelector('.SearchCard_ProductCard_Image__ffKkn > span > img');
    await page.evaluate( () => {
      window.scrollBy({
        top: window.innerHeight * 500,
        behavior: "smooth",
      });
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const links = await page.$$eval(
      '.SearchCard_ProductCard_Inner__7JhKb',
      (element) => element.map((e) => e.href),
      );
    const titles = await page.$$eval(
      '.SearchCard_ProductCard_Name__ZaO5o',
      (element) => element.map((e) => e.innerText),
      );
    const prices = await page.$$eval(
      '[data-testid="product-card::price"]',
      (element) => element.map((e) => e.innerText),
      );
    const images = await page.$$eval(
      '.SearchCard_ProductCard_Image__ffKkn > span > img',
      (element) => element.map((e) => e.src),
      );
    
    const arr = [];
    links.forEach((link, i) => {
      const newObj = {
        title: titles[i],
        link,
        category,
        price: prices[i],
        image: images[i],
        website: 'buscape',
      };
      arr.push(newObj);
    });

    await Product.bulkCreate(arr, { ignoreDuplicates: true });

    await browser.close();
    return arr;
  })();

  return scrapProducts;
};

module.exports = {
  scrapBuscape,
};