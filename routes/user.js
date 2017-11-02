var express = require('express'),
  router = express.Router(),
  blog = require('../models/user'),
  comment = require('../models/pendingTask');

  //advance function
var isJson = function(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return null;
    }
    if (item !== null) {
        return item;
    }
    return {};
}

// router.get('/users', function(req, res){
//   blog.find({}, function(err, blogs) {
//     if(err) {
//       res.status(500).send({
//         message: err,
//         data: []
//       });
//     } else {
//       res.status(200).send({
//         message: 'OK',
//         data: req.query
//       });
//     }
//   });
// });
router.post('/users', function(reg, res){
  var blogpost = {
    name: reg.body.name,
    email: reg.body.email,
  };

  if(blogpost.name == null || blogpost.email == null || blogpost.email == "" || blogpost.name == ""){
    res.status(500).send({
      message: "Email or Name cannot be null.",
      data: []
    });
    return;
  }

  blog.findOne({'email': blogpost.email }).count().exec(function(err, num){
    if(parseInt(num) != 0){
      res.status(500).send({
        message: "Email already exist.",
        num: parseInt(num),
        data: []
      });
    } else {
      blog.create(blogpost, function(err, blogs) {
        if(err) {
          res.status(404).send({
            message: err,
            data: []
          });
        } else {
          res.status(201).send({
            message: 'OK',
            data: blogs,
            num: num
          });
        }
      });
    }
  });
});

router.get('/users/:id', function(req, res){
  blog.findById(req.params.id, function(err, user) {
    if(err) {
      res.status(404).send({
        messag: err,
        data: []
      });
    } else {
      res.status(200).send({
        message: 'OK',
        data: user
      });
    }
  });
});

router.put('/users/:id', function(reg, res){
  var blogpost = {
    name: reg.body.name,
    email: reg.body.email,
    pendingTasks: reg.body.pendingTasks
  };

  if(blogpost.name == null || blogpost.email == null || blogpost.email == "" || blogpost.name == ""){
    res.status(500).send({
      message: "Email or Name cannot be null",
      data: []
    });
    return;
  }

  blog.findByIdAndUpdate(reg.params.id, blogpost, function(err, blogs) {
    if(err) {
      res.status(404).send({
        message: err,
        data: []
      });
    } else {
      res.status(201).send({
        message: 'OK',
        data: blogs
      });
    }
  });
});

//users/:id DELETE
router.delete('/users/:id', function(req, res){
 blog.findByIdAndRemove(req.params.id, function(err, blogs){
  if(err) {
            res.status(404).send({
               message: err,
               data: []
            });
        }else{
            res.status(201).send({
                message: 'resource deleted',
                data: []
            });
        }
    });
 });

// router.get('/:id/task', function(req, res){
//   comment.findById(req.params.id, function(err, task) {
//     if(err) {
//       res.status(500).send({
//         messag: err,
//         data: []
//       });
//     } else {
//       res.status(200).send({
//         message: 'OK',
//         data: task
//       });
//     }
//   });
// });

router.get('/tasks', function(req, res){
  var where = isJson(req.query.where);
  var sort = isJson(req.query.sort);
  var select = isJson(req.query.select);
  var skip = isJson(req.query.skip);
  var limit = isJson(req.query.limit);
  var count = req.query.count;

  if(count == '' || count == null || count == "false"){
    var ret = comment.find(where).select(select).sort(sort).skip(skip).limit(limit);
  } else {
    var ret = comment.find(where).select(select).sort(sort).skip(skip).limit(limit).count();
  }

  ret.exec(function(err, comment) {
    if(err) {
      res.status(500).send({
        message: err,
        data: []
      });
    } else {
      res.status(200).send({
        message: 'OK',
        data: comment,
        where: where,
        sort: sort,
        select: select,
        skip: skip,
        limit: limit,
        count: count
      });
    }
  });
});

router.post('/tasks', function(reg, res){
  var taskinfo = {
    name: reg.body.name,
    description: reg.body.description,
    deadline: reg.body.deadline,
    completed: reg.body.completed,
    assignedUser: reg.body.assignedUser,
    assignedUserName: reg.body.assignedUserName,
  };

  comment.create(taskinfo, function(err, task) {
    if(err) {
      res.status(500).send({
        message: err,
        data: []
      });
    } else {
      res.status(201).send({
        message: 'OK',
        data: task
      });
    }
  });
});

router.delete('/tasks/:id', function(req, res){
 comment.findByIdAndRemove(req.params.id, function(err, tasks){
  if(err) {
            res.status(404).send({
               message: err,
               data: []
            });
        }else{
            res.status(201).send({
                message: 'resource deleted',
                data: []
            });
        }
    });
 });

 router.get('/tasks/:id', function(req, res){
   comment.findById(req.params.id, function(err, task) {
     if(err) {
       res.status(404).send({
         messag: err,
         data: []
       });
     } else {
       res.status(200).send({
         message: 'OK',
         data: task
       });
     }
   });
 });

router.put('/tasks/:id', function(reg, res){
  var taskinfo = {
    name: reg.body.name,
    description: reg.body.description,
    deadline: reg.body.deadline,
    completed: reg.body.completed,
    assignedUser: reg.body.assignedUser,
    assignedUserName: reg.body.assignedUserName,
  };

   comment.findByIdAndUpdate(reg.params.id, taskinfo, function(err, blogs) {
     if(err) {
       res.status(404).send({
         message: err,
         data: []
       });
     } else {
       res.status(201).send({
         message: 'OK',
         data: blogs
       });
     }
   });
 });


router.post('/tasks/:id', function(req, res){
	var commentPost = {
		name: req.body.pendingTask.name
	};

	blog.findById(req.params.id, function(err, blog){
		if(err){
            res.status(500).send({
              	message: err,
              	data: []
            });
        }else{
		    comment.create(commentPost, function(err, comment){
				if(err){
		            res.status(500).send({
		              	message: err,
		              	data: []
		            });
		        }else{
		        	blog.pendingTasks.push(comment);
		            blog.save();
		            res.status(200).send({
		            	message: 'OK',
		            	data: comment
		            });
		        }
			  });
     }
	});
});

router.get('/users', function(req, res){
  var where = isJson(req.query.where);
  var sort = isJson(req.query.sort);
  var select = isJson(req.query.select);
  var skip = isJson(req.query.skip);
  var limit = isJson(req.query.limit);
  var count = req.query.count;

  if(count == '' || count == null || count == "false"){
    var ret = blog.find(where).select(select).sort(sort).skip(skip).limit(limit);
  } else {
    var ret = blog.find(where).select(select).sort(sort).skip(skip).limit(limit).count();
  }
  ret.exec(function(err, blogs) {
    if(err) {
      res.status(500).send({
        message: err,
        data: []
      });
    } else {
      res.status(200).send({
        message: 'OK',
        data: blogs,
        where: where,
        sort: sort,
        select: select,
        skip: skip,
        limit: limit,
        count: count
      });
    }
  });
});

module.exports = router;
