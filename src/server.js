const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });
 
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      request.body = query.parse(bodyString);
      //handler(request, response);
    });
  };
 
  // handle POST requests
  const handlePost = (request, response, parsedUrl) => {
    // If they go to /addUser
    if (parsedUrl.pathname === '/addUser') {
      // Call our below parseBody handler, and in turn pass in the
      // jsonHandler.addUser function as the handler callback function.
      parseBody(request, response, jsonHandler.addUser);
    }
  };
 
  // handle GET requests
  const handleGet = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/style.css') {
      htmlHandler.getCSS(request, response);
    }
    else if (parsedUrl.pathname === '/') {
      htmlHandler.getIndex(request, response);
    }
  };

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
    console.log(request.method + '\n' + parsedUrl);
   
    if (request.method === 'POST') {
      handlePost(request, response, parsedUrl);
    } else {
      handleGet(request, response, parsedUrl);
    }
  };


http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
  });