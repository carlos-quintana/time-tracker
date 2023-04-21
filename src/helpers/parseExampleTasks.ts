import { Interval, Task } from "../types";

type PartialTask = {
    id?: number,
    name?: string,
    interval?: Interval,
    project?: number
}

type ExampleTask = {
    offset: number,
    task: string,
    start: string,
    end: string,
    project: string
}

/**
 * This function will receive an array of example Tasks and parse it into an array of Tasks that can be used by the App to be displayed.
 * This is necessary because the example tasks' dates will be adjusted to the moment these are generated. This is so the application can consistently display it's behavior regarding the dates of the tasks, like how to display a task that was registered today, yesterday, last week, etc.
 * @param {Array<{offset:number,task:string,start:string,end:string,project:string}>} exampleTasksJSON 
 * @returns {Array<typedefs.Task>}
 */
export default function parseExampleTasks(exampleTasksJSON: ExampleTask[]): Task[] {
    return exampleTasksJSON.map((exampleTask:ExampleTask) => {
        let task: PartialTask = {};
        
        // Task name
        task.name = exampleTask.task;

        // Start timestamp, get the current timestamp and change its hours and minutes to the time given
        let startDate = new Date()
        startDate.setHours(parseInt(exampleTask.start.split(":")[0]));
        startDate.setMinutes(parseInt(exampleTask.start.split(":")[1]));
        startDate.setSeconds(0);

        // Then add the offset days (which is equal or less than zero)
        startDate.setDate(startDate.getDate() + exampleTask.offset);

        // End timestamp
        let endDate = new Date();
        endDate.setHours(parseInt(exampleTask.end.split(":")[0]));
        endDate.setMinutes(parseInt(exampleTask.end.split(":")[1]));
        endDate.setSeconds(0);
        endDate.setDate(endDate.getDate() + exampleTask.offset);

        task.interval = {
            start: startDate.valueOf(),
            end: endDate.valueOf()
        };

        // Task project
        if (exampleTask.project !== "0")
            task.project = parseInt(exampleTask.project);

        task.id = task.interval.start;

        return task as Task;
    })
}