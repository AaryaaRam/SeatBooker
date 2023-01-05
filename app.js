const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const e = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var bool="false";
let beforelogin={
  div1:"Login",
  div2:"Signup",
  div1route:"/login",
  div2route:"/signup"
}
let afterlogin={
  div1:"Profile",
  div2:"Logout",
  div1route:"/profile",
  div2route:"/logout"
}
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});


var display=[];
var username="";

app.get("/", function (req, res) {
  if(bool=="true") {
    res.render("home",{div1:afterlogin.div1,div2:afterlogin.div2,div1route:afterlogin.div1route,div2route:afterlogin.div2route});
  } else{
  res.render("home",{div1:beforelogin.div1,div2:beforelogin.div2,div1route:beforelogin.div1route,div2route:beforelogin.div2route})
  }
});

app.post("/signup", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let sql ="INSERT INTO login (email,password) VALUES ('" +email +"','" +password +"')";
  let sqlcheck = `SELECT email FROM login WHERE email="` + email + `"`;
  con.query(sqlcheck, function (errcheck, resultcheck) {
    if (resultcheck[0] != undefined) {
     console.log("The username and password already exists");
      res.redirect("error");
    } else {
        con.query(sql, function (err, result) {
            console.log("Registered Successfully");
            res.redirect("/success");
          });
    }
  });
});
app.post("/login", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let sql = 'select `password` from login where email="' + email + '"';
  con.query(sql, function (err, result) {
    if (result[0] == undefined) {
      console.log("the account that you entered does not exist");
      res.redirect("/error");
    } else if (result[0].password == password) {
      bool="true";
      username=email;
      res.redirect("/profile");
    } else {
        console.log("the password that you have entered is wrong");
      res.redirect("/error");
    }
  });
});
app.get("/logout",function(req,res){
  bool="false";
  username="";
  res.redirect("/login");
})
app.get("/profile",function(req,res){
  if(bool=="true") {
    res.render("profile",{div1:afterlogin.div1,div2:afterlogin.div2,div1route:afterlogin.div1route,div2route:afterlogin.div2route,username:username})
} else{
  res.redirect("/login");
}
})

let sq=" SELECT \
`match`.`matchid`,`match`.`teama`,`match`.`teamb`,`match`.`date`,`match`.`time`,`stadium`.`stadium_name`,`stadium`.`city`,`stadium`.`country`,`stadium`.`capacity`,`in`.`ticket_fare`\
FROM \
`in`\
INNER JOIN \
`stadium` \
ON\
`in`.`stadium_name`=`stadium`.`stadium_name`\
INNER JOIN \
`match`\
ON\
`in`.`matchid`=`match`.`matchid`;";
con.query(sq,function(err,result){
      display=result;
});
app.get("/booktickets",function(req,res){


  if(bool=="true"){
    res.render("booktickets",{div1:afterlogin.div1,div2:afterlogin.div2,div1route:afterlogin.div1route,div2route:afterlogin.div2route,display:display})
  } else{
    res.render("booktickets",{div1:beforelogin.div1,div2:beforelogin.div2,div1route:beforelogin.div1route,div2route:beforelogin.div2route,display:display}) 
  }
})


app.get("/booktickets/:matchid",function(req,res){
    let id=req.params.matchid;
    let dis=display[id-1];
    let numofseats=dis.capacity;
    if(bool=="true"){
      let s="select sum(num_of_seats) as sum\
      from `order` \
      where matchid="+id;
      con.query(s,function(err,result){
        if(result[0]!=undefined){
        numofseats=numofseats-result[0].sum;  
        }
        res.render("book",{div1:afterlogin.div1,div2:afterlogin.div2,div1route:afterlogin.div1route,div2route:afterlogin.div2route,display:dis,username:username,numofseats:numofseats})
      })
  }else{
    res.redirect("/login");
  }
});


app.post("/checkout/:matchid",function(req,res){
if(bool=="true"){
  let id=req.params.matchid;
  let dis=display[id-1];
  let numofseatsbuy=req.body.numofseatsbuy;
  res.render("checkout",{display:dis,numofseatsbuy:numofseatsbuy})
} else{
  res.redirect("/login")
}
})

app.get("/signup", function (req, res) {
  if(bool=="true"){
    res.redirect("/profile");
  } else{
  res.render("signup",{div1:beforelogin.div1,div2:beforelogin.div2,div1route:beforelogin.div1route,div2route:beforelogin.div2route});
  }
});
app.get("/login", function (req, res) {
  if(bool=="true") {
    res.redirect("/profile");
  } else{
  res.render("login",{div1:beforelogin.div1,div2:beforelogin.div2,div1route:beforelogin.div1route,div2route:beforelogin.div2route});
  }

});
app.post("/success/:matchid",function(req,res){
  if(bool=="true"){
    let name=req.body.name;
    let phonenum=req.body.phonenum;
    let id=req.params.matchid;
    let dis=display[id-1]
    let numofseats=req.body.numofseats;
    let password=req.body.password;
    let sql = 'select `password` from login where email="' + username + '"';
    con.query(sql, function (err, result) {
      if (result[0].password != password) {
          console.log("the password that you have entered is wrong");
        res.redirect("/error");
      } else{
        let sqli='insert into `order` (select UUID(),"'+name+'","'+phonenum+'","'+username+'",'+id+','+numofseats+')';
        con.query(sqli,function(err,result){
          
          res.render("successfull",{name:name,phonenum:phonenum,email:username,numofseats:numofseats,display:dis});
    });
  }
    });

      
  }else{
    res.redirect("/login")
  }
})

app.get("/registration",function(req,res){
  if(bool==true){
    res.render("registration");
  } else{
    res.redirect("/login")
  }
})


app.get("/error", function (req, res) {
  res.render("error");
});
app.get("/success", function (req, res) {
  res.render("success");
});
// app.get("/contactus", function (req, res) {
//   res.render("contactus");
// });
app.post("/success", function (req, res) {
  res.redirect("/login");
});
app.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});


