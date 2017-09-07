"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
var OpType;
(function (OpType) {
    OpType["LoadEq"] = "LoadEq";
    OpType["LoadIn"] = "LoadIn";
    OpType["LoadLt"] = "LoadLt";
    OpType["LoadLte"] = "LoadLte";
    OpType["LoadGt"] = "LoadGt";
    OpType["LoadGte"] = "LoadGte";
    OpType["LoadGtLt"] = "LoadGtLt";
    OpType["LoadGteLt"] = "LoadGteLt";
    OpType["LoadGtLte"] = "LoadGtLte";
    OpType["LoadGteLte"] = "LoadGteLte";
    OpType["And"] = "And";
    OpType["Or"] = "Or";
})(OpType || (OpType = {}));
var PayloadRequestType;
(function (PayloadRequestType) {
    PayloadRequestType["None"] = "None";
    PayloadRequestType["Count"] = "Count";
    PayloadRequestType["Fetch"] = "Fetch";
    PayloadRequestType["Insert"] = "Insert";
    PayloadRequestType["Update"] = "Update";
    PayloadRequestType["Remove"] = "Remove";
    PayloadRequestType["EnsureIndex"] = "EnsureIndex";
    PayloadRequestType["RemoveIndex"] = "RemoveIndex";
    PayloadRequestType["RemoveCollection"] = "RemoveCollection";
})(PayloadRequestType || (PayloadRequestType = {}));
var ProjectionType;
(function (ProjectionType) {
    ProjectionType["All"] = "All";
    ProjectionType["Include"] = "Include";
    ProjectionType["Exclude"] = "Exclude";
})(ProjectionType || (ProjectionType = {}));
var UpdateKindType;
(function (UpdateKindType) {
    UpdateKindType["Overwrite"] = "Overwrite";
    UpdateKindType["Partial"] = "UpdatePartial";
})(UpdateKindType || (UpdateKindType = {}));
class ReadQuery {
}
class Collection {
    constructor(db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
    }
}
class Dex {
    constructor(url) {
        this._url = url;
        let activeRequests = new Map();
        const db = this;
        const ws = new WebSocket(url);
        ws.onopen = function () {
            db._ready = true;
            console.log("Connected to DexterityDB");
        };
        ws.onclose = function () {
            if (db._ready) {
                console.log("Disconnected from DexterityDB");
                db._ready = false;
            }
        };
        ws.onmessage = function (message) {
            let message_data;
            try {
                message_data = JSON.parse(message.data);
            }
            catch (err) {
                console.error(err);
                return;
            }
            if (message_data.request_id != null) {
                const callback = activeRequests.get(message_data.request_id);
                if (callback != null) {
                    activeRequests.delete(message_data.request_id);
                    callback.resolve(message);
                }
            }
        };
    }
    collection(collectionName) {
        return new Collection(this, collectionName);
    }
}
exports.Dex = Dex;
