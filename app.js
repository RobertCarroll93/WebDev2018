var express = require("express");
var app = express();

app.use(express.static("views")); // Allow access to views folder
app.use(express.static("scripts")); // Allow access to scripts folder
app.use(express.static("images")); // Allow access to images folder

app.set("view engine", "jade");

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
  specpage = staff.filter(findStaff); //This function filters the staff members based on the parameters from findStaff
      console.log(specpage)
      res.render("moreinfo",
        {specpage:specpage}
      );
      
      console.log("Specific page has rendered");
})





app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("It's running!");
});