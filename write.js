const fs = require('fs');
const files = require('./list.js');
let i = 1
let link = ""
let template = ""
for (file of files.list) {
    
    let baseName = file.slice(0,14)
    

    let htmlName = `output/${baseName}_${i}.html`

    if (i == 1) {
        link = `<a href="${baseName}_${i+1}.html">${baseName}_${i+1} >></a>`
        htmlName = `output/index.html`
    } else if (i == files.list.length){
        link = `<a href="${baseName}_${i-1}.html"><< ${baseName}_${i-1}</a>`
    } else {
        link = `<a href="${baseName}_${i-1}.html"><< ${baseName}_${i-1}</a> | <a href="${baseName}_${i+1}.html">${baseName}_${i+1} >></a>`
    }
    i++

    template = `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>${file}</title>
    </head>
    
    <body>
    ${link}<br>
    <img src="${file}" width="200%">
    
    </body>
    </html>`

    console.log(template)

fs.writeFile(htmlName, template, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
});
}
