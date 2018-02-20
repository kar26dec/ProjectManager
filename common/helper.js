

module.exports = {

    ParseToJSON: function (params) {
        var re = /\0/g;
        var str = params.toString().replace(re, "");
        return JSON.parse(str.trim());
    },
    GetResponseData: function (resultflag, messagetype, messagedata) {
        var returnResponse = {};
        returnResponse._resultflag = resultflag;
        returnResponse.messagetype = messagetype;
        returnResponse.messagedata = messagedata;
        return returnResponse;
    }
};