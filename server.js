'use strict';

let fs = require('fs');
const users = JSON.parse(fs.readFileSync('users.json')); //Database file

let express = require('express');
let bodyParser = require('body-parser');
let app = express();

// Configure express settings
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json({limit: '10mb'}));

//Avoid CORS error
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// routes
app.get('/:id', function(req, res){
   let id = req.params.id;
   console.log("GET request received at /" + id);
   res.type('application/json');
   if (users.hasOwnProperty(id)){
      //If user exists Status code = 200
      res.status(200).send({ id: id, score: users[id]});
   }
   else{
      //If user doesn't exist Status code = 404
      res.status(404).send({});
   } 
});

app.post('/:id', function(req, res){
   let id = req.params.id;
   console.log("POST request received at /" + id);

   res.type('application/json');
   let score = Number(req.body.score);
   
   //If user already exists
   if (users.hasOwnProperty(id)){
      if (!score || score < 0){
         // Invalid score, Status 400, content {Error: String}
         res.status(400).send({ Error: "Invalid score"});

      }
      else{ //Update the user
         users[id] = score;
         var data = JSON.stringify(users, null, 2);
         fs.writeFile('users.json', data, function(err){
            //Couldn't write, Status 500, content {Error: String}
            if (err) res.status(500).send({ Error: err});

         });
         //User updated successfully, Status 200
         res.status(200).send({ id: id, score: users[id]});
      }
   }
   else{
      //User Created, Status 201 
      users[id] = score;
      let data = JSON.stringify(users, null, 2);
      fs.writeFile('users.json', data, function(err){
         //Couldn't write, Status 500, content {Error: String}
         if (err) res.status(500).send({ Error: err});
      });
      res.status(201).send({ id: id, score: users[id]});
   }
   
});

const port = process.env.port||3000;
app.listen(port, function(){
   console.log(`Server is running on port ${port}`);
});