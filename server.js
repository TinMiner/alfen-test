// ALFEN TECH TEST
const express = require('express')
const app = express()
const port = 3005
var path = require('path');
var noBots = require('express-nobots');
const fs = require('fs');

var file;

app.use(noBots());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    // res.send('submitted')
    let file

    try {
        file = fs.readFileSync('./index.html');
    } catch (e) {
        res.writeHead(404, {
            'content-type': 'text/plain'
        });
        res.write('404 File Not Found!');
        res.end();
        return;
    }

    if (file) {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write(file);
        res.end();
    }

    /*******GETS THE FORM DATA************/
    req.on('data', (data) => {
        var arr = decodeURIComponent(data).replace(/\+/g, ' ')
            .replace('UserName=', '')
            .replace('Email=', '')
            .replace('message=', '')
            .replace('submit=', '').split('&');

        let name = arr[0]
        let email = arr[1]
        let message = arr[2]
        let subscribe = arr[3]
        //console.log(name)
        //console.log(email)
        //console.log(message)
        //console.log(subscribe)

        //var node = json.head;

        function loadJSON(filename = '') {
            return JSON.parse(
                fs.existsSync(filename) ?
                fs.readFileSync(filename).toString() :
                '""'
            )
        }

        function saveJSON(filename = '', json = '""') {
            return fs.writeFileSync(filename, JSON.stringify(json, null, 2))
        }

        const arraydata = loadJSON('./data/array.txt')
        // of course in memory databases are available for small scale apps	
        arraydata.customer.unshift(subscribe);
        arraydata.customer.unshift(message);
        arraydata.customer.unshift(email);
        arraydata.customer.unshift(name);

        saveJSON('./data/array.txt', arraydata)
    })
})

app.get('/customerlist', function(req, res) {

    fs.readFile('customerlist.html', function(err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        function loadJSON(filename = '') {
            return JSON.parse(
                fs.existsSync(filename) ?
                fs.readFileSync(filename).toString() :
                '""'
            )
        }

        const arraydata = loadJSON('./data/array.txt')

        var newArr = arraydata.customer.map(function(val, index) {
            return {
                key: index,
                value: val
            };
        })

        //console.log(newArr) 

        var i;
        var customers = [];

        for (i = 0; i < arraydata.customer.length; i++) {
            customers[i] = arraydata.customer[i] + '<br>'
        }
        subtitle = '<h3>client needs</h3>'
        data = data + customers
        res.write(data);
        return res.end();
    });
})

app.listen(port, () => console.log(`Alfen app listening at http://localhost:${port}`))