'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'), http = require('http');

exports.checkTokeninUrl = function(req, res, next) {
  // the check method need to write
  console.dir('the checkTokeninUrl method need to add!!!');
  req.user = {
    'id' : mongoose.Types.ObjectId(req.query.user)
  };
  next();
};

exports.checkTokeninBody = function(req, res, next) {
  // the check method need to write
  console.dir('the checkTokeninBody method need to add!!!');
  req.user = {
    'id' : mongoose.Types.ObjectId(req.body.user)
  };
  next();
};

function handleImage(num, count, temp, imageBack, req, res){
  count.push(num);
  if(count.length === req.body.length){
    for (var z in temp) {
      for (var m in imageBack) {
        if (temp[z].imageName === imageBack[m].image) {
          if (temp[z].buildEnd === imageBack[m].latestBuild) {
            imageBack.splice(m,1);
            break;
          } else {
            imageBack[m].image = temp[z].image;
            delete imageBack[m].latestBuild;
            break;
          }
        }
      }
    }
    res.json(imageBack);
  }
}

function callback(req, num, temp, imageBack, hostname, imageName, count, res) {
    var body = '', url = 'http://' + hostname + '/v2/' + imageName + '/tags/list', httprequest;
    httprequest = http.get(url, function(response) {
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        if(JSON.parse(body).errors){
          console.dir(JSON.parse(body).errors);
          var errorDetail = JSON.parse(body).errors[0].detail.name;
          for(var x in temp){
            if(errorDetail === temp[x].imageName){
              temp.splice(x,1);
            }
          }
          handleImage(num, count, temp, imageBack, req, res);
        }else{
          // console.dir('222222222222222');
          var images = JSON.parse(body);
          var tagsTemp = [];
          for (var i in images.tags) {
            var prebuild = images.tags[i].split('-');
            if (prebuild.length === 2) {
              if (!isNaN(prebuild[1])) {
                tagsTemp.push({
                  versionBuild : images.tags[i],
                  build : prebuild[1]
                });
              }
            }
          }
          tagsTemp = tagsTemp.sort(function(a, b) {
            return a.build - b.build;
          });
          var returnVal = {
            latestBuild : tagsTemp[tagsTemp.length - 1].build,
            image : images.name,
            versionBuild : tagsTemp[tagsTemp.length - 1].versionBuild
          };
          imageBack.push(returnVal);
          handleImage(num, count, temp, imageBack, req, res);
        }
      });
      response.on('error', function (error) {
        console.log('get error: ' + error.message);
        handleImage(num, count, temp, imageBack, req, res);
      });
    }).on('error', function(e) {
      console.log('get error: ' + e.message);
      var errorDetail = e.hostname;
      for(var y in temp){
        if(errorDetail === temp[y].hostname){
          temp.splice(y,1);
        }
      }
      handleImage(num, count, temp, imageBack, req, res);
    });
}

// check for updating or not
exports.checkForUpdate = function(req, res) {
  var imageBack = [],temp = [],count = [];
  for (var i in req.body) {
    var imageObj = req.body[i];
    if (!imageObj) {
      console.dir({message: 'Bad image !!!'});
      handleImage(i, count, temp, imageBack, req, res);
      continue;
    }
    if (!imageObj.image) {
      console.dir({message: 'Bad image !!!'});
      handleImage(i, count, temp, imageBack, req, res);
      continue;
    }
    if (!imageObj.buildEnd) {
      console.dir({message: 'Bad image !!!'});
      handleImage(i, count, temp, imageBack, req, res);
      continue;
    }
    var image = imageObj.image, preImage = image.split('/');
    if (preImage.length !== 2) {
      console.dir({message: 'Bad image !!!'});
      handleImage(i, count, temp, imageBack, req, res);
      continue;
    }
    var hostname = preImage[0], imageName = preImage[1];
    temp.push({
      image : image,
      buildEnd : imageObj.buildEnd,
      imageName : imageName,
      hostname : hostname
    });
    callback(req, i, temp, imageBack, hostname, imageName, count, res);
  }
};

