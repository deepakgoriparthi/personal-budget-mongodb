const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;
const cors = require('cors')

app.use(cors());
app.use('/',express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose')
const budgetModel = require('./model/schema')


let url = 'mongodb://127.0.0.1:27017/personal_budget';

app.get('/hello', (req,res) => {
    res.send('Hello World! This is Deepak');
});

app.get("/budget", (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected to database")
            // Fetch
            budgetModel.find({})
                .then((data) => {
                    res.send(data);
                    mongoose.connection.close();
                })
                .catch((connectionError) => {
                    console.log(connectionError);
                })
        })
        .catch((connectionError) => {
            console.log(connectionError);
        })
})


app.post("/addNewBudget", (req, res) => {

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            // Insert
            let myData = new budgetModel(req.body);
            budgetModel.insertMany(myData)
            .then((data)=>{

                res.send("Successfully entered the data")
                mongoose.connection.close();
            })
            .catch((connectionFailed)=>{
                res.send(connectionFailed.message)
            })
        })
        .catch((connectionFailed) => {
            res.send(connectionFailed);
        })
})

app.listen(port,()=>{
    console.log(`Server is currently running on port ${port}`);
});