const http = require('http');
const fs = require('fs');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//read all the files synchronously because we can afford to and reading them on req to a page will be too resource intensive
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const templateOverview = fs.readFileSync(`${__dirname}/templates/overview-template.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/card-template.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/product-template.html`, 'utf-8');

const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));

dataObj.map((el, i) => el.slug = slugs[i]); //(:))) put the slug in the respective product objects

const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);


    //if we don't pass true we get the query property as a string which will then be stressful to work with, likewise passing true gets us an object that will be easy to work with in the long term

    //OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview') {

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
    else if (pathname === '/product') {
        //(:))) slug implemented using spread+filtering
        const product = replaceTemplate(templateProduct, ...dataObj.filter(item => item.slug === query.slug))


        //data object is an array and we want an item at a position from the array, (p.s. arrays are a kind of object in JavaScript)
        // const product = dataObj[query.id];
        // const output = replaceTemplate(tempProduct, product);

        res.end(product);
    }
    //API PAGE
    else if (pathname === '/api') {
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