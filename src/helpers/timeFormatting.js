// Take an integer and return an array with the amount of whole hours, minutes and remaning seconds it represents
export function secondsToHMSArray(secondsInput) {
    let hours = Math.floor(secondsInput / 3600)
    let minutes = Math.floor(secondsInput / 60) % 60
    let seconds = secondsInput % 60
    return [hours, minutes, seconds]
}

// Take an integer and return a string with the time formatted in a nice manner H:MM:SS
export function secondsToFormattedHMS(secondsInput) {
    let [hours, minutes, seconds] = secondsToHMSArray(secondsInput)
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`
}

// TODO
export function timestampToDateSnake(timestamp) {
    let dateObject = new Date(timestamp)
    let year = dateObject.getFullYear()
    let month = dateObject.getMonth() + 1 > 9 ? dateObject.getMonth() + 1 : `0${dateObject.getMonth() + 1}`
    let day = dateObject.getDate() > 9 ? dateObject.getDate() : `0${dateObject.getDate()}`
    return `${year}-${month}-${day}`
}

// The reason the function asks for a timestamp is to preserve the information about the time (hours, minutes and seconds)
export function dateSnakeToTimestamp(dateString, oldTimestamp) {
    let [year, month, day] = dateString.split("-")
    let dateObject = new Date(oldTimestamp)
    dateObject.setDate(day)
    dateObject.setMonth(parseInt(month) - 1)
    dateObject.setFullYear(year)
    return dateObject.getTime()
}

// TODO
export function timestampToDateToDisplay(timestamp) {
    return (new Date(timestamp)).toLocaleString().split(",")[0].trim()
}

// TODO
export function timestampToHMS(timestamp) {
    let dateObject = new Date(timestamp)
    let [hours, minutes, seconds] = [dateObject.getHours(), dateObject.getMinutes(), dateObject.getSeconds()]
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`
}

// The reason the function asks for a timestamp is to preserve the information about the time (hours, minutes and seconds)
export function HMSToTimestamp(timeString, oldTimestamp) {
    // console.log("Inside of HMSToTimestamp")
    // console.log({timeSplit: timeString.split(":")})
    let [hours, minutes, seconds] = timeString.split(":")
    let dateObject = new Date(oldTimestamp)
    dateObject.setHours(hours)
    dateObject.setMinutes(minutes)
    dateObject.setSeconds(seconds)
    // console.log({oldTimestamp})
    // console.log({oldTimestamp: new Date(oldTimestamp)})
    // console.log({newTimestamp: dateObject.getTime()})
    // console.log({newTimestamp: new Date(dateObject.getTime())})
    return dateObject.getTime()
}

// TODO
export function timestampToTimeToDisplay(timestamp) {
    return (new Date(timestamp)).toLocaleString().split(",")[1].trim()
}
