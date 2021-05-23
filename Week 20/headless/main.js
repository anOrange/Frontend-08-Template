/*
 * @Description: 无头浏览器检查
 * @Author: zhuo.pan
 * @Date: 2021-05-23 20:16:43
 * @LastEditTime: 2021-05-23 21:36:30
 * @LastEditors: zhuo.pan
 */
const puppeteer = require('puppeteer');

(async () => {
  const url = 'https://m.kuwo.cn/newh5app/play_detail/71169859?from=baidu'
  console.log('url: ' + url)
  console.log('loading...')
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
    };
  });


  console.log('Dimensions:', dimensions);

  // await page.pdf({ path: 'hn.pdf', format: 'a4' });
  await page.screenshot({ path: 'example.png' });

  const avatar = await page.mainFrame().$('.avatar img');
  // console.log(img);
  avatar.asElement()
  console.log(await avatar.boundingBox())
  console.log(await avatar.boxModel())


  await browser.close();
})();

