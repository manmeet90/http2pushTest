const spdy = require("spdy");
const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();

app.use("/sw.js", (req, res, next) =>{
    console.log("request for service worker");
    
    /*fs.readFile(path.join(__dirname, "public/sw.js"), (err, data) =>{
        if(err){
            console.log(err);
        }else{
            res.set("Content-Type", "application/javascript");
            res.send(data);
        }
    });*/
    res.sendFile(path.join(__dirname, "public/sw.js"));
});
app.use("/", (req, res, next) => {
    res.set("cache-control", "max-age=3600");
    next();
});
// app.use(express.static("./public"));

app.get("/", (req, res, next) => {
    var stream = res.push('/src/person.js', {
        status: 200, // optional
        method: 'GET', // optional
        request: {
        accept: '*/*'
        },
        response: {
        'content-type': 'application/javascript'
        }
    });
    stream.on('error', function(err) {
        console.log(err);
    });
    fs.readFile(path.join(__dirname, "public/src/person.js"), (err, data) =>{
        if(err){
            console.log(err);
        }else{
            stream.end(data);
        }
    });
    
    var stream1 = res.push('/src/app.js', {
        status: 200, // optional
        method: 'GET', // optional
        request: {
        accept: '*/*'
        },
        response: {
        'content-type': 'text/javascript'
        }
    });
    stream1.on('error', function(err) {
        console.log(err);
    });
    fs.readFile(path.join(__dirname, "public/src/app.js"), (err, data) =>{
        if(err){
            console.log(err);
        }else{
            stream1.end(data);
        }
    });
    // stream1.end();
    next();
    // res.sendFile(__dirname+"/public/index.html");
});

app.use(express.static("./public"));


let options = {
    "key" : fs.readFileSync(`${__dirname}/server.key`),
    "cert": fs.readFileSync(`${__dirname}/server.crt`)
};

spdy.createServer(options, app).listen(3000, () => {
    console.log("server started at https://localhost:3000/");
});