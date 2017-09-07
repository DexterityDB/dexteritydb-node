export interface ReadOp {}

interface LoadEq {
    field: string,
    value: string | number
}

interface LoadIn {
    field: string,
    values: [string | number]
}

interface LoadLt {
    field: string,
    value: string | number
}