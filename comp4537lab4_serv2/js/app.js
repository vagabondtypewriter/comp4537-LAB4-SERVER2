const http = require('http');
const url = require('url');
const querystring = require('querystring');

let dictionary = [];
let totalRequests = 0; 

function handleGETRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/search') {
        const term = parsedUrl.query.term;
        const result = dictionary.find(entry => entry.word === term);
        if (result) {
            totalRequests++;
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ 
                word: result.word,
                definition: result.definition,
                requestNumber: result.requestNumber,
                totalEntries: dictionary.length, 
                totalRequests: totalRequests 
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
            res.end(`Word '${term}' not found.`);
        }
    } else {
        // Handle other endpoints
        res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        res.end('Endpoint not found.');
    }
}

// Function to handle POST requests
function handlePOSTRequest(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const word = data.word;
            const definition = data.definition;

            if (word && definition) {
                totalRequests++;
                const existingWordIndex = dictionary.findIndex(entry => entry.word === word);
                if (existingWordIndex !== -1) {
                    res.writeHead(400, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
                    res.end('Word already exists in the dictionary.');
                } else {
                    const requestNumber = totalRequests; // Use totalRequests as request number
                    dictionary.push({ word, definition, requestNumber });
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.end(JSON.stringify({ 
                        definition: definition,
                        totalRequests: totalRequests,
                        totalEntries: dictionary.length
                    }));
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
                res.end('Invalid data. Both word and definition are required.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.writeHead(400, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
            res.end('Invalid JSON data.');
        }
    });
}

function handleOptionsRequest(req, res) {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
}

const server = http.createServer((req, res) => {
    const method = req.method;
    if (method === 'GET') {
        handleGETRequest(req, res);
    } else if (method === 'POST') {
        handlePOSTRequest(req, res);
    } else if (method === 'OPTIONS') {
        handleOptionsRequest(req, res);
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        res.end('Method not allowed.');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
