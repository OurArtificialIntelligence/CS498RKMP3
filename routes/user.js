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
    pendingTasks: []
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
  var where = isJson(req.query.where);
  var sort = isJson(req.query.sort);
  var select = isJson(req.query.select);
  var skip = isJson(req.query.skip);
  var limit = isJson(req.query.limit);
  var count = req.query.count;
  //
  // blog.findById(req.params.id, function(err, user) {
  //   if(count == '' || count == null || count == "false"){
  //     var ret = user.find(where).select(select).sort(sort).skip(skip).limit(limit);
  //   } else {
  //     var ret = user.find(where).select(select).sort(sort).skip(skip).limit(limit).count();
  //   }
  //
  //   if(err) {
  //     res.status(404).send({
  //       messag: err,
  //       data: [],
  //     });
  //   } else {
  //     res.status(200).send({
  //       message: 'OK',
  //       data: ret,
  //       where: where,
  //       sort: sort,
  //       select: select,
  //       skip: skip,
  //       limit: limit,
  //       count: count
  //     });
  //   }
  // });

  if(count == '' || count == null || count == "false"){
    var ret = blog.findById(req.params.id).find(where).select(select).sort(sort).skip(skip).limit(limit);
  } else {
    var ret = blog.findById(req.params.id).find(where).select(select).sort(sort).skip(skip).limit(limit).count();
  }
  ret.exec(function(err, blogs) {
    if(err) {
      res.status(500).send({
        message: err,
        data: []
      });
    } else {
      if(blogs == null || blogs == ''){
        res.status(404).send({
          message: 'User not found.',
          data: blogs
        });
      } else {
        res.status(200).send({
          message: 'OK',
          data: blogs[0],
          where: where,
          sort: sort,
          select: select,
          skip: skip,
          limit: limit,
          count: count
        });
      }
    }
  });
});

router.put('/users/:id', function(reg, res){
  var name = reg.body.name;
  var email = reg.body.email;
  var pendingTasks = reg.body.pendingTasks;

  if(name == null || email == null || email == "" || name == ""){
    res.status(500).send({
      message: "Email or Name cannot be null",
    });
    return;
  }

  var blogpost = pendingTasks == "" || pendingTasks == null ? {
                                        name: name,
                                        email: email
                                      } : {
                                        name: name,
                                        email: email,
                                        pendingTasks: pendingTasks
                                      };

  // blog.findByIdAndUpdate(reg.params.id, blogpost, function(err, blogs) {
  //   if(err) {
  //     res.status(404).send({
  //       message: err,
  //       data: []
  //     });
  //   } else {
  //     res.status(200).send({
  //       message: 'OK',
  //       data: blogs
  //     });
  //   }
  // });

  blog.findOne({'email': blogpost.email }).count().exec(function(err, num){
    if(parseInt(num) != 0){
      res.status(500).send({
        message: "Email already exist.",
        num: parseInt(num),
        data: []
      });
    } else {
      blog.findByIdAndUpdate(reg.params.id, blogpost, function(err, blogs) {
        if(err) {
          res.status(404).send({
            message: err,
            data: []
          });
        } else {
          res.status(200).send({
            message: 'OK'
          });
        }
      });
    }
  });
});

//users/:id DELETE
router.delete('/users/:id', function(req, res){
 blog.findByIdAndRemove(req.params.id, function(err, blogs){
  if(err){
    res.status(404).send({
       message: err,
       data: []
    });
    } else {
      if(blogs == null){
        res.status(404).send({
          message: 'User not found.',
          data: blogs
        });
      } else {
        res.status(200).send({
            message: 'resource deleted',
            data: blogs
        });
       }
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

  if(taskinfo.name == null || taskinfo.deadline == null || taskinfo.name == "" || taskinfo.deadline == ""){
    res.status(500).send({
      message: "Task name or deadline cannot be null.",
    });
    return;
  }

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
          if(tasks == null){
            res.status(404).send({
              message: 'Task not found.',
            });
          } else {
            res.status(200).send({
                message: 'resource deleted',
                data: tasks
            });
          }
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
       if(task == null){
         res.status(404).send({
           message: 'Task not found.',
         });
       } else {
         res.status(200).send({
           message: 'OK',
           data: task
         });
       }
     }
   });
 });

router.put('/tasks/:id', function(reg, res){

  var data = reg.body;
  if(data.name == null || data.deadline == null || data.name == "" || data.deadline == ""){
    res.status(500).send({
      message: "Task name or deadline cannot be null.",
    });
    return;
  }

  var taskinfo = {
    name: data.name,
    //description: reg.body.description,
    deadline: data.deadline
    // completed: reg.body.completed,
    // assignedUser: reg.body.assignedUser,
    // assignedUserName: reg.body.assignedUserName,
  };

  if("description" in data){
    taskinfo.description = reg.body.description;
  }

  if("completed" in data){
    taskinfo.completed = reg.body.completed;
  }

  if("assignedUser" in data){
    taskinfo.assignedUser = reg.body.assignedUser;
  }

  if("assignedUserName" in data){
    taskinfo.assignedUserName = reg.body.assignedUserName;
  }

  comment.findByIdAndUpdate(reg.params.id, taskinfo, function(err, blogs) {
     if(err) {
       res.status(404).send({
         message: err,
         data: []
       });
     } else {
       res.status(200).send({
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
