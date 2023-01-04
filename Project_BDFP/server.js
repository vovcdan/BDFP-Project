var express = require('express');
var path = require("path");
var bodyParser = require("body-parser");
var mongo = require("mongoose");

var db = mongo.connect("mongodb+srv://admin:scrouigraph56987@cluster0.ixzbuex.mongodb.net/?", function(err, response) {
    if(err) { console.log( err);}
    else{ console.log('Connected to' + db, '+', reponse);}

});

var app = express();
app.use(bodyParser());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));

app.use(function (req, res, next) {
    res.setHeader('Acces-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Acces-Control-Allow-Headers', 'X-Requested-Width,content-type');
    res.setHeader('Acces-Control-Allow-Credentials', true);
    next();
});

var Shema = mongo.Schema;

var Userschema = new Schema ({
    name: { type: String
                           },
    address: { type: String
                              },
   },{ versionKey: false });

var model = mongo.model( 'users', UsersSchema, 'users');

app.post("/api/SaveUser", function(req, res){
var mod = new model(req.body);
if(req.body.mode == "Save") 
{
    mod.save(function(err, data) {
        if(err) {
            res.send(err);
        }
        else {
            res.send({data:"Record has been Inserted..!!"});
        }
    });
}
else
{
    model.findByIdAndUpdate(req.body.id, { name: req.body.name, adress: req.body.address},  
    function(err, data) {
        if(err) {
            res.send(err);
        }
        else {
            res.send({data:"Record has been updated..!!"});
        }
    });
}
})


app.post("/api/deleteUser", function(req,res) {
    model.remove({ _id: req.body.id }, function(err) {
        if(err) {
            res.send(err);
        }
        else {
            res.send({data:"Record has been Deleted..!!"});
        }
    });
})

