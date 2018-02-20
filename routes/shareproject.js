var Roles = require('../models/role');
var User = require('../models/user');
var Project = require('../models/project');
var ProjectUserAssign = require('../models/projectuserassign');
var Constants = require('../common/constants');
var Helper = require('../common/helper');

function ShareProject(msgObject, res) {
    console.log("::AssignUserRole::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var roleid = msgdata.roleid;
    var userid = msgdata.userid;
    var projectid = msgdata.projectid;
    var messageData;
    var responseToReturn;

    CheckValidation(msgdata, function (response) {
        if (response) {
            ProjectUserAssign.findOne({ userid: userid, projectid: projectid, roleid: roleid }, function (errProjectAssign, resProjectAssign) {
                if (errProjectAssign) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                    res.send(responseToReturn);
                }
                else if (resProjectAssign) {
                    messageData = { message: "This role and project already assigned to this user" };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                    res.send(responseToReturn);
                }
                else {
                    User.findOne({ _id: userid }, function (errUser, resUser) {
                        if (errUser) {
                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                            res.send(responseToReturn);
                        }
                        else if (resUser) {
                            Roles.findOne({ _id: roleid }, function (errRole, resRole) {
                                if (errRole) {
                                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                    res.send(responseToReturn);
                                }
                                else if (resRole) {
                                    Project.findOne({ _id: projectid }, function (errProject, resProject) {
                                        if (errProject) {
                                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                            res.send(responseToReturn);
                                        }
                                        else if (resProject) {
                                            if (resProject.createdby.toString() === msgdata.sharedby.toString()) {
                                                if (resRole.rolename === "admin") {
                                                    ProjectUserAssign.findOne({ roleid: roleid, projectid: projectid }, function (errAdminProject, resAdminProject) {
                                                        if (errAdminProject) {
                                                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                                            res.send(responseToReturn);
                                                        }
                                                        else if (resAdminProject) {
                                                            messageData = { message: "Admin already exists for this project" };
                                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                                            res.send(responseToReturn);
                                                        }
                                                        else {
                                                            var objprojectuserassign = new ProjectUserAssign();
                                                            objprojectuserassign.projectid = resProject._id;
                                                            objprojectuserassign.roleid = resRole._id;
                                                            objprojectuserassign.userid = resUser._id;
                                                            objprojectuserassign.createddate = new Date();
                                                            objprojectuserassign.save(function (errSave, resSave) {
                                                                if (errSave) {
                                                                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                                                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                                                    res.send(responseToReturn);
                                                                }
                                                                else {
                                                                    messageData = { message: "Project assign successfully" };
                                                                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                                                    res.send(responseToReturn);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                else {
                                                    var objprojectuserassign = new ProjectUserAssign();
                                                    objprojectuserassign.projectid = resProject._id;
                                                    objprojectuserassign.roleid = resRole._id;
                                                    objprojectuserassign.userid = resUser._id;
                                                    objprojectuserassign.createddate = new Date();
                                                    objprojectuserassign.save(function (errSave, resSave) {
                                                        if (errSave) {
                                                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                                            res.send(responseToReturn);
                                                        }
                                                        else {
                                                            messageData = { message: "Project assign successfully" };
                                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                                            res.send(responseToReturn);
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                messageData = { message: "Project only shared by admin" };
                                                responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                                res.send(responseToReturn);
                                            }
                                        }
                                        else {
                                            messageData = { message: "No project found" };
                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                            res.send(responseToReturn);
                                        }
                                    });
                                }
                                else {
                                    messageData = { message: "No role found" };
                                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                                    res.send(responseToReturn);
                                }
                            });
                        }
                        else {
                            messageData = { message: Constants.MESSAGES.NO_USER_FOUND };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
                            res.send(responseToReturn);
                        }
                    });
                }
            });

        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.ASSIGN_USER_ROLE, messageData);
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
    if (messageObject.roleid === undefined || messageObject.roleid === "" || messageObject.roleid === null) {
        isvalid = false;
    }
    if (messageObject.sharedby === undefined || messageObject.sharedby === "" || messageObject.sharedby === null) {
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
    ShareProject: ShareProject
};