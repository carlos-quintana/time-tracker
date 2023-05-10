import { Task, Milestone, MappedTasksToMilestones, MilestoneFilter } from "../../types";
import { FILTERS } from "./milestoneFilters";

/**
 * @type {Milestone} - This will be the default category for all of the tasks who don't pass the filters to any other category.
 */
const DEFAULT_MILESTONE: Milestone = { tasks: [], title: "Older" };

/**
 * This function takes an ordered list of Tasks (by starting timestamp) and categorizes them into different established milestones like Today, Yesterday, Past Week (the last 7 days), etc.
 * For this we go through each task and check if it's starting timestamp belongs to any of these milestones using different functions that compare two timestamps. Each milestone also contains a String thast will be displayed as a title of the section.
 * @param {Date} currentDate - The date of the system of the user, as these values are calculated relative to it.
 * @param {Array<Task>} tasksList - The list of chronologically ordered tasks to be categorized.
 * @param {Array<MilestoneFilter>} [filters] - The array of milestone filters to be evaluated. Default value is the filters coming from a separate file where they're declared and implemented. The filters come in chronological order.
 * @returns {MappedTasksToMilestones} An object containing the different milestones extracted from the tasks, each containing a title and the list of tasks.
 */
const mapTasksToMilestone = (currentDate: Date, tasksList: Task[], filters: MilestoneFilter[] = FILTERS): MappedTasksToMilestones => {
    let newMappedTasks: any = {};
    // Clone this object, otherwise it would reuse the same reference and create ghost copies of the tasks
    let defaultMilestone = JSON.parse(JSON.stringify(DEFAULT_MILESTONE))

    tasksList.forEach(task => {
        // If after going through all of the filters this flag hasn't been set to true, then the task goes into a default category called "Older"
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
                newMappedTasks.older = defaultMilestone;
            newMappedTasks.older.tasks.push(task);
        }
    })
    return newMappedTasks;
}

export default mapTasksToMilestone;