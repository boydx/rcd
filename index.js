const puppeteer = require('puppeteer');
const fs = require('fs');

const baseURL = `http://heritage.canadiana.ca/view/oocihm.`
const collectionName = `lac_reel_h1815`
// Image start and end values
const collectionStart = 780
const collectionEnd = 842
const scale = 3
const step = 10
const delay = 60 // seconds

// Create CSVfile for bad urls
fs.writeFile('output/error.csv', "url, error", (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
});

stepThrough();

async function stepThrough() {
    const message = `Downloading ${collectionName}_${collectionStart}.jpg–${collectionName}_${collectionEnd}.jpg
                    in batches of ${step} every ${delay} seconds`
    console.log(message)
    for (let j = collectionStart; j <= collectionEnd;) {
        console.log(`At ${j} of ${collectionStart}–${collectionEnd}`)
        for (let i = 1; i <= step && j <= collectionEnd; i++) {
            let url = `${baseURL}${collectionName}/${j}?r=0&s=${scale}`
            let name = `${collectionName}_${j}.jpg`
            getImg(url, name)
            j++
        }
        // create a new promise inside of the async function
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(true), delay * 1000) // resolve
        });
        // wait for the promise to resolve
        let result = await promise;
    }
}


// Get screencapture
function getImg(url, name) {
    (async () => {
        try {
            let screenshotOptions = {
                path: `output/${name}`,
                type: 'jpeg'
            }
            console.log(url)
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 0
            });
            //   console.log(viewSource)
            page.setViewport({
                height: 2000,
                width: 1400
            })

            await page.screenshot(screenshotOptions);
            await browser.close();


        } catch (error) {
            console.log(`Yo, ${url} -> ${error}`)
            fs.appendFile('output/error.csv',
                `\n${url},${error}`,
                (err) => {
                    if (err) throw err;
                    // console.log(`Added: ${content}`);
                });
        }

    })();

}