var Roles = require('../models/role');
var User = require('../models/user');
var Project = require('../models/project');
var ProjectUserAssign = require('../models/projectuserassign');
var Constants = require('../common/constants');
var Helper = require('../common/helper');

function UnShareProject(msgObject, res) {
    console.log("::UnShareProject::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var userid = msgdata.userid;
    var projectid = msgdata.projectid;
    var messageData;
    var responseToReturn;

    CheckValidation(msgdata, function (response) {
        if (response) {
            ProjectUserAssign.findOne({ userid: userid, projectid: projectid }, function (errProjectAssign, resProjectAssign) {
                if (errProjectAssign) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UNSHARE_PROJECT, messageData);
                    res.send(responseToReturn);
                }
                else if (resProjectAssign) {
                    ProjectUserAssign.remove({ userid: userid, projectid: projectid }, function (errRemoveProjectAssign, resRemoveProjectAssign) {
                        if (errRemoveProjectAssign) {
                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UNSHARE_PROJECT, messageData);
                            res.send(responseToReturn);
                        }
                        else {
                            messageData = { message: "Project unshared successfully" };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.UNSHARE_PROJECT, messageData);
                            res.send(responseToReturn);
                        }
                    });
                }
                else {
                    messageData = { message: "No project found" };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UNSHARE_PROJECT, messageData);
                    res.send(responseToReturn);
                }
            });


        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UNSHARE_PROJECT, messageData);
            res.send(responseToReturn);
        }
    });
}

function CheckValidation(messageObject, callback) {
    var isvalid = true;
    if (messageObject.projectid === undefined || messageObject.projectid === "" || messageObject.projectid === null) {
        isvalid = false;
    }
    if (messageObject.userid === undefined || messageObject.userid === "" || messageObject.userid === null) {
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
    UnShareProject: UnShareProject
};