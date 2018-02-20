var Project = require('../models/project');
var Constants = require('../common/constants');
var Helper = require('../common/helper');
var User = require('../models/user');
var ProjectUserAssign = require('../models/projectuserassign');

function GetProjectWithByUserId(msgObject, res) {
    console.log("::GetProjectWithByUserId::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var messageData;
    var responseToReturn;
    CheckValidation(msgdata, function (response) {
        if (response) {
            User.findOne({ _id: msgdata.userid }, function (errUser, resUser) {
                if (errUser) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_USERID, messageData);
                    res.send(responseToReturn);
                }
                else if (resUser) {
                    ProjectUserAssign.aggregate([{ $match: { userid: resUser._id } },
                    { $lookup: { from: "projects", localField: "projectid", foreignField: "_id", as: "projectInfo" } },
                    { $unwind: "$projectInfo" },
                    { $match: { "projectInfo.visibility": msgdata.visibility } }
                    ], function (errProject, resProject) {
                        if (errProject) {
                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_USERID, messageData);
                            res.send(responseToReturn);
                        }
                        else if (resProject && resProject.length > 0) {
                            var projects = [];
                            resProject.forEach(function (ele) {
                                projects.push(ele.projectInfo);
                            });
                            messageData = { projects: projects };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.GET_PROJECT_BY_USERID, messageData);
                            res.send(responseToReturn);
                        }
                        else {
                            messageData = { message: "No project found" };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_USERID, messageData);
                            res.send(responseToReturn);
                        }
                    });
                }
                else {
                    messageData = { message: "No user found" };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_USERID, messageData);
                    res.send(responseToReturn);
                }
            });


        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_USERID, messageData);
            res.send(responseToReturn);
        }
    });
}

function CheckValidation(messageObject, callback) {
    var isvalid = true;
    if (messageObject.userid === undefined || messageObject.userid === "" || messageObject.userid === null) {
        isvalid = false;
    }
    if (messageObject.visibility === undefined || messageObject.visibility === "" || messageObject.visibility === null) {
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
    GetProjectWithByUserId: GetProjectWithByUserId
};