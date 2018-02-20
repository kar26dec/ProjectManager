var User = require('../models/user');
var Project = require('../models/project');
var Constants = require('../common/constants');
var Helper = require('../common/helper');

function UpdateProject(msgObject, res) {
    console.log("::Update Project::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var messageData;
    var responseToReturn;
    CheckValidation(msgdata, function (response) {
        if (response) {
            Project.findOne({ _id: msgdata.projectid }, function (errProject, resProject) {
                if (errProject) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UPDATE_PROJECT, messageData);
                    res.send(responseToReturn);
                }
                else if (resProject) {
                    if (resProject.createdby.toString() === msgdata.updatedby.toString()) {
                        resProject.projectname = msgdata.projectname;
                        resProject.description = msgdata.description;                       
                        resProject.updateddate = new Date();
                        resProject.save(function (errSave, resSave) {
                            if (errSave) {
                                messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UPDATE_PROJECT, messageData);
                                res.send(responseToReturn);
                            }
                            else {
                                messageData = { message: "project updated successfully", projectdata: resSave };
                                responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.UPDATE_PROJECT, messageData);
                                res.send(responseToReturn);
                            }
                        });
                    }
                    else {
                        messageData = { message: "Only admin can update project" };
                        responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UPDATE_PROJECT, messageData);
                        res.send(responseToReturn);
                    }
                }
                else {
                    messageData = { message: "No project found" };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UPDATE_PROJECT, messageData);
                    res.send(responseToReturn);
                }
            });

        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.UPDATE_PROJECT, messageData);
            res.send(responseToReturn);
        }
    });
}

function CheckValidation(messageObject, callback) {
    var isvalid = true;
    if (messageObject.projectid === undefined || messageObject.projectid === "" || messageObject.projectid === null) {
        isvalid = false;
    }
    if (messageObject.projectname === undefined || messageObject.projectname === "" || messageObject.projectname === null) {
        isvalid = false;
    }    
    if (messageObject.updatedby === undefined || messageObject.updatedby === "" || messageObject.updatedby === null) {
        isvalid = false;
    }
    if (messageObject.description === undefined || messageObject.description === "" || messageObject.description === null) {
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
    UpdateProject: UpdateProject
};