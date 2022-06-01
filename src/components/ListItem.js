export default function ListItem({ itemData, editTaskCallback, deleteTaskCallback }) {
    const { id, description, secondsCount } = itemData;
    const timeToDisplay = formatToHoursMinutesSeconds(secondsCount);
    return (
        <>
            <li>
                <p className="task-id">{`(${id})`}</p>
                <p className="task-description">{`${description}`}</p>
                <p className="task-time">{`${timeToDisplay}`}</p>
                {/* {`(${id}) ${description} | ${timeToDisplay}`} */}
                <div className="entry-controls">
                    <button
                        className="button btn-yellow"
                        onClick={() => editTaskCallback(id)}
                    >
                        Edit
                    </button>
                    <button
                        className="button btn-red"
                        onClick={() => deleteTaskCallback(id)}
                    >
                        Delete
                    </button>
                </div>
            </li>
        </>
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