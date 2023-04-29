import { Task, Milestone, MappedTasksToMilestones } from "../../types";
import { FILTERS } from "./milestoneFilters";

/**
 * This function takes an ordered list of Tasks (by starting timestamp) and categorizes them into different established milestones like Today, Yesterday, Past Week (the last 7 days), etc.
 * For this we go through each task and check if it's starting timestamp belongs to any of these milestones using different functions that compare two timestamps. Each milestone also contains a String thast will be displayed as a title of the section.
 * @param {Date} currentDate - The date of the system of the user, as these values are calculated relative to it.
 * @param {Array<Task>} tasksList - The list of tasks to be categorized.
 * @param {Array<Task>} [filters] - The array of milestone filters to be evaluated. Default value is the filters coming from a separate file where they're declared and implemented.
 * @returns {MappedTasksToMilestones} An object containing the different milestones extracted from the tasks, each containing a title and the list of tasks.
 */
const mapTasksToMilestone = (currentDate: Date, tasksList: Task[], filters = FILTERS): MappedTasksToMilestones => {
    let newMappedTasks: any = {};

    tasksList.forEach(task => {
        let hasTaskBeenAllocated = false;
        let taskDate: Date = new Date(task.interval.start);

        for (let milestoneFilter of filters) {
            if (milestoneFilter.filter(currentDate, taskDate)) {
                if (!newMappedTasks[milestoneFilter.id])
                    newMappedTasks[milestoneFilter.id] =
                        { tasks: [], title: milestoneFilter.title } as Milestone;
                newMappedTasks[milestoneFilter.id].tasks.push(task);
                hasTaskBeenAllocated = true;
                break;
            }
        }
        if (!hasTaskBeenAllocated) {
            if (!newMappedTasks.older)
                newMappedTasks.older = { tasks: [], title: "Older" };
            newMappedTasks.older.tasks.push(task);
        }
    })
    return newMappedTasks;
}

export default mapTasksToMilestone;