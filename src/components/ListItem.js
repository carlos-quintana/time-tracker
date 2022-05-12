export default function ListItem({ itemData }) {
    const { id, description, secondsCount } = itemData;
    const timeToDisplay = formatHoursMinutesSeconds(
        extractHoursMinutesSeconds(secondsCount));
    return (
        <li>
            {`(${id}) ${description} | ${timeToDisplay}`}
        </li>
    );
}

/* 
   This code is repeated
   TODO: Extract it into a different module or a custom hook
 */
function extractHoursMinutesSeconds(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let seconds = totalSeconds % 60;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return [hours, minutes, seconds];
}

function formatHoursMinutesSeconds(hmsArray) {
    const [hours, minutes, seconds] = hmsArray;
    return `${hours}:${minutes}:${seconds}s`
}