var Project = require('../models/project');
var Constants = require('../common/constants');
var Helper = require('../common/helper');

function GetProjectByModificationDateWithPaging(msgObject, res) {
    console.log("::GetProjectByModificationDateWithPaging::");
    var msgdata = Helper.ParseToJSON(msgObject.messagedata);
    var messageData;
    var responseToReturn;
    CheckValidation(msgdata, function (response) {
        if (response) {
            var pagenumber = parseInt(msgdata.pagenumber);
            var pagesize = parseInt(msgdata.pagesize);
            Project.find({}).sort({ updateddate: -1 }).skip((pagenumber - 1) * pagesize).limit(pagesize).exec(function (errProject, resProject) {
                if (errProject) {
                    messageData = { message: Constants.MESSAGES.DBSAVE_ERROR };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_MODIFICATIONDATE, messageData);
                    res.send(responseToReturn);
                }
                else if (resProject && resProject.length > 0) {
                    messageData = { project: resProject };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_MODIFICATIONDATE, messageData);
                    res.send(responseToReturn);
                }
                else {
                    messageData = { message: "No project found" };
                    responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_MODIFICATIONDATE, messageData);
                    res.send(responseToReturn);
                }
            });

        }
        else {
            messageData = { message: Constants.MESSAGES.REQUIRE_FIELD_MESSAGE };
            responseToReturn = Helper.GetResponseData(Constants.RESULT_FLAG.FAIL, Constants.MESSAGE_TYPE.GET_PROJECT_BY_MODIFICATIONDATE, messageData);
            res.send(responseToReturn);
        }
    });
}

function CheckValidation(messageObject, callback) {
    var isvalid = true;
    if (messageObject.pagesize === undefined || messageObject.pagesize === "" || messageObject.pagesize === null) {
        isvalid = false;
    }
    if (messageObject.pagenumber === undefined || messageObject.pagenumber === "" || messageObject.pagenumber === null) {
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
    GetProjectByModificationDateWithPaging: GetProjectByModificationDateWithPaging
};