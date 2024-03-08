import {del, get, post, put} from 'aws-amplify/api';

function getAuthHeaders(accessToken){
    return {Authorization: `Bearer ${accessToken}`};
}

async function makeRestRequest(restOperation){
    return await restOperation.response;
}

export async function getRequest(apiName, path, accessToken) {
    const options = {headers: getAuthHeaders(accessToken)};
    const restOperation = get({apiName: apiName, path: path, options: options});
    const response = await makeRestRequest(restOperation);
    if (response && response.body)
        return await response.body?.json();
    return response;
}

export async function postRequest(apiName, path, body, accessToken) {
    const options = {body: body, headers: getAuthHeaders(accessToken)};
    const restOperation = post({apiName: apiName, path: path, options: options});
    return makeRestRequest(restOperation);
}

export async function putRequest(apiName, path,  body, accessToken) {
    const options = {body: body, headers: getAuthHeaders(accessToken)};
    const restOperation = put({apiName: apiName, path: path, options: options});
    return makeRestRequest(restOperation);
}

export async function delRequest(apiName, path, accessToken) {
    const options = {headers: getAuthHeaders(accessToken)};
    const restOperation = del({apiName: apiName, path: path, options: options});
    return makeRestRequest(restOperation);
}