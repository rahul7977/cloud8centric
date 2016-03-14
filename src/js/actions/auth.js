import constants from '../constants';
import { pushState,push } from 'redux-router';

let {LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS} = constants;

export function authenticateUser(username, password){
    return(dispatch) => {
        dispatch({type:'LOGIN_USER_REQUEST'});
        var interval = setInterval(()=>{
            clearInterval(interval);
            dispatch({
                type: 'LOGIN_USER_SUCCESS',
                payload: {
                    username: username,
                    token: "123",
                    statusText:"You have been successfully logged in.",
                    password: password
                }
            });
            dispatch(push("dashboard"));
        },2000);

    }
}

export function logout(){
    return(dispatch) => {
        dispatch({
            type: 'LOG_OUT'
        });
        dispatch(pushState(null,"/"));
    }
}
