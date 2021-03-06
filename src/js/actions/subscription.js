import constants from '../constants';
import { push } from 'redux-router';
import { get, post } from './common';
import _ from 'lodash';

let {FETCH_SUBSCRIPTIONS, FETCH_PRODUCTS_AND_PLANS, ADD_NEW_SUBSCRIPTION, PRODUCT_SELECTED, PLAN_SELECTED,
    PRODUCT_DELETED, SUBSCRIPTION_CREATED, PRODUCTS_AND_PLANS_RECEIVED, SUBSCRIPTIONS_RECEIVED,
    SUBSCRIPTION_DETAIL_REQUEST_SENT, SUBSCRIPTION_STATUS_RECEIVED, CLEAN_REDUCER_DATA, CREATE_NEW_SUBSCRIPTION, SUBSCRIPTION_CREATION_FAILED} = constants;

export function fetchSubscriptions(organizationId){

    return(dispatch) => {

        let endPointURL = 'organizations/'+organizationId+'/subscriptions';
        let subscriptionResponse = [];
        let count = 0;

        get(endPointURL)
        .then((response)=>{

            let subscriptionObject = {};
            subscriptionResponse = response;
            let recursiveUpdate = false;

            if(_.size(subscriptionResponse) > 0){

                dispatch({type:FETCH_SUBSCRIPTIONS});

                _.each(subscriptionResponse,(subscription)=>{
                    if(subscription){

                        _.each(subscription.subscriptionProductList,(product, key)=>{

                            subscriptionObject[count] = {
                                id: subscription.id,
                                name: subscription.name,
                                startDate: subscription.startDate,
                                details: {
                                            deployedUrl: product.provisionedProductUrl ? product.provisionedProductUrl : null,
                                            adminUserName: product.productAdminUserName ? product.productAdminUserName :  null
                                        },
                                status: product.provisioningStatus,
                                productName: product.productName,
                                version: product.productVersion,
                                counter:key+1,
                            }

                            if(subscriptionObject[count].status == 'In-progress'){
                                recursiveUpdate = true;
                            }
                            count += 1;
                        });

                    }
                });

                dispatch({type:SUBSCRIPTIONS_RECEIVED,
                    payload:{
                        subscriptionObject:subscriptionObject,
                        recursiveUpdate:recursiveUpdate
                    }
                });
            }

        })

    }

}

export function getSubscriptionStatus(subscriptionId, rowId){

    return(dispatch) => {
        dispatch({type:SUBSCRIPTION_DETAIL_REQUEST_SENT});

        let endPointURL = 'product-status/'+subscriptionId;
        let subscriptionObject = null;

        get(endPointURL)
        .then((response)=>{

            subscriptionObject = {
                rowId: rowId,
                subscriptionId: subscriptionId,
                details: response

            }

            dispatch({
                type:SUBSCRIPTION_STATUS_RECEIVED,
                payload:subscriptionObject
            });

        })

    }

}

export function fetchProductsAndPlans(){

    return(dispatch) => {
        dispatch({type:CLEAN_REDUCER_DATA});
        dispatch({type:FETCH_PRODUCTS_AND_PLANS});

        let endPointURL = 'products';

        get(endPointURL)
        .then((response)=>{

            dispatch({
                type:PRODUCTS_AND_PLANS_RECEIVED,
                payload:{
                    productList: response.content
                }
            });

        })

        dispatch(push("dashboard/subscriptions/create"));
    }

}

export function addNewSubscription() {

    return {
        type:ADD_NEW_SUBSCRIPTION
    }

}

export function productSelected(rowNumber, productName){

    return {
        type:PRODUCT_SELECTED,
        payload: {
            rowNumber: rowNumber,
            productName: productName
        }
    }

}

export function planSelected(rowNumber, planName, productId){

    return {
        type:PLAN_SELECTED,
        payload: {
            rowNumber: rowNumber,
            planName: planName,
            productId: productId
        }
    }

}

export function productDeleted(rowNumber){

    return {
        type:PRODUCT_DELETED,
        payload: {
            rowNumber: rowNumber,
        }
    }

}

export function createNewSubscription(organizationId, subscriptionInfo){

    return(dispatch) => {

        let userRoles = localStorage.getItem("roles");

        let roleName = _.map(JSON.parse(userRoles), (role) => {
           return role.name;
        });

        dispatch({type:CREATE_NEW_SUBSCRIPTION});

        let endPointURL = 'organizations/'+organizationId+'/subscriptions';

        post(endPointURL, subscriptionInfo)
            .then((response)=>{

                dispatch({
                    type:SUBSCRIPTION_CREATED
                });

                if (roleName[0] === "Admin") {
                    dispatch(push("dashboard/organizations"));
                }
                else{
                    dispatch(push("dashboard/subscriptions"));
                }
            }).catch(error=>{
                parseJSON(error).then((errorObj)=>{
                     dispatch({
                        type:SUBSCRIPTION_CREATION_FAILED,
                        payload: errorObj.message
                    });
                })
            })

        fetchSubscriptions(organizationId);

    }

}
