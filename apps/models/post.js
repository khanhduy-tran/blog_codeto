var q = require("q");
var db = require("../common/database");
var conn = db.getConnection();

function getAllPosts(){
    var defer = q.defer();
        var query = conn.query("select * from posts", function(err,posts){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
}
function addPost(params){
    if(params){
        var defer = q.defer();
        var query = conn.query("insert into posts set ?",params, function(err,result){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}
function getPostByID(id){
    var defer = q.defer();
    var query = conn.query("select * from posts where ?",{id:id}, function(err,posts){
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(posts);
        }
    });
    return defer.promise;
}
function updatePost(params){
    if(params){
        var defer = q.defer();
        var query = conn.query("UPDATE posts SET tittle=?, content=?, author = ?, updated_at=? WHERE id = ?",
        [params.tittle, params.content, params.author,new Date(),params.id],
         function(err,posts){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
    }
    return false;
}
function deletePost(id){
    if(id){
        var defer = q.defer();
        var query = conn.query("delete from posts where id = ?",
        [id],function(err,posts){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(posts);
            }
        });
        return defer.promise;
    }
    return false;
}
module.exports = {
    getAllPosts:getAllPosts,
    addPost:addPost,
    getPostByID:getPostByID,
    updatePost:updatePost,
    deletePost:deletePost
}