import { useState, useEffect } from "react";
import InputPanel from "./InputPanel"
import ListPanel from "./ListPanel"

export default function App() {

  /*  Entries in the list have the form:
      { id: number, description: string, secondsCount: number }  */
  const [entriesList, setEntriesList] = useState([])

  const exampleTasks = [
    { id: 1, description: "Example Task One", secondsCount: 20015 },
    { id: 2, description: "Example Task Two", secondsCount: 12057 },
    { id: 3, description: "Example Task Three", secondsCount: 3605 }];
  useEffect(() => setEntriesList(exampleTasks),[])

  return (
    <>
      <h1>Time Tracker Application</h1>
      < InputPanel
        entriesList={entriesList}
        setEntriesList={setEntriesList} />
      < ListPanel
        entriesList={entriesList} />
    </>
  );
}