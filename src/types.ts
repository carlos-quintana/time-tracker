export type Interval = {
    start: number,
    end: number
}

export type Task = {
    id: number,
    name: string,
    interval: Interval,
    project?: number
}

export type CurrentTask = {
    name: string,
    start: number,
    project?: number
}

export type Project = {
    id: number,
    name: string
}