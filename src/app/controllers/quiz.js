'use strict';

var mongoose = require('mongoose'),
  Quizzes = mongoose.model('Quizzes'),
  errorHandler = require('../../app/controllers/errors'),
  querystring = require('querystring'),
  index = require('../../dbconf/index'),
  _ = require('lodash');

exports.index = function(req,res){
  res.render('index',{
    title: 'Quizzes',
    content: 'The Quizzes server is running with '+ (index.dbMode).charAt(0).toUpperCase()+ (index.dbMode).slice(1) +'~'
  });
};

exports.create = function(req,res){
  var searchCon = {};
  var quiz = new Quizzes(req.body);
  searchCon.title = quiz.title;
  var path = req.path+'?'+querystring.stringify(searchCon);
  index.operations(path,'','',function(data,code){
  console.dir(JSON.parse(data));
    if(!JSON.parse(data).length){
      index.operations(req.path,'',quiz,function(returnData){
        res.json(JSON.parse(returnData));
      });
    }else{
      return res.json({message: 'This question is existed!'});
    }
  });
};

exports.read = function(req,res){
  res.json(req.quiz);
};

exports.list = function(req,res){
  var searchCon = {},sort,count,limit;
  if(req.query){
    if(req.query.title){
      searchCon.title_like = req.query.title;
    }
    if(req.query.job_id){
      searchCon.job_id = req.query.job_id;
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
  index.operations(path,req.method,'',function(data){
    res.json(JSON.parse(data));
  });
};

exports.update = function(req,res){
  var searchCon = {};
  var readyVal = _.merge({},req.quiz,req.body);
  searchCon.title = readyVal.title;
  if(req.body){
    if(req.body.question_list && req.quiz){
      var aaa = req.quiz.question_list;
      var bbb = req.body.question_list;
      // readyVal.question_list = aaa.concat(bbb);
      for(var i in bbb){
        aaa.push(bbb[i]);
        aaa = _.uniq(aaa);
      }
      if(req.query.flag === 'remove'){
        _.remove(aaa, function(n){
          for(var i in bbb){
            return n === bbb[i];
          }
        });
      }
      readyVal.question_list = aaa;
    }
  }
  var pathVal = req.path.split('/');
  var path = '/'+pathVal[1]+'?'+querystring.stringify(searchCon);
  index.operations(path,'','',function(data,code){
    console.dir(JSON.parse(data));
    if(!JSON.parse(data).length){
      index.operations(req.path,'PUT',readyVal,function(data){
        res.json(JSON.parse(data));
      });
    }else{
      if(JSON.parse(data)[0]._id === req.quiz._id){
        index.operations(req.path,'PUT',readyVal,function(data){
          res.json(JSON.parse(data));
        });
      }else{
        return res.json({message: 'This question is existed!'});
      }
    }
  });
};

exports.delete = function(req,res){
  var quiz = req.quiz;
  index.operations(req.path,req.method,'',function(data,code){
    if(code === 200)
      res.json({ message:quiz._id + '  has been delete successfully !!!' });
  });
};

exports.quizById = function(req,res,next,id){
  index.operations(req.path,'','',function(data,code){
    if(code === 404){
      return next(new Error('Failed to load the quiz'));
    }
    req.quiz = JSON.parse(data);
    next();
  });
};
