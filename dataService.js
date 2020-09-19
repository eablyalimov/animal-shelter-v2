var mongoose = require("mongoose");
require('dotenv').config();
var moment = require('moment');
var process = require('process');
//const slider = require("./js/slider.js");

var Schema = mongoose.Schema;

const counterSchema = new Schema({
    name: {type: String, index: true},
    petID: {type: Number}
})



var animalsObject = new Schema({
    "petID": Number,
    "animalType": String,
    "name": String,
    "sex": String,
    "birthDate": Date,
    "description": String,
    "postedDate": Date,
    "updatedDate": Date,
    "dateSinceInShelter": Date,
    "sprayedNeutred": Boolean,
    "imageURL": [String],
    "isAdopted": Boolean
});

var allPets; // global variable for accessing pets database
let counterVar;

module.exports.initialize = function()
{
    var URL = process.env.DB_URL;
    let dataBase = mongoose.connect(URL);
    dataBase.catch((err) => console.log("ERROR! " + err));
    allPets = mongoose.model('allPets', animalsObject);
    counterVar = mongoose.model('Counter', counterSchema);
    
     
    
}

function getSequenceID(name)
{
    return counterVar.findOneAndUpdate({name: name}, {$inc: {petID: 1}}, {new: true, upsert: true}).lean().exec().then((doc) => {
        return doc.petID})
}

function checkmarkToF(checkmark)
{
    return (checkmark == "on") ? true : false; 
}

module.exports.addPet = function(petParam)
{

    petParam.body.birthDate = moment(petParam.body.bday)
    petParam.body.postedDate = new Date();
    petParam.body.imageURL = [];
    for (i = 0; i < petParam.files.length; i++)
    {
        petParam.body.imageURL[i] = petParam.files[i].path;
    }
    
    petParam.body.isAdopted = false;
    petParam.body.sprayedNeutred = checkmarkToF(petParam.body.sprayedNeutredCheckbox);
    

    return new Promise((resolve, reject)=> 
    {

        for (var i = 0; i < 13; i ++)

        {
    getSequenceID("counter").then((id) =>{
        petParam.body.petID = id;
    }).then(()=>{
        var newPet = new allPets(petParam.body);
        newPet.save((err) => {
            if(err) {
                reject("There was an error saving the comment: " + err);
            }
            else
            {
                resolve();
            }
        });
    })
}
    }
)
}

module.exports.allPets = function(catOrDog)
{
    return new Promise((resolve, reject)=>
{
    allPets.find({isAdopted: false, animalType: catOrDog}).exec().then((data)=>
{
    for (var i = 0; i < data.length; i++)
    {
    data[i].age = moment(data[i].birthDate).toNow(true);
    }
    resolve(data);
})
})
}

module.exports.displayPet = function(petID)
{
    return allPets.find({
        petID: petID
    }).exec().then((animal)=>
{
    
        for (var i = 0; i < animal.length; i++)
        {
            animal[i].age = moment(animal[i].birthDate).toNow(true);
            animal[i].formattedPostedDate =  moment(animal[i].postedDate).format("MMMM Do YYYY");
            animal[i].formattedDateSinceInShelter = moment(animal[i].dateSinceInShelter).format("MMMM Do YYYY");
            
        }
    return animal[0];
})
}

module.exports.findPets = function(data)
{
    if (data.maxAge == 10)
    {

    if (data.sex == "Any")
    {
        return allPets.find({
                animalType: data.animalType,
                birthDate:
                {
                    $lt: moment().subtract(data.minAge , 'year')
                }
            }).exec().then((filteredData)=>
        {
            for (var i = 0; i < filteredData.length; i++)
            {
                filteredData[i].age = moment(filteredData[i].birthDate).toNow(true);
            }
                
            return filteredData;
        })
    }

    else
    {

       return allPets.find({
            animalType: data.animalType,
            sex: data.sex,
            birthDate:
            {
                $lt: moment().subtract(data.minAge , 'year')
            }
        }).exec().then((filteredData)=>
    {
        for (var i = 0; i < filteredData.length; i++)
            {
                filteredData[i].age = moment(filteredData[i].birthDate).toNow(true);
            }
        return filteredData;
    })
    } 
}

else
{
    if (data.sex == "Any")
    {
        return allPets.find({
                animalType: data.animalType,
                birthDate:
                {
                    $gt: moment().subtract(data.maxAge , 'year'),
                    $lt: moment().subtract(data.minAge , 'year')
                }
            }).exec().then((filteredData)=>
        {
            for (var i = 0; i < filteredData.length; i++)
            {
                filteredData[i].age = moment(filteredData[i].birthDate).toNow(true);
            }
                
            return filteredData;
        })
    }

    else
    {

       return allPets.find({
            animalType: data.animalType,
            sex: data.sex,
            birthDate:
            {
                $gt: moment().subtract(data.maxAge , 'year'),
                $lt: moment().subtract(data.minAge , 'year')
            }
        }).exec().then((filteredData)=>
    {
        for (var i = 0; i < filteredData.length; i++)
            {
                filteredData[i].age = moment(filteredData[i].birthDate).toNow(true);
            }
        return filteredData;
    })
    }   
}


}

module.exports.removePet = function(petID)
{
    return allPets.findOneAndRemove({petID: petID}).lean().exec();
}

module.exports.updatePet = function(data)
{
    data.sprayedNeutred = checkmarkToF(data.sprayedNeutredCheckbox);
    data.isAdopted = checkmarkToF(data.adoptedCheckbox);
    return allPets.findOneAndUpdate({petID: data.petID}, {name: data.name, sex: data.sex, birthDate: data.birthDate, dateSinceInShelter: data.dateSinceInShelter, description: data.description, isAdopted: data.isAdopted, sprayedNeutred: data.sprayedNeutred}, {returnOriginal: false, upsert: true}).lean().exec().then((result)=> {
        console.log(result)
        return result;
    })
}

module.exports.convertDate = function(date)
{
    return moment(date).format("YYYY-MM-DD")
}
