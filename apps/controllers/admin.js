var express = require("express");
var router = express.Router();
var user_md = require("../models/user");
var post_md = require("../models/post");
var helper = require("../helpers/helper");
router.get("/",function(req,res){
    if(req.session.user){
        var data = post_md.getAllPosts();
        data.then(function(posts){
            var data = {
                posts:posts,
                error:false
            }
            res.render("admin/dashboard",{data:data});
        }).catch(function(err){
            res.render("admin/dashboard",{data:{error:"Get posts data is error!"}});
        });
       
    }else{
        res.redirect("/admin/signin");
    }
   
});
router.get("/signup",function(req,res){
    res.render("signup",{data:{}});
});
router.post("/signup",function(req,res){
    var user = req.body;
    if(user.email.trim().length == 0){
        res.render("signup",{data:{error:"Email is required"}});
    }
    if(user.passwd != user.repasswd && user.passwd.trim().length != 0){
        res.render("signup",{data:{error:"Password is not Match"}});
    }
    //Insert to database
    var password = helper.hash_password(user.passwd);
    user = {
        email: user.email,
        password:password,
        first_name:user.firstname,
        last_name:user.lastname,
    }
   var result =  user_md.addUser(user);
   result.then(function(data){
   res.redirect("/admin/signin");
   }).catch(function(err){
    res.render("signup",{data:{error:"Could not insert user data to DB"}});
   });
//    if(!result){
//        res.render("signup",{data:{error:"Could not insert user data to DB"}});
//    }else{
//        res.json({message:"Insert successfuly!"});
//    }

});
router.get("/signin",function(req,res){
    res.render("signin",{data:{}});
});
router.post("/signin",function(req,res){
    var params = req.body;
    if(params.email.trim().length == 0){
        res.render("signin",{data:{error:"Please enter an email"}});
    }else{
        var data = user_md.getUserByEmail(params.email);
        if(data){
            data.then(function(users){
                var user = users[0];
                var status = helper.compare_password(params.password,user.password);
                if(!status){
                    res.render("signin",{data:{error:"Password Wrong"}});
                }else{
                    req.session.user = user;
                    console.log(req.session.user);
                    res.redirect("/admin/");
                }
            });
        }else{
            res.render("signin",{data:{error:"User not exists"}});
        }
    }
});
router.get("/post/new",function(req,res){
    if(req.session.user){
        res.render("admin/post/new",{data:{error:false}});
    }else{
        res.redirect("/admin/signin");
    }
    
});
router.post("/post/new",function(req,res){
    var params = req.body;
    if(params.tittle.trim().length == 0){
        var data = {
            error: "Please enter title"
        };
        res.render("admin/post/new",{data:data});
    }else if(params.content.trim().length == 0){
        var data = {
            error: "Please enter content"
        };
        res.render("admin/post/new",{data:data});
    }else if(params.author.trim().length == 0){
        var data = {
            error: "Please enter author"
        };
        res.render("admin/post/new",{data:data});
    }
    else{
        var now = new Date();
        params.created_at = now;
        params.updated_at = now;
        var data = post_md.addPost(params);
        data.then(function(result){
            res.redirect("/admin");
        }).catch(function(err){
            var data = {
                error: "Could not insert post"
            };
            res.render("admin/post/new",{data:data});
        });
    }
   
});
router.get("/post/edit/:id",function(req,res){
    if(req.session.user){
        var params = req.params;
        var id = params.id;
        var data = post_md.getPostByID(id);
        if(data){
            data.then(function(posts){
                var post = posts[0];
                var data = {
                    post: post,
                    error:false
                };
                res.render("admin/post/edit",{data:data});
            }).catch(function(err){
                var data = {
                    error: "Could not get Post by ID"
                };
                res.render("admin/post/edit",{data:data});
            });
        }else{
            var data = {
                error: "Could not get Post by ID"
            };
            res.render("admin/post/edit",{data:data});
        }
    }else{
        res.redirect("/admin/signin");
    }

});
router.put("/post/edit",function(req,res){
    var params = req.body;
    data = post_md.updatePost(params);
    if(!data){
        res.json({status_code: 500});
    }else{
        data.then(function(result){
            res.json({status_code:200});
        }).catch(function(err){
            res.json({status_code : 500});
        });
    }
});
router.delete("/post/delete",function(req,res){
    var post_id = req.body.id;
    var data = post_md.deletePost(post_id);
    if(!data){
        res.json({status_code:500});
    }else{
        data.then(function(result){
            res.json({status_code:200});
        }).catch(function(err){
            res.json({status_code:500});
        });
    }
});
router.get("/post",function(req,res){
    if(req.session.user){
        res.redirect("/admin");
    }else{
        res.redirect("/admin/signin");
    }
    
});
router.get("/user",function(req,res){
    if(req.session.user){
        var data = user_md.getAllUsers();
        data.then(function(users){
            var data = {
                users:users,
                error:false
            };
            res.render("admin/user",{data:data});
        }).catch(function(err){
            var data = {
                error: "Could not get user info"
            };
            res.render("admin/user",{data:data});
        });
    }else{
        res.redirect("/admin/signin");
    }
   
});
module.exports = router;