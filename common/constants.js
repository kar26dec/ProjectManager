

module.exports = {

    RESULT_FLAG: {
        FAIL: "0",
        SUCCESS: "1"
    },


    MESSAGE_TYPE: {
        ADD_ROLE: 'addole',
        ADD_USER: 'adduser',
        CREATE_PROJECT: 'createproject',
        UPDATE_PROJECT: 'updateproject',
        DELETE_PROJECT: 'deleteproject',
        GET_PROJECT_WITH_PAGINATION: "getprojectwithpagination",
        ASSIGN_USER_ROLE: "shareproject",
        UNSHARE_PROJECT: "unshareproject",
        GET_PROJECT_BY_USERID: "getprojectbyuserid",
        GET_PROJECT_BY_MODIFICATIONDATE: "getprojectbymodificationdatewithpaging"
    },
    MESSAGES: {
        SUCCESS: "Success",
        INVALID_ACCESS: "Invalid access",
        INVALID_REQUEST: "Invalid request",
        DBSAVE_ERROR: "Oops! something went wrong. Please try again",
        REQUIRE_FIELD_MESSAGE: "Require fields are missing.",
        NO_RECORD_FOUND: "No record found",
        ROLE_ADDED: 'Role is successfully added',
        ROLE_DELETED: 'Role is deleted successfully',
        USER_ADDED: 'User is successfully added',
        USER_UPDATED: 'User is successfully updated',
        USER_DELETED: 'User is deleted successfully',
        USER_ALREADY_EXISTS: 'Username is already exists',
        USER_ROLE_ADDED: 'User Role is successfully added',
        USER_ROLE_EXISTS: 'This user role already exists',
        USER_ROLE_DELETED: 'User role is deleted successfully',
        PERMISSION_ADDED: 'Permission is successfully added',
        PERMISSION_EXISTS: 'This Permission already exists',
        PERMISSION_DELETED: 'Permission is deleted successfully',
        PERMISSION_CHANGED: 'Permission is changed successfully',
        NO_USER_FOUND: "No user found",

    },

    ERROR_CODE: {
        NO_ERROR: "-1",
        DATABASE_ERROR: "100",
        INVALID_APPID: "200",
        INVALID_TOKEN: "300",
        INVALID_DEVICE: "400",
        OTP_FAIL: "150",
        EXISTS_ERROR: "250",
        INVALID_REQUEST: "350",
        NOT_FOUND: "404",
        REQUIRE_FIELD: "405"
    }
};



