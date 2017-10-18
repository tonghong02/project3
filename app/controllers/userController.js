var Users = require("../models/userModel");
var bcrypt   = require('bcrypt-nodejs');

function getUsers(res) {
    Users.find(function (err, user) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(user);
        }
    })
}

function getUser(id, res){
    Users.findById({ _id: id }, function (err, user) {
        if (err) {
            throw err;
        }
        else {
            res.json(user);
        }

    });
}

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = function (app) {

    //get all users | done
    app.get("/api/user", function (req, res) {
        getUsers(res);
    });

    //get user info | done
    app.get("/api/user/:id", function (req, res) {
        Users.findById({ _id: req.params.id }, function (err, user) {
            if (err) {
                throw err;
            }
            else {
                res.json(user);
            }

        });
    });

    //Create a user
    app.post("/api/user", function (req, res) {
        var user = {
            local: {
                email : req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: generateHash(req.body.password)
            }
            
        };
        Users.create(user, function (err, user) {
            if (err) {
                throw err;
            }
            else {
                Users.findById({ _id: req.body._id }, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.json(user);
                    }
            
                });
            }
        })
    });


    //Update a user
    app.put("/api/user", function (req, res) {
        if (!req.body._id) {
            return res.status(500).send("ID is required");
        }
        else {
            console.log(req.body);
            Users.update({
                _id: req.body._id
            }, {
                    $set: {
                        local: {
                            firstname : req.body.firstname,
                            lastname : req.body.lastname,
                            email : req.body.email,
                            password: generateHash(req.body.password)
                        }
                        
                    }
                }
                ,   
                function (err, user) {

                    if (err) {
                        return res.status(500).json(err);
                    }
                    else {
                        Users.findById({ _id: req.body._id }, function (err, user) {
                            if (err) {
                                throw err;
                            }
                            else {
                                res.json(user);
                            }
                    
                        });
                    }

                }
            )
        }
    })
    //Delete a user
    app.delete("/api/user/:id", function (req, res) {
        Users.remove({
            _id: req.params.id},
            function(err, user) {
                if (err) {
                    return res.status(500).json(err);
                }
                else {
                    getUsers(res);
                }
            }
        )
    })


}