var User = require('../models/user');
var Project = require('../models/project');
var ProjectUserAssign = require('../models/projectuserassign');
var Roles = require('../models/role');
var Constants = require('../common/constants');
var Helper = require('../common/helper');

function CreateProject(msgObject, res) {
    console.log("::Create Project::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var messageData;
    var responseToReturn;
    CheckValidation(msgdata, function (response) {
        if (response) {
            User.findOne({ _id: msgdata.createdby }, function (errUser, resUser) {
                if (errUser) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                    res.send(responseToReturn);
                }
                else if (resUser) {
                    var project = new Project();
                    project.projectname = msgdata.projectname;
                    project.description = msgdata.description;
                    project.createdby = resUser._id;
                    project.updateddate = new Date();
                    project.createddate = new Date();
                    project.visibility = msgdata.visibility;
                    project.save(function (errSave, resSave) {
                        if (errSave) {
                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                            res.send(responseToReturn);
                        }
                        else {
                            Roles.findOne({ rolename: "admin" }, function (errRole, resRole) {
                                if (errRole) {
                                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                                    res.send(responseToReturn);
                                }
                                else if (resRole) {
                                    var objprojectuserassign = new ProjectUserAssign();
                                    objprojectuserassign.projectid = resSave._id;
                                    objprojectuserassign.roleid = resRole._id;
                                    objprojectuserassign.userid = resUser._id;
                                    objprojectuserassign.createddate = new Date();
                                    objprojectuserassign.save(function (errSaveProject, resSaveProject) {
                                        if (errSaveProject) {
                                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                                            res.send(responseToReturn);
                                        }
                                        else {
                                            messageData = { message: "project created successfully", projectdata: resSave };
                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                                            res.send(responseToReturn);
                                        }
                                    });
                                }
                                else {
                                    var role = new Roles();
                                    role.rolename = "admin";
                                    role.createddate = new Date();
                                    role.save(function (errSaveRole, resSaveRole) {
                                        if (errSaveRole) {
                                            messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                                            res.send(responseToReturn);
                                        }
                                        else {
                                            var objprojectuserassign = new ProjectUserAssign();
                                            objprojectuserassign.projectid = resSave._id;
                                            objprojectuserassign.roleid = resRole._id;
                                            objprojectuserassign.userid = resUser._id;
                                            objprojectuserassign.createddate = new Date();
                                            objprojectuserassign.save(function (errSaveProject, resSaveProject) {
                                                if (errSaveProject) {
                                                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                                                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                                                    res.send(responseToReturn);
                                                }
                                                else {
                                                    messageData = { message: "project created successfully", projectdata: resSave };
                                                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.SUCCESS, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                                                    res.send(responseToReturn);
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
                else {
                    messageData = { message: Constants.MESSAGES.NO_USER_FOUND };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
                    res.send(responseToReturn);
                }
            });

        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.CREATE_PROJECT, messageData);
            res.send(responseToReturn);
        }
    });
}

function CheckValidation(messageObject, callback) {
    var isvalid = true;
    if (messageObject.projectname === undefined || messageObject.projectname === "" || messageObject.projectname === null) {
        isvalid = false;
    }
    if (messageObject.visibility === undefined || messageObject.visibility === "" || messageObject.visibility === null) {
        isvalid = false;
    }
    if (messageObject.createdby === undefined || messageObject.createdby === "" || messageObject.createdby === null) {
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
    CreateProject: CreateProject
};