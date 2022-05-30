export default function ListItem({ itemData, editTaskCallback, deleteTaskCallback }) {
    const { id, description, secondsCount } = itemData;
    const timeToDisplay = formatToHoursMinutesSeconds(secondsCount);
    return (
        <div>
            <li>
                {`(${id}) ${description} | ${timeToDisplay}`}
                <button onClick={() => editTaskCallback(id)}>
                    Edit
                </button>
                <button onClick={() => deleteTaskCallback(id)}>
                    Delete
                </button>
            </li>
        </div>
    );
}

/* 
   This code is repeated
   TODO: Extract it into a different module or a custom hook
 */
function formatToHoursMinutesSeconds(totalSeconds) {
    const [hours, minutes, seconds] = extractHoursMinutesSeconds(totalSeconds);
    return `${hours}:${minutes}:${seconds}s`
}

function extractHoursMinutesSeconds(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let seconds = totalSeconds % 60;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return [hours, minutes, seconds];
}