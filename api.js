var unirest = require('unirest');

var symptomsAll; // All symptoms
var bodyParts;
//=============================Only Once========================================
unirest.get("https://priaid-symptom-checker-v1.p.rapidapi.com/body/locations?language=en-gb")
.header("X-RapidAPI-Key", "88542d2bf5msh158655977701432p1933aajsnae0ab2fea047")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
  bodyParts = result.body;
}); // Get Body Parts
//============================For Every Visitor============================
//Get gender and age
var gender = 'Male'; // or 'Female'
var birthYear = 1984;
var symptomsID = new Array(); // symptoms of specific person
var partID;
var subPartID;
var bodySubParts; // Tried to add it to global, but not good

function test(){
  console.log(bodyParts); //Show them to user
  partID = 7; // Get input
  unirest.get(`https://priaid-symptom-checker-v1.p.rapidapi.com/body/locations/${partID}?language=en-gb`)
.header("X-RapidAPI-Key", "88542d2bf5msh158655977701432p1933aajsnae0ab2fea047")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
  bodySubParts = result.body;// Show them to user
  subPartID = 30; // Get input
});
}
function test2(){
  unirest.get(`https://priaid-symptom-checker-v1.p.rapidapi.com/symptoms/${subPartID}/man?language=en-gb`)
  .header("X-RapidAPI-Key", "88542d2bf5msh158655977701432p1933aajsnae0ab2fea047")
  .end(function (result) {
    console.log(result.status, result.headers, result.body);
  }); // Get all possible symptoms

}
setTimeout(test, 2000);
setTimeout(test2, 4000);


//==========Reader
/*
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`What's your symptoms?`, (name) => {  // ask QUESTION
  var picked = symptoms.find(o => o.Name === name);
  symptomsID.push(picked.ID); // Add symptom to the array
  console.log(symptomsID);
  readline.close() // Reader closes

  /*unirest.get(`https://priaid-symptom-checker-v1.p.rapidapi.com/diagnosis?symptoms=${symptomsID}&gender=${gender}&year_of_birth=${birthYear}&language=en-gb`)
.header("X-RapidAPI-Key", "88542d2bf5msh158655977701432p1933aajsnae0ab2fea047")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});                 //Get diagnosis
});*/
