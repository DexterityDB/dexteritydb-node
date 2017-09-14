import { CollectionTag } from './Utils';

enum OpType {
    LoadEq = "LoadEq",
    LoadIn = "LoadIn",
    LoadLt = "LoadLt",
    LoadLte = "LoadLte",
    LoadGt = "LoadGt",
    LoadGte = "LoadGte",
    LoadGtLt = "LoadGtLt",
    LoadGteLt = "LoadGteLt",
    LoadGtLte = "LoadGtLte",
    LoadGteLte = "LoadGteLte",
    And = "And",
    Or = "Or"
}

export enum PayloadRequestType {
    None = "None",
    Count = "Count",
    Fetch = "Fetch",
    Insert = "Insert",
    Update = "Update",
    Remove = "Remove",
    EnsureIndex = "EnsureIndex",
    RemoveIndex = "RemoveIndex",
    RemoveCollection = "RemoveCollection"
}

enum ProjectionType {
    All = "All",
    Include = "Include",
    Exclude = "Exclude"
}

enum UpdateKindType {
    Overwrite = "Overwrite",
    Partial = "UpdatePartial"
}

interface FetchOps {
    ops: Op[],
    projection: Projection
}

interface FieldValue {
    field: string,
    value: any 
}

interface FieldValues {
    field: string,
    values: any[]
}

interface FieldValueRange {
    field: string,
    low: any,
    high: any
}

export interface Op {
    type: OpType,
    data: any
}

export interface PayloadRequest {
    type: PayloadRequestType,
    data?: any
}

interface Projection {
    type: ProjectionType,
    data: any
}

export interface RequestMessage {
    request_id: string,
    payload: PayloadRequest,
    collection: CollectionTag,
    explain: boolean
}

interface UpdateKind {
    type: UpdateKindType,
    data: any
}

interface UpdateOps {
    ops: Op[],
    update_kind: UpdateKind
}

interface UpdatePartial {
    set: Map<string, any>,
    unset: string[]
}