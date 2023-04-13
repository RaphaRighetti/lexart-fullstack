const { getProducts } = require('./products.service');
const pup = require('puppeteer');
const { Product } = require('../models');

const mlUrls = (category, query) => {
  const newQuery = typeof query === 'string' && query.length > 0 ? query : category;
  const firstQuery = `${newQuery}`.replaceAll(' ', '-');
  const secondQuery = `${newQuery}`.replaceAll(' ', '%20');
  const urls = {
    celular: `https://lista.mercadolivre.com.br/celulares-telefones/celulares-smartphones/${firstQuery}_NoIndex_True#D[A:${secondQuery},on]`,
    tv: `https://lista.mercadolivre.com.br/eletronicos-audio-video/televisores/${firstQuery}_NoIndex_True#D[A:${secondQuery},on]`,
    geladeira: `https://lista.mercadolivre.com.br/eletrodomesticos/refrigeracao/geladeiras/${firstQuery}_NoIndex_True#D[A:${secondQuery},on]`,
  };

  return urls;
};

const scrapMl = async (category, query) => {
  const urls = mlUrls(category, query);
  const dbProducts = await getProducts(category, 'mercadolivre');
  if (dbProducts) return dbProducts;
  
  const scrapProducts = await (async () => {
    const browser = await pup.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], ignoreDefaultArgs: ['--disable-extensions'] });
    const page = await browser.newPage();

    await page.goto(urls[category], { waitUntil: 'load', timeout: 0 });
    await page.waitForSelector('.ui-search-item__group');
    await page.waitForSelector('.slick-slide > img');
    
    for (let i = 1; i <= 20; i += 1) {
      await page.evaluate( () => {
        window.scrollBy({
          top: window.innerHeight * i * 10,
          behavior: "smooth",
        });
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }


    
    const titlesAndLinks = await page.$$eval(
      '.ui-search-item__group > a.ui-search-item__group__element',
      (element) => element.map((e) => ({ title: e.title, link: e.href })),
      );
    const images = await page.$$eval(
      '.slick-slide > img',
      (element) => element.map((e) => e.src),
      );
    const prices = await page.$$eval(
      '.ui-search-price__second-line > .price-tag > .price-tag-amount > .price-tag-fraction',
      (element) => element.filter((_e, i) => i % 2 === 0).map((e) => e.innerText),
      );
    
    const arr = [];
    titlesAndLinks.forEach((titleAndLink, i) => {
      const formattedPrice = prices[i].replaceAll('.', '').replaceAll(',', '.');
      const newPrice = Number(formattedPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const newObj = {
        title: titleAndLink.title,
        link: titleAndLink.link,
        category,
        price: newPrice,
        image: images[i],
        website: 'mercadolivre',
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
  scrapMl,
};