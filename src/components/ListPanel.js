import ListItem from "./ListItem"

export default function ListPanel({ entriesList }) {
    console.log("Entries list", entriesList)
    return (
        <>
            <h2>List panel:</h2>
            <ul>
                {entriesList.map((entry, index) =>
                    <ListItem key={index} itemData= {entry}/>
                )}
            </ul>
        </>
    );
}
