var Rests = require("../models/restModel");
var bcrypt   = require('bcrypt-nodejs');

function getRests(res) {
    Rests.find(function (err, rest) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(rest);
        }
    })
}

function getRest(id, res){
    Rests.findById({ _id: id }, function (err, rest) {
        if (err) {
            throw err;
        }
        else {
            res.json(rest);
        }

    });
}

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = function (app) {

    //get all Rests | done
    app.get("/api/rest", function (req, res) {
        getRests(res);
    });

    //get rest info | done
    app.get("/api/rest/:id", function (req, res) {
        Rests.findById({ _id: req.params.id }, function (err, rest) {
            if (err) {
                throw err;
            }
            else {
                res.json(rest);
            }

        });
    });

    //Create a rest
    app.post("/api/rest", function (req, res) {
        var rest = {
            local: {
                email : req.body.email,
                name: req.body.name,
                address: req.body.address,
                phone : req.body.phone,
                password: generateHash(req.body.password)
            }
            
        };
        Rests.create(rest, function (err, rest) {
            if (err) {
                throw err;
            }
            else {
                Rests.findById({ _id: req.body._id }, function (err, rest) {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.json(rest);
                    }
            
                });
            }
        })
    });


    //Update a rest
    app.put("/api/rest", function (req, res) {
        if (!req.body._id) {
            return res.status(500).send("ID is required");
        }
        else {
            console.log(req.body);
            Rests.update({
                _id: req.body._id
            }, {
                    $set: {
                        local: {
                            name : req.body.name,
                            email : req.body.email,
                            address: req.body.address,
                            phone : req.body.phone,
                            password: generateHash(req.body.password)
                        }
                        
                    }
                }
                ,   
                function (err, rest) {

                    if (err) {
                        return res.status(500).json(err);
                    }
                    else {
                        Rests.findById({ _id: req.body._id }, function (err, rest) {
                            if (err) {
                                throw err;
                            }
                            else {
                                res.json(rest);
                            }
                    
                        });
                    }

                }
            )
        }
    })
    //Delete a rest
    app.delete("/api/rest/:id", function (req, res) {
        Rests.remove({
            _id: req.params.id},
            function(err, rest) {
                if (err) {
                    return res.status(500).json(err);
                }
                else {
                    getRests(res);
                }
            }
        )
    })


}