/** @namespace typedefs */

/**
 * @typedef {Object} Interval - Signifies the time period some task took. It has a start and end point, in the form of UNIX timestamps.
 * @property {Number} start - The UNIX timestamp that represents the moment the task begins.
 * @property {Number} end - The UNIX timestamp that represents the moment the task ends.
 * @memberof typedefs
 */
export type Interval = {
    start: number,
    end: number
}

/**
 * @typedef {Object} Task - This is the fundamental element that this application works with. A task is something the user has worked on for any amount of time. 
 * @property {Number} id - The unique identifier of the task in the database for the user.
 * @property {String} name - The text description of the task.
 * @property {Interval} interval - An object containing the start and finish UNIX timestamps for the duration of the task.
 * @property {Number} [project] - The numeric id of the project this task belongs to.
 * @memberof typedefs
 */
export type Task = {
    id: number,
    name: string,
    interval: Interval,
    project?: number
}

/**
 * @typedef {Object} CurrentTask - This is one particular task that will be active. This means it will not have a finish timestamp and it will be displayed in the timer. This task is assigned anytime the timer is started, and storing this data will effectively allow the user to start a task, close the applcation and have it persist the next time it's opened again.
 * @property {String} name - The text description of the task.
 * @property {Number} start - The UNIX timestamp that represents the moment the task begins.
 * @property {Number} [project] - The numeric id of the project this task belongs to.
 * @memberof typedefs
 */
export type CurrentTask = {
    name: string,
    start: number,
    project?: number
}

/**
 * @typedef {Object} Project - Many task can be grouped into projects for organization.
 * @property {Number} id - The unique identifier of the task in the database for the user.
 * @property {String} name - The text description of the task.
 * @memberof typedefs
 */
export type Project = {
    id: number,
    name: string
}

/**
 * @typedef {Object} Milestone - A category which tasks belong to. Based on how much time has passed, tasks will go into a different milestone. For example: Today, Yesteday, This week, Last week, etc. This object will be used to list the tasks dynamically.
 * @property {String} title - A title to be displayed when listing the tasks.
 * @property {Array<Task>} tasks - The tasks this Milestone object contains.
 * @memberof typedefs
 */
export type Milestone = {
    title: string,
    tasks: Task[]
}

/**
 * @typedef {Object} MilestoneFilter - This object abstracts the logic used in the calculation of the Milestones, by helping to create an object with dynamic keys (MappedTasksToMilestones), which keys are the id given, and the tasks that will go into that milestone are those who meet its filter function 
 * @property {String} id - The name of the property of the object with dynamic keys that will be composed from all these filters.
 * @property {String} title - A title to be displayed when listing the tasks.
 * @property {Function} filter - A function that evaluates the task's interval properties and determines if it belongs to this milestone or not. Returns a boolean.
 * @memberof typedefs
 */
export type MilestoneFilter = {
    id: string,
    title: string,
    filter: Function
};

export type MappedTasksToMilestones = {
    [key: string]: Milestone
}