"use strict";
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var path = require('path');

var target = 'http://substack.net/images/';

var pathname = path.dirname(target);


function scrape(targetUrl){
  request(targetUrl, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      
      $('tr').each(function(i, element){
        var permissions = $(this).find('td:first-child');
        var link = $(this).find('td').find('a');

        if (path.extname(link.text()) === '' || path.extname(link.text()) === '.'){
          if ((/\.\.\/$/).test(link.text())){
            return;
          } else {
          scrape(pathname + link.prop('href'));
          }
        } else {
          var results = [];
          results[0] = (permissions.text());
          results[1] = (pathname + link.prop('href'));
          results[2] = (path.extname(link.text()) + '\n');

          fs.appendFile('scraper.csv', results, 'utf8', function(err){
            if (err){
            console.log('error');
          } else {
            console.log('written');
          }
          });
        }   
        
      });
    }
  });
}
scrape(target);
