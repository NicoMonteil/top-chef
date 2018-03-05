const fetch = require ('node-fetch');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

urlPage = 'https://m.lafourchette.com/api/restaurant-prediction?name='

let object = new Array();

fs.readFile('output2.json', 'utf8', async function(err, data)
{
  object = JSON.parse(data);
  for (var i = 0; i < object.length; i++) {
    let data = await fetch(urlPage+object[i]['title']);
    let html = await data.text();
    let tab = JSON.parse(html);
    if (html.length>5) {
      for (var j = 0; j < tab.length; j++) {
        console.log(tab[j]);
        if(tab[j]['address']['postal_code'] == object[i]['postCode'])
        {
          console.log("/"+object[i]['title']+"/"+tab[j]['id']);
            fs.appendFile('id_restaurant.json', JSON.stringify("/"+object[i]['title']+"/"+tab[j]['id'])+",\r\n", function(err){
              });
        }
      }
    }
  }
});
