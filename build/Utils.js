"use strict";
/**
 * @typedef {(number | string | null)} Value Purpose: Any value that can be stored by the database in a collection
 */
Object.defineProperty(exports, "__esModule", { value: true });
function randomString(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.randomString = randomString;
function toJSON(object) {
}
exports.toJSON = toJSON;
