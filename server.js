var express = require('express');
var bodyParser = require('body-parser');
var dataService = require('./dataService.js')
const exphbs = require('express-handlebars');
const multer = require('multer');
const path = require('path');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: (lvalue, rvalue, options) => {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        trueFalse: (value, options) =>
        {
            if (value != true)
            {
                return options.inverse(this);
            }
            else{
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', 'hbs');
app.use(express.static("."));



const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, req.body.animalType + "-" + req.body.name + "-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
});


var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.get("/", (req, res) =>{
    res.render("home",
    { styleName: 'main-page-navbar-style'
}
)
});
app.get("/all-cats", (req, res)=>
{

    if(Object.keys(req.query).length == 0)
    {
        dataService.allPets("Cat").then((data)=> {
            data.title = "Our Cats"
            res.render("all-pets", {data: data, styleName: 'all-pets', petType: "Cats"})
            console.log("0 Strings");
        })

    }
    else if(Object.keys(req.query).length == 4)
    {
        dataService.findPets(req.query).then((data)=>
        {
            data.title = "Search Results";
            res.render("all-pets", {data: data, styleName: 'all-pets', petType: 'Cats', attr: req.query})
        }).catch((err) => console.error("ERROR! " + err))
    }
})



app.get("/all-dogs", (req, res)=>
{
    if(Object.keys(req.query).length == 0)

    {
        dataService.allPets("Dog").then((data)=> {
            data.title = "Our Dog"
            res.render("all-pets", {data: data, styleName: 'all-pets', petType: "Dogs"})
        })
    }

    else if(Object.keys(req.query).length == 4)
    {
        dataService.findPets(req.query).then((data)=>
        {
            data.title = "Search Results";
            res.render("all-pets", {data: data, styleName: 'all-pets', petType: 'Dogs', attr: req.query})
        }).catch((err) => console.error("ERROR! " + err))
    }
})


app.get("/search-results", (req, res)=>{

    dataService.findPets(req.query).then((data)=>
{
    data.title = "Search Results";
    res.render("all-pets", {data: data})
}).catch((err) => console.error("ERROR! " + err))
})

app.get("/search", (req, res)=>{
    res.render("search")
})
app.get("/add-pet", (req, res)=>{
    res.render("add-pet");
})

app.get("/pet/:petID", (req, res)=>
{
    dataService.displayPet(req.params.petID).then((data)=>{
        if (!data)
        {
            res.render("404-not-found", {title: "Pet not found in out database!"} );
        }
        else
        {
            res.render("pet", {data: data, styleName: "pet"})
        }
    })
})

app.get("/update-pet/:petID", (req, res)=>
{
    dataService.displayPet(req.params.petID).then((data)=>
{
    data.birthDateForm = dataService.convertDate(data.birthDate).toString();
    data.dateSinceInShelterForm = dataService.convertDate(data.dateSinceInShelter).toString();
    res.render("update-pet", {data: data});
})
})

app.get("/remove-pet/:petID", (req, res)=>
{
    dataService.removePet(req.params.petID).then(()=>
res.redirect('/all-pets')
)
})

dataService.initialize();
app.post("/add-pet", upload.array('animal-picture', 10), (req, res)=>
{
    dataService.addPet(req).then(()=>{
        res.redirect("/all-pets");
    }).catch((err)=>
{
    console.error(err);
})
})

app.post("/update-pet", (req, res)=>
{
    dataService.updatePet(req.body).then(()=>
{
    res.redirect("/all-pets");
})
})

app.use(function(req, res, next){
    res.status(404).render('404-not-found', {title: "Sorry, page not found"});
});

app.listen(HTTP_PORT, onHttpStart());
