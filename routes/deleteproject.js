var ProjectUserAssign = require('../models/projectuserassign');
var Project = require('../models/project');
var Constants = require('../common/constants');
var Helper = require('../common/helper');

function DeleteProject(msgObject, res) {
    console.log("::Delete Project::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var messageData;
    var responseToReturn;
    CheckValidation(msgdata, function (response) {
        if (response) {
            Project.findOne({ _id: msgdata.projectid }, function (errProject, resProject) {
                if (errProject) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.DELETE_PROJECT, messageData);
                    res.send(responseToReturn);
                }
                else if (resProject) {
                    if (resProject.createdby.toString() === msgdata.deletedby.toString()) {
                        Project.remove({ _id: msgdata.projectid }, function (errRemove, resRemove) {
                            if (errRemove) {
                                messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.DELETE_PROJECT, messageData);
                                res.send(responseToReturn);
                            }
                            else {
                                ProjectUserAssign.remove({ projectid: msgdata.projectid }, function (errRemoveAssign, resRemoveAssign) {
                                    if (errRemoveAssign) {
                                        messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                        responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.DELETE_PROJECT, messageData);
                                        res.send(responseToReturn);
                                    }
                                    else {
                                        messageData = { message: "Project removed successfully" };
                                        responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.DELETE_PROJECT, messageData);
                                        res.send(responseToReturn);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        messageData = { message: "Only admin can update project" };
                        responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.DELETE_PROJECT, messageData);
                        res.send(responseToReturn);
                    }
                }
                else {
                    messageData = { message: "No project found" };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.DELETE_PROJECT, messageData);
                    res.send(responseToReturn);
                }
            });

        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.DELETE_PROJECT, messageData);
            res.send(responseToReturn);
        }
    });
}

function CheckValidation(messageObject, callback) {
    var isvalid = true;
    if (messageObject.projectid === undefined || messageObject.projectid === "" || messageObject.projectid === null) {
        isvalid = false;
    }
    if (messageObject.deletedby === undefined || messageObject.deletedby === "" || messageObject.deletedby === null) {
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
    DeleteProject: DeleteProject
};