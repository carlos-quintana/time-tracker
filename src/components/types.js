/**
 * @namespace typedefs
 */

/**
 * @typedef {Object} Interval - Signifies the time period some task took. It has a start and end point, in the form of UNIX timestamps.
 * @property {Number} start - The UNIX timestamp that represents the moment the task begins.
 * @property {Number} end - The UNIX timestamp that represents the moment the task ends.
 * @memberof typedefs
 */

/**
 * @typedef {Object} Task - This is the fundamental element that this application works with. A task is something the user has worked on for any amount of time. 
 * @property {Number} id - The unique identifier of the task in the database for the user.
 * @property {String} name - The text description of the task.
 * @property {Interval} interval - An object containing the start and finish UNIX timestamps for the duration of the task.
 * @property {Number} [project] - The numeric id of the project this task belongs to.
 * @memberof typedefs
 */

/**
 * @typedef {Object} CurrentTask - This is one particular task that will be active. This means it will not have a finish timestamp and it will be displayed in the timer. This task is assigned anytime the timer is started, and storing this data will effectively allow the user to start a task, close the applcation and have it persist the next time it's opened again.
 * @property {String} name - The text description of the task.
 * @property {Number} start - The UNIX timestamp that represents the moment the task begins.
 * @property {Number} [project] - The numeric id of the project this task belongs to.
 * @memberof typedefs
 */

/**
 * @typedef {Object} Project - Many task can be grouped into projects for organization.
 * @property {Number} id - The unique identifier of the task in the database for the user.
 * @property {String} name - The text description of the task.
 * @memberof typedefs
 */

export { }