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
    const browser = await pup.launch();
    const page = await browser.newPage();

    await page.goto(urls[category], { waitUntil: 'load', timeout: 0 });
    await page.waitForSelector('.ui-search-item__group');
    
    const titlesAndLinks = await page.$$eval(
      '.ui-search-item__group > a.ui-search-item__group__element',
      (element) => element.map((e) => ({ title: e.title, link: e.href })),
      );
    
    const arr = [];
    for (let titleAndLink of titlesAndLinks) {
      await page.goto(titleAndLink.link, { waitUntil: 'load', timeout: 0 });
      const price = await page.$$eval('.andes-money-amount__fraction', (element) => element[1]?.innerText);
      if (!!price) {
        const image = await page.$eval('.ui-pdp-gallery__figure__image', (element) => element.src);
        const formattedPrice = price.replaceAll('.', '').replaceAll(',', '.');
        const newPrice = Number(formattedPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        const newObj = {
          title: titleAndLink.title,
          link: titleAndLink.link,
          category,
          price: newPrice,
          image,
          website: 'mercadolivre',
        };
        arr.push(newObj);
      }
    }

    await Product.bulkCreate(arr, { ignoreDuplicates: true });
    console.log('criou');

    await browser.close();
    return arr;
  })();

  return scrapProducts;
};

module.exports = {
  scrapMl,
};