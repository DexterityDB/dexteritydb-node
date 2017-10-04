"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    PayloadRequestType["Cursor"] = "Cursor";
    PayloadRequestType["Fetch"] = "Fetch";
    PayloadRequestType["Insert"] = "Insert";
    PayloadRequestType["Update"] = "Update";
    PayloadRequestType["Remove"] = "Remove";
    PayloadRequestType["EnsureIndex"] = "EnsureIndex";
    PayloadRequestType["RemoveIndex"] = "RemoveIndex";
    PayloadRequestType["RemoveCollection"] = "RemoveCollection";
})(PayloadRequestType = exports.PayloadRequestType || (exports.PayloadRequestType = {}));
var ProjectionType;
(function (ProjectionType) {
    ProjectionType["All"] = "All";
    ProjectionType["Include"] = "Include";
    ProjectionType["Exclude"] = "Exclude";
})(ProjectionType = exports.ProjectionType || (exports.ProjectionType = {}));
var UpdateKindType;
(function (UpdateKindType) {
    UpdateKindType["Overwrite"] = "Overwrite";
    UpdateKindType["Partial"] = "Partial";
})(UpdateKindType = exports.UpdateKindType || (exports.UpdateKindType = {}));
class UpdateKind {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
exports.UpdateKind = UpdateKind;
class UpdateOps {
    constructor(ops, update_kind) {
        this.ops = ops;
        this.update_kind = update_kind;
    }
}
exports.UpdateOps = UpdateOps;
