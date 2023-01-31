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