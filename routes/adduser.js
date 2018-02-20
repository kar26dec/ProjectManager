var User = require('../models/user');
var Constants = require('../common/constants');
var Helper = require('../common/helper');

function AddUser(msgObject, res) {
    console.log("::Add User::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var messageData;
    var responseToReturn;
    CheckValidation(msgdata, function (response) {
        if (response) {
            User.findOne({ username: msgdata.username }, function (errUser, resUser) {
                if (errUser) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ADD_USER, messageData);
                    res.send(responseToReturn);
                }
                else if (resUser) {
                    messageData = { message: "User already exists" };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ADD_USER, messageData);
                    res.send(responseToReturn);
                }
                else {
                    var user = new User();
                    user.username = msgdata.username;
                    user.createddate = new Date();
                    user.save(function (errSave, resSave) {
                        if (errSave) {
                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ADD_USER, messageData);
                            res.send(responseToReturn);
                        }
                        else {
                            messageData = { message: Constants.MESSAGES.USER_ADDED, userdata: resSave };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.ADD_USER, messageData);
                            res.send(responseToReturn);
                        }
                    });
                }
            });

        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ADD_USER, messageData);
            res.send(responseToReturn);
        }
    });
}

function CheckValidation(messageObject, callback) {
    var isvalid = true;
    if (messageObject.username === undefined || messageObject.username === "" || messageObject.username === null) {
        isvalid = false;
    }
    if (isvalid) {
        callback(true);
    }
    else {
        callback(false);
    }
}

module.exports = {
    AddUser: AddUser
};