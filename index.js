const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylujz.mongodb.net/registrationForm?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

client.connect(err => {
  const volunteerCollection = client.db("registrationForm").collection("registeredVolunteers");
  const eventsCollection =  client.db("registrationForm").collection("events");
  app.post('/addVolunteers', (req, res) => {
      const volunteerData = req.body;
      volunteerCollection.insertOne(volunteerData)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  
  app.get('/registeredUserInfo', (req, res) => {
    volunteerCollection.find({email: req.query.email})
    .toArray( (err, documents) =>{
      res.send(documents);
    })
  })

  app.delete('/delete/:id', (req, res) =>{
    volunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.redirect('/');
    })
  })


  app.get('/showRegisters', (req, res) => {
    volunteerCollection.find({})
    .toArray( (err, documents) =>{
      res.send(documents);
    })
  })

  app.get('/events', (req, res) => {
    eventsCollection.find({})
    .toArray( (err, documents) =>{
      res.send(documents);
    })
  })
  app.get('/eventDetails/:id', (req,res) =>{
    eventsCollection.find({id: req.params.id})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

});

app.listen(process.env.PORT || 5000)
