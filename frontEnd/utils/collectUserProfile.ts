import { navigationRef } from "../App";
import { ROUTES } from "../constants";
import { AppStatusActions, UserActions } from "../redux";
import { UserService } from "../services";
import { removeTokensFromKeychain, retrieveTokensFromKeychain } from "./keychain";
import { getLocationOnDemand } from "./locationChecker";

const collectUserProfile = async (dispatch: any, controller?:AbortController) => {
    const tokens = await retrieveTokensFromKeychain();
    if (tokens) {
        const {accessToken, refreshToken} = tokens;
        try {
            const { longitude, latitude} = (await getLocationOnDemand()).coords
            const result = await UserService.getMyProfile(
                accessToken,
                refreshToken,
                longitude,
                latitude,
                controller && controller?.signal,
            )

            if (result.type === 'error') {
                dispatch(AppStatusActions.setCurrentScreen(ROUTES.LOGIN_NAVIGATOR));
                navigationRef.current?.navigate(ROUTES.LOGIN_NAVIGATOR);
                await removeTokensFromKeychain();
            } else {
                dispatch(UserActions.setCurrentUserId(result.user.id));
                dispatch(UserActions.setUserProfile(result.user.id, result.user));
            }
        } catch (e:any) {
            if (e.name === 'AbortError') {
                console.log('AbortError: Fetch request aborted.');
            } else {
                console.log(e);
            }
        }
    } else {
        navigationRef.current?.navigate(ROUTES.LOGIN_NAVIGATOR);
    }

}

export default collectUserProfile