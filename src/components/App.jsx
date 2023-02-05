import React, { useState, useEffect } from "react"
import exampleEntriesFromJSON from "../exampleEntries.json"
import PanelData from "./PanelData"
import PanelInputs from "./PanelInputs"

// The purpose of initializing the state to unll is so that the useEffect with the entriesList as dependencies 
// does not run when the component is mounted, as it would keep overwriting the Local Storage with empty data.
// This will also work when in Strict Mode
const INITIAL_ENTRIES_STATE = null

export default function App() {
  // For the time being the LocalStorage will be used a data base
  const [entriesList, setEntriesList] = useState(INITIAL_ENTRIES_STATE)

  // At the first loading of the app we will perform a check on the Local storage:
  // If there is no data in the Local storage it means it's the first time of the user in the page
  //    so we load a set of example tasks from a json file
  // Otherwise we will assume there is existing data and load it onto the app, effectively mantaining
  //    data over page reloads
  useEffect(() => {
    console.log("> Entering the initial useEffect")
    let localStorageEntries = localStorage.getItem("entriesList")
    console.log("Current stuff in the local Storage:")
    console.log({ localStorageEntries })
    if (localStorageEntries === null) {
      console.log("+ The stuff in local storage is NULL, will store example tasks:")
      localStorage.clear()
      let exampleEntries = exampleEntriesFromJSON.slice(0, 4)
      console.log("The example tasks to be added are:")
      console.log({ exampleEntries })
      localStorage.setItem('entriesList', JSON.stringify(exampleEntries));
      setEntriesList(exampleEntries)
      console.log("Stored the example tasks in the local storage and set the state")
      console.log({ localStorageEntries: localStorage.getItem("entriesList") })
    }
    else {
      console.log("- The stuff in local storage is NOT NULL, will update state with its current tasks:")
      setEntriesList(JSON.parse(localStorageEntries))
    }
    console.log("< Exiting the initial useEffect")
  }, [])

  // Everytime the list of entries is updated, the Local Storage shall be updated as well. This includes
  // actions of creating, editing or removing entries. This is where REST operations will go
  useEffect(() => {
    console.log("> Entering the entriesList useEffect")
    console.log({ localStorageEntries: localStorage.getItem("entriesList") })
    console.log({ currentStateEntries: entriesList })
    // The first time the component is mounted we will ignore this hook and not set any data in local storage
    if (entriesList !== INITIAL_ENTRIES_STATE) {
      localStorage.setItem('entriesList', JSON.stringify(entriesList));
      console.log({ localStorageEntries: localStorage.getItem("entriesList") })
      console.log({ currentStateEntries: entriesList })
    }
    console.log("< Exiting the entriesList useEffect")
  }, [entriesList])

  // Function that acts as the Create data whenever the new task input is submitted
  const createNewEntry = (entryName, entryInterval) => {
    console.log("Inside createNewEntry")
    console.log({ entriesList })
    let newEntryObject = {
      id: Date.now(),
      name: entryName,
      interval: entryInterval
    }
    console.log({ entriesList })
    setEntriesList([...entriesList, newEntryObject])
  }

  const editEntry = (idEdit, newEntry) => {
    console.log(`Editing the entry with id ${idEdit}`)
    console.log(newEntry)
    setEntriesList(entriesList.map(entry => entry.id === idEdit ? newEntry : entry))
  }

  const deleteEntry = id => {
    console.log(`Deleting the entry with id ${id}`)
    setEntriesList(entriesList.filter(el => el.id !== id))
  }

  const resetAppData = () => {
    console.warn("Resetting the Local Storage data stored in the app")
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div>
      <h2>Time Tracker application</h2>
      <PanelInputs
        createNewEntry={createNewEntry} />
      <PanelData
        entriesList={entriesList !== INITIAL_ENTRIES_STATE ? entriesList : []}
        editEntry={editEntry}
        deleteEntry={deleteEntry} />
      <button onClick={resetAppData}> Reset the LocalStorage </button>
    </div>
  )
}