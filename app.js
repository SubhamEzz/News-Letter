const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();
app.use(express.static(__dirname));

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){

  res.sendFile(__dirname+"/singup.html");
});

app.post("/",function(req,res){
  const firstName = req.body.fname;
  const lastName  = req.body.lname;
  const email     = req.body.email;

  var data = {
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/116430a359";
  const option = {
    method:"POST",
    auth:"Subham:a313bd8a9360317833870bded625bcf4-us6"
  }
  const request =  https.request(url,option,function(response){


     if(response.statusCode===200){
       res.sendFile(__dirname+"/succes.html");
     }
     else res.sendFile(__dirname+"/failure.html");


     response.on("data",function(data){
       console.log(JSON.parse(data));
     })
  })

    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT||5000,function(){
  console.log("Server at 5000 port started");
});
