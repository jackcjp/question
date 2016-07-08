'use strict';

var mongoose = require('mongoose'),
  Questions = mongoose.model('Questions'),
  errorHandler = require('./errors'),
  index = require('../../dbconf/index'),
  querystring = require('querystring'),
  _ = require('lodash');

exports.index = function(req,res){
  res.render('index',{
    title: 'Question',
    content: 'The Question server is running with '+ (index.dbMode).charAt(0).toUpperCase()+ (index.dbMode).slice(1) +'~'
  });
};

// question create
exports.create = function(req,res){
  var question;
  // console.dir(req.body.question);
  if(req.body.question){
    question = new Questions(req.body);
  }else{
    return res.json({message: 'Question is null ~'});
  }
  index.operations(req.path,req.method,question,function(data,code){
    res.json(JSON.parse(data));
  });
};

// question read
exports.read = function(req,res){
  res.json(req.question);
};

// question list
exports.list = function(req,res){
  var searchCon = {}, count, limit, sort;
  if(req.query){
    if(req.query.question){
      searchCon.question_like = req.query.question;
    }
    if(req.query.level){
      searchCon.level = req.query.level;
    }
    if(req.query.restaurantId){
      searchCon.restaurantId = req.query.restaurantId;
    }
    if(req.query.count && req.query.limit){
      limit = req.query.limit;
      count = (req.query.count-1)*limit;
    }
    sort = req.query.sort ? req.query.sort : 'createdOn';
  }
  var _sort = '&_sort='+sort;
  var _limit = '&_limit='+limit;
  var path = req.path+'?'+querystring.stringify(searchCon)+_sort;
  if(limit)
    path = path+_limit;
  index.operations(path, req.method, '', function(data){
    res.json(JSON.parse(data));
  });
};

exports.update = function(req,res){
  var searchCon ={};
  var readyFile  = _.merge({},req.question, req.body);
  searchCon.question = readyFile.question;
  if(req.body){
    if(req.body.choice && req.question){
      var aaa = req.question.choice;
      var bbb = req.body.choice;
      //
      if(req.query.flag === 'remove'){
        readyFile.choice = _.omit(aaa, _.keys(bbb));
      }
    }
  }
  var pathVal = req.path.split('/');
  var path = '/'+pathVal[1]+'?'+querystring.stringify(searchCon);
  index.operations(path,'','',function(data,code){
    console.dir(JSON.parse(data));
    if(!JSON.parse(data).length){
      index.operations(req.path,'PUT',readyFile,function(data2,code){
        console.dir(data2); console.dir(code);
        res.json(JSON.parse(data2));
      });
    }else{
      if(JSON.parse(data)[0]._id === req.question._id){
        index.operations(req.path,'PUT',readyFile,function(data2,code){
          console.dir(data2); console.dir(code);
          res.json(JSON.parse(data2));
        });
      }else{
        return res.json({message: 'This question is existed!'});
      }
    }
  });
};

exports.delete = function(req,res){
  var question = req.question;
  index.operations(req.path, req.method, '', function(data,code){
    if(code ===200)
      res.json({ message:question._id + '  has been delete successfully !!!' });
  });
};

exports.questionById = function(req,res,next,id){
    index.operations(req.path, '', '', function(data,code){
      if (code === 404){
        return next(new Error('Failed to load the question'));
      }
      req.question = JSON.parse(data);
      next();
    });
};
