// HMS stands for Hours Minutes Seconds (hh:mm:ss)
export default function TimerDisplay({ currentSecondsCount }) {
    let extractedHMS = extractHoursMinutesSeconds(currentSecondsCount);
    return (
        <div>
            {formatHoursMinutesSeconds(extractedHMS)}
        </div>
    );
}

function extractHoursMinutesSeconds (totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let seconds = totalSeconds % 60;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return [hours, minutes, seconds];
}

function formatHoursMinutesSeconds (hmsArray) {
    const [hours, minutes, seconds] = hmsArray;
    return `${hours}:${minutes}:${seconds}s`
}