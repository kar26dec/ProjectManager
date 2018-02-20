var Roles = require('../models/role');
var Constants = require('../common/constants');
var Helper = require('../common/helper');

function AddRole(msgObject, res) {
    console.log("::Add Role::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var rolename = msgdata.rolename;
    var messageData;
    var responseToReturn;
    CheckValidation(msgdata, function (response) {
        if (response) {
            Roles.findOne({ rolename: rolename }, function (errRole, resRole) {
                if (errRole) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ADD_ROLE, messageData);
                    res.send(responseToReturn);
                }
                else if (resRole) {
                    messageData = { message: Constants.MESSAGES.USER_ROLE_EXISTS };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ADD_ROLE, messageData);
                    res.send(responseToReturn);
                }
                else {
                    var RoleObj = new Roles();
                    RoleObj.rolename = rolename;
                    RoleObj.createddate = new Date();
                    RoleObj.save(function (errSaveRole, resSaveRole) {
                        if (errSaveRole) {
                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ADD_ROLE, messageData);
                            res.send(responseToReturn);
                        } else {
                            messageData = { message: Constants.MESSAGES.ROLE_ADDED };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.ADD_ROLE, messageData);
                            res.send(responseToReturn);
                        }
                    });
                }
            });
        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ADD_ROLE, messageData);
            res.send(responseToReturn);
        }
    });

}

function CheckValidation(messageObject, callback) {
    var isvalid = true;
    if (messageObject.rolename === undefined || messageObject.rolename === "" || messageObject.rolename === null) {
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
    AddRole: AddRole
};