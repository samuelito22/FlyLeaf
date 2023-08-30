import { BAD_REQUEST, EMAIL_NOT_EXIST, EXPIRED_TOKEN, FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN, INVALID_GRANT_TYPE, INVALID_TOKEN, PHONE_NUMBER_NOT_EXIST, REVOKED_TOKEN, TOKEN_NOT_FOUND, UNAUTHORIZED_REQUEST, USER_ALREADY_EXIST, USER_NOT_FOUND_ERR } from "../constants/errors";

function centralizedErrorHandler(errorMessage: string){
    let status
    switch (errorMessage) {
        case BAD_REQUEST:
            status = 400;
            break;
        case UNAUTHORIZED_REQUEST:
        case EXPIRED_TOKEN:
            status = 401;
            break;
        case INVALID_TOKEN:
        case REVOKED_TOKEN:
        case INVALID_GRANT_TYPE:
            status = 403;
            break;
        case USER_NOT_FOUND_ERR:
        case PHONE_NUMBER_NOT_EXIST:
        case EMAIL_NOT_EXIST:
        case TOKEN_NOT_FOUND:
            status = 404;
            break;
        case USER_ALREADY_EXIST:
            status = 409;
            break;
        case FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN:
            status = 500;
            break;
        default:
            status = 500;
    }
    
    return status;
    
}

export default centralizedErrorHandler