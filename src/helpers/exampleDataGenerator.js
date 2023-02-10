/**
 * This script is used to generate large amounts of dummy data that can simulate the actions of a user, for use in the development and testing of the application
 */

/** How many ms there are in a minute */
const MINUTE = 60000;
/** How many ms there are in an hour */
const HOUR = 3600000;
/** The minimum amount of ms that the entry will have */
const MIN_ENTRY_TIME = 15 * MINUTE;
/** The minimum amount of ms that will be added to the entry from the base duration */
const MIN_INCREMENT_TIME = HOUR * 2;
/** The minimum amount of ms to jump in between entries */
const MIN_GAP_TIME = 5 * MINUTE;

function generateEntry(starterTimestamp, taskIdentifier = null) {
    console.log(`Creating a new entry`)
    console.log(`initialTimestamp: ${starterTimestamp}, ${new Date(starterTimestamp)}\ntaskIdentifier: ${taskIdentifier}`)

    let intervalStart = starterTimestamp
    let timeIncrement = Math.floor((MIN_ENTRY_TIME) + Math.random() * MIN_INCREMENT_TIME)
    let intervalEnd = intervalStart + timeIncrement

    console.log("timeIncrement", timeIncrement)
    console.log(`${Math.floor(timeIncrement / HOUR)} hours, ${Math.floor((timeIncrement % HOUR) / MINUTE)} minutes, ${Math.floor(timeIncrement % MINUTE)} seconds`)
    console.log("intervalStart", intervalStart, new Date(intervalStart))
    console.log("intervalEnd", intervalEnd, new Date(intervalEnd))

    if (taskIdentifier !== null) {
        /* The two following lines will replace the last 4 digits of the timestamps and
         add the task identifier number that was given. For example, if theres a task
         identifier of 13 a timestamp could become 1543214280013*/
        intervalStart = Math.floor(intervalStart / 1000) * 1000 + taskIdentifier
        intervalEnd = Math.floor(intervalEnd / 1000) * 1000 + taskIdentifier
        console.log("After assigning task")
        console.log("intervalStart", intervalStart, new Date(intervalStart))
        console.log("intervalEnd", intervalEnd, new Date(intervalEnd))
    }

    return [intervalStart, intervalEnd]
}

// For this specific example the dates will begin in Jan 2nd of 2023 at 9 am (-5)
let starterDay = 2;
const starterTimestamp = new Date(new Date(2023, 0, starterDay, 9-5)).getTime()

let examples = []
// This variable will keep track of where the next task is supposed to start
let timestampPointer = starterTimestamp

const NUM_ENTRIES = 25;
// Tasks pool means all of the entries will belong to any given Task n
const TASKS_POOL = 7

for (let i = 1; i <= NUM_ENTRIES; i++) {
    console.log(`Generating entry ${i}`)
    taskAssigned = Math.floor(1 + Math.random() * TASKS_POOL)
    let newEntryInterval = generateEntry(timestampPointer, i)
    console.log("New entry interval: ", newEntryInterval)
    examples.push({
        id: i,
        // For the entry name just put one of the tasks from the pool
        name: `Task ${taskAssigned}`,
        duration: newEntryInterval[1]-newEntryInterval[0],
        intervals: newEntryInterval,
        // Also keep in the JSON a formatted version of the interval for readibility
        formattedIntervals: [new Date(newEntryInterval[0]),new Date(newEntryInterval[1])]
    })

    // Chain the next entry with the last pointer from the previous one
    timestampPointer = newEntryInterval[1] + Math.floor(Math.random() * MIN_GAP_TIME);
    console.log(`timestampPointer: ${timestampPointer}`)
    console.log(`hour timestampPointer: ${(new Date(timestampPointer)).getHours()}`)
    // If the final time of the entry is beyond 5 pm (-5) then jump to the next day
    if ((new Date(timestampPointer)).getHours() > 17-5) {
        starterDay += 1
        timestampPointer = new Date(new Date(2023, 0, starterDay, 9-5)).getTime()
    }
}

// Finally return a string that can be used in the exampleEntries json
JSON.stringify(examples)