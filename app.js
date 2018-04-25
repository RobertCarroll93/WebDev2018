var express = require("express");
var app = express();

app.use(express.static("views")); // Allow access to views folder
app.use(express.static("scripts")); // Allow access to scripts folder
app.use(express.static("images")); // Allow access to images folder

var http = require('http');
var $ = require('jquery');
var bodyParser = require("body-parser");
var fs = require('fs');


app.set("view engine", "jade");

app.use(bodyParser.urlencoded({extended:true}));

var staff = require("./model/staff.json");

app.get('/', function(req, res){
  res.render("index"); 
  console.log("Hello World"); 
});

app.get('/index', function(req, res){
  res.render("index"); 
  console.log("Hello World"); 
});

app.get('/staff', function(req, res){
  res.render("staff",
    {staff:staff}
  ); 
  console.log("Staff page is now rendered"); 
});


app.get('/academic', function(req, res){
  res.render("academic"); 
  console.log("Academic Section page is now rendered"); 
});

app.get('/submitted', function(req, res){
  res.render("submitted"); 
  console.log("Submitted page is now rendered"); 
});

app.get('/contact', function(req, res){
  res.render("contact"); 
  console.log("Contact Us page is now rendered"); 
});

//This will render the show page which the contents of which come from the 
//buttom clicked on the staff page
app.get('/moreinfo/:name', function(req, res){
  
  function findStaff(which){
   return which.name === req.params.name;
  }
  
  console.log(staff.filter(findStaff)); //Shows in console the staff member that has bee selected
   var specpage = staff.filter(findStaff); //This function filters the staff members based on the parameters from findStaff
      console.log(specpage);
      res.render("moreinfo",
        {specpage:specpage}
      );
      
      console.log("Specific page has rendered");
});

//Function for calling add staff page

app.get("/add", function(req, res){
  res.render("add");
  console.log("Add page rendered");
});

//Finds out how many members of staff there are
app.post("/add", function(req,res){
  var count = Object.keys(staff).length;
  console.log(count);

  //Finds the current higheset ID
  function getMax(staff, id){
    var max;
    for(var i=0; i < staff.length; i++){
      if(!max || parseInt(staff[i][id]) > parseInt(max[id]))
        max = staff[i];
  }  
  return max;
}
  var maxStaff = getMax(staff, "id");
  var newId = maxStaff.id + 1;
  console.log(newId);
  
  
  var staffmember = {
    name: req.body.name,
    id: newId, 
    speciality: req.body.speciality,
    university: req.body.university,
    yearspractised: req.body.yearspractised,
    image: req.body.image
    
  };
  
  var json =JSON.stringify(staff); //or staffmember
  
    fs.readFile("./model/staff.json", "utf8", function readFileCallback(err, data){
      if(err){
        console.log("There is a problem");
      }
      else{
        staff.push(staffmember); //or staffmember
        json = JSON.stringify(staff, null, 4); // converts back to JSON and indents JSON file
        fs.writeFile("./model/staff.json", json, "utf8"); //writes to file
      }
    });
  res.redirect("/staff");
});

//For editing a member of staff

app.get("/edit/:name", function(req, res) {
   console.log("The edit page has been rendered");
   
   function chooseStaffmember(spec){
     return spec.name === req.params.name;
   }
   
   var spec = staff.filter(chooseStaffmember);
   
   res.render("edit", {  
              spec:spec}
              );
    console.log(spec);
}); 



app.post("/edit/:name", function(req, res){
  var json = JSON.stringify(staff);
  
  fs.readFile("./model/staff.json", "utf8", function readFileCallback(err, data){
    if(err){
      console.log("Something went wrong");
    }
    else{
      var key = req.params.name; //This calls the name from URL
      
      var stringstaff = staff;
      
      var data = stringstaff;
      
      var indexstaff = data.map(function(staffmember){
        return staffmember.name;
      }).indexOf(key);
      
     
      
      staff.splice(indexstaff, 1, {name: req.body.newname, speciality: req.body.newspeciality, 
      university: req.body.newuniversity, yearspractised: req.body.newyearspractised, image: req.body.newimage});
     
     json = JSON.stringify(staff, null, 4);
     
     fs.writeFile("./model/staff.json", json, "utf8");
     
      
    }
  });
  res.redirect("/staff");
});

//Delete functionality

app.get('/delete/:name', function(req, res) {
  var json = JSON.stringify(staff);
  fs.readFile('./model/staff.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
var key = req.params.name;
//cahnges the json to a variable
var string = staff; 
var data = string; //this declares data = string
var index = data.map(function(data) { return data['name']; }).indexOf(key) // Finds postition of data to be deleted http://jsfiddle.net/hxfdZ/
//The 1 means only one item will be deleted
staff.splice(index , 1); 
//Converts back into JSON
json = JSON.stringify(staff, null, 4);
// Writes back to file
fs.writeFile('./model/staff.json', json, 'utf8'); 
console.log("Staffmember has been deleted");
}});
res.redirect("/staff");
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("It's running!");
});