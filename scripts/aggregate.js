const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  let group = process.argv.reverse()[0].toLowerCase();
  group = ['collections', 'helpers'].includes(group) ? group : 'helpers';

  const assets = path.resolve(__dirname, `assets`);
  const store = path.resolve(assets, `preview/${group}`);
  fs.mkdirSync(store, {
    recursive: true,
  });
  fs.mkdirSync(path.resolve(assets, 'indices'));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://laravel.com/docs/9.x/${group}`);

  await page.waitForSelector('.collection-method');
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'dark' },
  ]);

  const helpers = await page.evaluate(() =>
    [...document.querySelectorAll('.collection-method')]
      .map((method) => ({
        methodName: method.textContent,
        id: method.id.replace('method-', ''),
        description: method.nextElementSibling,
        example: method.nextElementSibling.nextElementSibling,
      }))
      .reduce(
        (acc, { methodName, description, example, id }) =>
          Object.assign(acc, {
            [id]: {
              description: description.textContent
                .replace(/:$/, '')
                .replace(/(\r|\n)/g, ' '),
              methodName,
              x: description.offsetLeft - 15, // re-center frame
              y: description.offsetTop,
              w: description.offsetWidth + description.offsetHeight,
              h:
                example.offsetTop -
                description.offsetTop +
                example.offsetHeight,
            },
          }),
        {},
      ),
  );

  let progress = 0;
  for (const methodId in helpers) {
    if (Object.hasOwnProperty.call(helpers, methodId)) {
      progress++;
      const { x, y, w, h, methodName } = helpers[methodId];

      console.log(
        `${progress}/${helpers.length}: Storing ${methodName} as ${methodId}.png`,
      );

      await page.screenshot({
        path: `${store}/${methodId}.png`,
        clip: { x, y, width: w, height: h },
      });
    }
  }

  // write index
  fs.writeFileSync(
    `${assets}/indices/${group}.json`,
    JSON.stringify(
      Object.keys(helpers).map((key) => ({
        id: key,
        description: helpers[key].description,
        method: helpers[key].methodName,
      })),
    ),
  );

  await browser.close();
})();
