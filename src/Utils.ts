/**
 * @typedef {(number | string | null)} Value Purpose: Any value that can be stored by the database in a collection
 */

export type Value = number | string | null;

export interface CollectionTag {
    db: string,
    collection: string
}

export function randomString(length: number): string {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function toJSON(object: Object) {
    
}