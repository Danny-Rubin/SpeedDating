import {del, get, post, put} from 'aws-amplify/api';

async function makeRestRequest(restOperation){
    const response = await restOperation.response;
    return await response.body.json();
}

export async function getRequest(apiName, path) {
    const restOperation = get({apiName: apiName, path: path});
    return makeRestRequest(restOperation);
}

export async function postRequest(apiName, path, body) {
    const options = {body: body};
    const restOperation = post({apiName: apiName, path: path, options: options});
    return makeRestRequest(restOperation);
}

export async function putRequest(apiName, path,  body) {
    const options = {body: body};
    const restOperation = put({apiName: apiName, path: path, options: options});
    return makeRestRequest(restOperation);
}

export async function delRequest(apiName, path) {
    const restOperation = del({apiName: apiName, path: path});
    return makeRestRequest(restOperation);
}