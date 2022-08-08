export type WindowMessage<T> = {
    data: T
    origin: string
    source: Window
} 

export enum Direction {
    Request = "Request",
    Response = "Response"
}

export type Message = {
    direction: Direction
    type: string
}

export type AppRequest = Message & {
    direction: Direction.Request
}

export type StartImpersonation = AppRequest & {
    direction: Direction.Request
    type: 'StartImpersonation'
    address: string
}

export type StopImpersonation = AppRequest & {
    direction: Direction.Request
    type: 'StopImpersonation'
}

export type GetImpersonationStatus = AppRequest & {
    direction: Direction.Request
    type: 'GetImpersonationStatus'
}


export type AppResponse = Message & {
    direction: Direction.Response
}

export type ImpersonationStatus = AppResponse & {
    direction: Direction.Response
    type: 'ImpersonationStatus'
    address?: string
}

export enum Sender {
    React,
    Content
}

export interface ChromeMessage {
    from: Sender,
    message: any
}