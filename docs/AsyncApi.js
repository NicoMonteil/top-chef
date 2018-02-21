const fetch = require ('node-fetch');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

urlPage = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-';

let HRTab = new Array();

async function ScrapHRef()
{
  let page = 1;
  let anno = 0;
  let verif = true;
  while (verif)
  {
    let data = await fetch(urlPage+page.toString());
    let html = await data.text();
    let $ = await cheerio.load(html);
    anno--;
    if($ ('.srp-no-results-text').text().length > 10)
    {
      verif = false;
    }
    else
    {
      $('.poi-card-link').each(
        function()
        {
          HRTab[page-1+anno]=$(this).attr('href');
          console.log(HRTab[page-1+anno]);
          anno++;
        }
      )
      page++;
    }
  }
  console.log(HRTab.length);
  WriteJSON();
}

async function WriteJSON()
{
  var json = { title : "", address:"", postCode:""};

  for(var i=0; i<HRTab.length; i++)
  {
    let data = await fetch("https://restaurant.michelin.fr"+HRTab[i]);
    let html = await data.text();
    let $ = await cheerio.load(html);

    let title = $(".poi_intro-display-title").text().trim();
    json.title = title;

    let address = $(".thoroughfare").text().trim();
    json.address = address;

    let postCode = $(".postal-code").text().trim();
    json.postCode = postCode;

    fs.appendFile('output.json', JSON.stringify(json)+"\r\n", function(err){
        console.log('copy in output.json' + ' page: ' +  String(json.title));
      });
  }
}

ScrapHRef();
