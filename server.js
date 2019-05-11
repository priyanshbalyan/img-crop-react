"use strict";
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const imguruploader = require('imgur-uploader');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({ limits: { fileSize: 1 * 1024 * 1024 }, safeFileNames: true, preserveExtension: true }));
app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "build")));

app.post('/upload', (req, res)=>{
    // console.log(req.body, req.files);
    
    imguruploader(req.files[0].data, {title:"test"}).then(data=>{
        res.status(200).json({status:"success", data: data});
    }).catch(err=>{
        console.log(err);
        res.json({status:"error", message:err.message});
    });
});

let API_PORT = process.env.PORT || 3001;

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));