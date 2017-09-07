import { CollectionTag } from './Utils';

enum PayloadResponseType {
    None = "None",
    Error = "Error",
    Count = "Count",
    Fetch = "Fetch",
    Insert = "Insert",
    Update = "Update",
    Remove = "Remove",
    EnsureIndex = "EnsureIndex",
    RemoveIndex = "RemoveIndex",
    RemoveCollection = "RemoveCollection"
}

interface PayloadResponse {
    type: PayloadResponseType,
    data: any
}

export interface ResponseMessage {
    request_id: string
    payload: PayloadResponse,
    collection: CollectionTag,
    explain?: [string]
}