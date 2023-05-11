/**
 * Functions to help formatting and dealing with times and dates.
 * @module TimeFunctions
 */

/**
 * This function takes an arbitrary number of seconds and transforms it into a formatted string in the shape of 'H:MM:SS', where H represents the amount of hours calculated from the given number of seconds, MM represents the minutes and SS the seconds.
 * @param {Number} secondsInput - An arbitrary positive number of seconds.
 * @returns {String} - A String in the shape of 'H:MM:SS' representing the hours, minutes and seconds calculated from the given input.
 * @example secondsToHMSArray(10000)
 * '2:46:40'
 */
export function secondsToFormattedHMS(secondsInput: number): string {
    // TODO: Validate the incoming number
    let hours = Math.floor(secondsInput / 3600)
    let minutes = Math.floor(secondsInput / 60) % 60
    let seconds = secondsInput % 60
    // These 'formatted' variables means that if the number is smaller than 10 it will have a leading zero, so that it has at least two digits. 
    let formattedHours = hours < 10 ? `0${hours}` : hours;
    let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

/**
 * This function takes a String in the shape of 'H:MM:SS' and returns the number of seconds this amount of time represents, by calculating the conversion and sum of the hours, minutes and seconds.
 * @param {String} HMSstring - This string must have the shape 'H:MM:SS' as to represent an amount of time, where H is an arbitrary number of hours, MM is a number in between 0 and 59 and SS is a number in between 0 and 59
 * @returns {Number} - The amount of seconds the input represents.
 * @example formattedHMSToSeconds('1:10:10')
 * 3680
 */
export function formattedHMSToSeconds(HMSstring: string): number {
    // TODO: Validate the incoming string
    let [hours, minutes, seconds] = HMSstring.split(":")
    let total = Number.parseInt(hours) * 3600 + Number.parseInt(minutes) * 60 + Number.parseInt(seconds)
    return total
}

/**
 * This function takes a UNIX timestamp and extracts the year, month and day to return a formatted String where these values are separated by hyphens. This is the same format used in the 'input' tags of type 'date'.
 * @param {Number} timestamp The UNIX time (in ms) for any given date time
 * @returns {String} - A String in the shape of 'YYYY-MM-DD' that represents the date of the given timestamp
 * @example timestampToDateSnake(1672549200000)
 * '2023-01-01'
 */
export function timestampToDateSnake(timestamp: number): string {
    // TODO: Validate the incoming number
    let dateObject = new Date(timestamp)
    let year = dateObject.getFullYear()
    let month = dateObject.getMonth() + 1 > 9 ? dateObject.getMonth() + 1 : `0${dateObject.getMonth() + 1}`
    let day = dateObject.getDate() > 9 ? dateObject.getDate() : `0${dateObject.getDate()}`
    return `${year}-${month}-${day}`
}

/**
 * This function will take a string in the shape of 'YYYY-MM-DD' that represents a date and calculate it's UNIX timestamp. 
 * If another timestamp is provided the function will extract it's values of time (hours, minutes, seconds and ms) and append these in the resulting timestamp.
 * The major use case for this is when we have a timestamp that we want to change it's date information for the value from an input of type 'date', but keep it's same time information.
 * @param {String} dateString - This value represents a date in the shape of 'YYYY-MM-DD'.
 * @param {Number} [oldTimestamp=0] - A UNIX timestamp. 
 * @returns {Number} - A UNIX timestamp that represents the given date
 * @example dateSnakeToTimestamp('2023-01-01', 1679084700000)
 * 1672604700000
 */
export function dateSnakeToTimestamp(dateString: string, oldTimestamp: number = 0): number {
    // TODO: Validate the incoming string
    // TODO: To process a timestamp with value 0
    let [year, month, day] = dateString.split("-")
    let dateObject = new Date(oldTimestamp)
    dateObject.setDate(parseInt(day))
    dateObject.setMonth(parseInt(month) - 1)
    dateObject.setFullYear(parseInt(year))
    return dateObject.getTime()
}

/**
 * This function takes a UNIX timestamp and extracts the hours, minutes and seconds to return a formatted String where these values are separated by colons. This is the same format used in the 'input' tags of type 'time'.
 * @param {Number} timestamp The UNIX time (in ms) for any given date time
 * @returns {String} - A String in the shape of 'H:MM:SS' that represents the time of the given timestamp
 * @example timestampToDateSnake(1672549200000)
 * '12:00:00'
 */
export function timestampToHMS(timestamp: number): string {
    // TODO: Validate the incoming number
    let dateObject = new Date(timestamp)
    let [hours, minutes, seconds] = [dateObject.getHours(), dateObject.getMinutes(), dateObject.getSeconds()]
    let formattedHours = hours < 10 ? `0${hours}` : hours;
    let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

/**
 * This function will take a string in the shape of 'H:MM:SS' that represents a duration of time and calculate it's UNIX timestamp, given another timestamp is provided, which the function will extract it's values of date (year, month and day) and append these in the resulting timestamp.
 * The major use case for this is when we have a timestamp that we want to change it's time information for the value from an input of type 'time', but keep it's same date information.
 * @param {String} timeString - This value represents a time in the shape of 'H:MM:SS'.
 * @param {Number} oldTimestamp - A UNIX timestamp. 
 * @returns {Number} - A UNIX timestamp that represents the given time (and date if provided)
 * @example HMSToTimestamp('16:00:00', 1672604700000)
 * 1672606800000
 */
export function HMSToTimestamp(timeString: string, oldTimestamp: number): number {
    // TODO: Validate the incoming string
    let [hours, minutes, seconds] = timeString.split(":")
    let dateObject = new Date(oldTimestamp)
    dateObject.setHours(parseInt(hours))
    dateObject.setMinutes(parseInt(minutes))
    dateObject.setSeconds(parseInt(seconds))
    return dateObject.getTime()
}

/**
 * This function leverages the Date object function 'toLocaleString' to return a nicely formatted date to be displayed to the user. This might give different results depending on the local settings of the machine where it's executed.
 * @param {Number} timestamp - A UNIX timestamp.
 * @returns {String} The date of the timestamp in a nicely formatted manner, separated by '/'
 * @example timestampToDateToDisplay(1672549200000)
 * '1/1/2023' // might change depending on the settings of the machine where it's executed
 */
export function timestampToDateToDisplay(timestamp: number): string {
    return (new Date(timestamp)).toLocaleString().split(",")[0].trim()
}

/**
 * This function leverages the Date object function 'toLocaleString' to return a nicely formatted time to be displayed to the user. This might give different results depending on the local settings of the machine where it's executed.
 * @param {Number} timestamp - A UNIX timestamp.
 * @returns {String} The time of the timestamp in a nicely formatted manner, separated by ':' and in a.m./p.m. format (given the machine settings allow this)
 * @example timestampToDateToDisplay(1672549200000)
 * '12:00:00 a. m.' // might change depending on the settings of the machine where it's executed
 */
export function timestampToTimeToDisplay(timestamp: number): string {
    return (new Date(timestamp)).toLocaleString().split(",")[1].trim().split('m.')[0].trim()+'m.';
}
