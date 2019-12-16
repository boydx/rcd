// Load modules
const puppeteer = require('puppeteer');
const fs = require('fs');

// Load variables
const baseURL = `http://heritage.canadiana.ca/view/oocihm.`
const collectionName = `lac_reel_h1815`
// Image start and end number. 
// (The highlighted part after "h1815/X?r=0....)
const collectionStart = 500
const collectionEnd = 842
// How zoomed in is the Java Viewer?
// Because we cannot change the Viewer window size, 
// scale 3 is max size to fit two-page spread.
// A scale 5 fits one-page spread.
const scale = 3
// Download 10 at a time.
const step = 10
// Delay downloading next batch some length of time. 
// Prevents errors and server timeouts.
const delay = 60 // seconds

// Create CSVfile for bad urls
fs.writeFile('output/error.csv', "url, error", (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
});

// Run function to step through collection and download screen captures
stepThrough();

// Define functions

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
                });
        }
    })();
}