strict;
//Blocking Code ,Synchronous way
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
const { strict } = require('assert');

//////////////////////////

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textIn);

// const textOut = `this is what we know about avacado : ${textIn}.\n Created on ${Date.now}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written");

// Non-Blocking Code ,Asynchronous way
// fs.readFile("./txt/start1.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("File has been Written!");
//       });
//     });
//   });
// });
// console.log("Will read File!");
//////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/TEMPLATE-CARD.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
    //Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
    //NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('THIS apge is not Found!!');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request 8000');
});
