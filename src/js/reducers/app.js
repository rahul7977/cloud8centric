/**
 * Created by synerzip on 10/03/16.
 */
import {createReducer} from '../utils';
import {SHOW_LOGIN} from '../constants';
import {pushState} from 'redux-router';

const initialState = {
    loginScreen: false,
    forgotPasswordScreen: false,
    forgotMessageScreen: false,
    homeScreen:true,
    signUpScreen:false,
    loading:false
};

export default createReducer(initialState, {
    'SHOW_LOGIN': (state, payload) => {
        return Object.assign({}, state, {
            loginScreen: true,
            forgotPasswordScreen: false,
            forgotMessageScreen: false,
            homeScreen: false
        });
    },
    'SHOW_FORGOT_PASSWORD': (state, payload) => {
        console.log('payload::', payload);
        return Object.assign({}, state, {
            forgotPasswordScreen: true,
            forgotMessageScreen: false,
            loginScreen:true,
            signUpScreen:false,
            homeScreen:false
        });
    },
    'SHOW_HOME': (state, payload) => {
        return Object.assign({}, state, {
            loginScreen: false,
            forgotPasswordScreen: false,
            forgotMessageScreen: false,
            homeScreen: true
        });
    },
    'SHOW_FORGOT_MESSAGE': (state, payload) => {
        console.log(payload);
        return Object.assign({}, state, {
            loginScreen: false,
            forgotPasswordScreen: false,
            forgotMessageScreen: true,
            signUpScreen:false,
            homeScreen:true
        });
    },
    'SHOW_SIGN_UP': (state, payload) => {
        return Object.assign({}, state, {
            loginScreen:false,
            signUpScreen:true,
            homeScreen:false
        });
    },
    'LOGIN_USER_REQUEST': (state, payload) => {
        return Object.assign({}, state, {
            loading:true
        });
    },
    'LOGIN_USER_SUCCESS': (state, payload) => {
        return Object.assign({}, state, {
            loading:false
        });
    },
    'SUBSCRIPTION_DETAIL_REQUEST_SENT': (state, payload) => {
        return Object.assign({}, state, {
            loading:true
        });

    },
    'SUBSCRIPTION_DETAIL_RECEIVED': (state, payload) => {
        return Object.assign({}, state, {
            loading:false
        });

    },
    'FETCH_SUBSCRIPTIONS': (state, payload) => {
        return Object.assign({}, state, {
            loading:true
        });

    },
    'SUBSCRIPTIONS_RECEIVED': (state, payload) => {
        return Object.assign({}, state, {
            loading:false
        });

    },
});
