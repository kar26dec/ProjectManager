var express = require('express');
var app = express();
var router = express.Router();
var RequestObject = require('../models/requestobject');
var User = require('../models/user');
var AddRole = require('../routes/addrole');
var AddUser = require('../routes/adduser');
var CreateProject = require('../routes/createproject');
var UpdateProject = require('../routes/updateproject');
var DeleteProject = require('../routes/deleteproject');
var GetProjectWithPagination = require('../routes/getprojectwithpagination');
var ShareProject = require('../routes/shareproject');
var UnShareProject = require('../routes/unshareproject');
var GetProjectWithByUserId = require('../routes/getprojectbyuserid');
var GetProjectByModificationDateWithPaging = require('../routes/getprojectbymodificationdatewithpaging');
var jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
    res.send({ Message: "Invalid access !!!" });
    next();
});

router.post('/authenticate', function (req, res) {

    // find the user
    User.findOne({
        username: req.body.username
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            // if user is found and password is right
            // create a token with only our given payload
            // we don't want to pass in the entire user since that has the password
            const payload = {
                admin: user.username
            };
            var token = jwt.sign(payload, "projectmanager", {
                expiresIn: 3600
            });
            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });


        }

    });
});

router.post('/', function (req, res) {

    var msgObject = new RequestObject(req.body);
    if (msgObject.messagetype === "adduser") {
        AddUser.AddUser(msgObject, res);
    } else {
        var token = req.body.token;

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, "projectmanager", function (err, decoded) {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;                  
                    console.log("msgObject.requesttype:::" + msgObject.messagetype);
                    if (msgObject.messagetype === "addrole") {
                        AddRole.AddRole(msgObject, res);
                    }                   
                    else if (msgObject.messagetype === "createproject") {
                        CreateProject.CreateProject(msgObject, res);
                    }
                    else if (msgObject.messagetype === "updateproject") {
                        UpdateProject.UpdateProject(msgObject, res);
                    }
                    else if (msgObject.messagetype === "deleteproject") {
                        DeleteProject.DeleteProject(msgObject, res);
                    }
                    else if (msgObject.messagetype === "getprojectwithpagination") {
                        GetProjectWithPagination.GetProjectWithPagination(msgObject, res);
                    }
                    else if (msgObject.messagetype === "shareproject") {
                        ShareProject.ShareProject(msgObject, res);
                    }
                    else if (msgObject.messagetype === "unshareproject") {
                        UnShareProject.UnShareProject(msgObject, res);
                    }
                    else if (msgObject.messagetype === "getprojectbyuserid") {
                        GetProjectWithByUserId.GetProjectWithByUserId(msgObject, res);
                    }
                    else if (msgObject.messagetype === "getprojectbymodificationdatewithpaging") {
                        GetProjectByModificationDateWithPaging.GetProjectByModificationDateWithPaging(msgObject, res);
                    }
                    else {
                        res.send({ message: "Invalid Request !!" });
                    }
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }


});


module.exports = router;