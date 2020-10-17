const http = require('http');
const fs = require('fs');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const templateOverview = fs.readFileSync(`${__dirname}/templates/overview-template.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/card-template.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/product-template.html`, 'utf-8');

const dataObj = JSON.parse(data);

function replaceTemplate(card, data) {
    let output = card; //Good functional programming practice to not directly change recd. data.

    //replace the placeholder(s) in teh file one by one.
    output = output.replace(/{%PRODUCTNAME%}/g, data.productName);
    output = output.replace(/{%IMAGE%}/g, data.image);
    output = output.replace(/{%QUANTITY%}/g, data.quantity);
    output = output.replace(/{%PRICE%}/g, data.price);
    output = output.replace(/{%ID%}/g, data.id);
    //handling special condition usng an if conditional statement
    if (!data.organic) output = output.replace(/{%NOTORGANIC%}/g, 'not-organic');
    return output;
}

const server = http.createServer((req, res) => {
    const pathName = req.url;

    //OVERVIEW PAGE
    if (pathName === '/' || pathName === '/overview') {

        //the below line tells the browser what it's going to receive as a response and the status of the data
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        // loop over the dataObj(which contains all our data) and replace the placeholders for every item in the object and then join all the items to form a single string which can be then sent as a response 
        const cards = dataObj
            .map(el => replaceTemplate(templateCard, el))
            .join('');
        //Replace the overview templates placeholder with the following html data string
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cards);
        res.end(output); //this is the response that we send to the browser it cold be string, html, etc.

    }
    //PRODUCT PAGE
    else if (pathName === '/product') {
        res.end('This is the product page');
    }
    //API PAGE
    else if (pathName === '/api') {
        res.end(data);
    }
    //404 PAGE
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world' //we can also put user defined header like this one
        });
        res.end('<h1>Page not found!!!</h1>')
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on port 8000!!!')
});