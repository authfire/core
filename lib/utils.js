"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerToken = exports.postRequest = void 0;
const const_1 = require("./const");
const postRequest = async (url, data = {}) => {
    const headers = {
        "Content-Type": "application/json",
        "X-Firebase-AppCheck": await (0, const_1.getAppCheckToken)()
    };
    return await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
    });
};
exports.postRequest = postRequest;
const getServerToken = async (serverTokenUrl) => {
    const response = await postRequest(serverTokenUrl);
    if (!response.ok) {
        throw new Error("Failed to get server token: " + response.statusText);
    }
    const token = await response.json();
    if (!token.value) {
        throw new Error("No token received");
    }
    return token.value;
};
exports.getServerToken = getServerToken;
