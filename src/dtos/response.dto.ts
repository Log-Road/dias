export interface Res<T> {
    data: T
    statusCode: number
    statusMsg: string
}