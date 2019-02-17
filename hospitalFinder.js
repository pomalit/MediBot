var Promise = require('q').Promise;
var departs = require('./department.json');
var specialist = require('./specialist.json');
var unirest = require('unirest');

unirest.post("https://FacebookGraphAPIserg.osipchukV1.p.rapidapi.com/extendUserToken")
.header("X-RapidAPI-Key", "540ca8ff29msh48052af738b5fd5p1c2b20jsnc1989860a1d3")
.header("Content-Type", "application/x-www-form-urlencoded")
.end(function (result) {
  //console.log(result.status, result.headers, result.body);
});

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDl0Kp8DQszGIa-rpok_fT24B5UxRNmo6c'
});

function GetDepart(num)
{
  var departNo = specialist.filter(function (special) {return special.id==num});
  var departJp = departs.filter(function (depa) {return depa.num==departNo[0].depart});

//console.log(departJp[0].depart);
return departJp[0].depart;//obj;
}
/*
  googleMapsClient.placesNearby({
  language: 'en',
  location: [35.652596, 139.778982],
  radius: 10000,
  //opennow: true,
  type: 'hospital',
  keyword: GetDepart(1)

  }, function(err, response) {
  if (!err) {
    //console.log(response.json.results);
    console.log((response.json.results[0].geometry.location));
    //console.log(object.get("geometry"));

  }
  });
*/
function GetHospital(spec_No,lat,logi){
  googleMapsClient.placesNearby({
  language: 'en',
  location: [logi, lat],
  radius: 10000,
  //opennow: true,
  type: 'hospital',
  keyword: GetDepart(spec_No)

  }, function(err, response) {
  if (!err) {

    //console.log((response.json.results[0].geometry.location));

    console.log((response.json.results[0].name));
    //console.log(object.get("geometry"));
    return response.json.results;
  }
  });

}

module.exports = hospital

//GetHospital(1,35.652596, 139.778982);
