import React, { useState, useEffect } from "react"
import exampleEntries from "../exampleEntries.json"
import PanelData from "./PanelData"
import PanelInputs from "./PanelInputs"

export default function App() {
  // For the time being the LocalStorage will be used a data base
  const [entriesList, setEntriesList] = useState([])

  // Function that acts as the Create data whenever the new task input is submitted
  const createNewEntry = (name, duration) => {
    console.log("Inside createNewEntry", entriesList)
    let newEntryObject = {
      id: Date.now(),
      name: name,
      duration: duration
    }
    setEntriesList([...entriesList, newEntryObject])
  }

  useEffect(() => {
    console.log("new entriesList", entriesList)
    console.log("Updating the LocalStorage")
    localStorage.setItem('entriesList', JSON.stringify(entriesList));
  }, [entriesList])

  const editEntry = (idEdit, newEntry) => {
    console.log(`Editing the entry with id ${idEdit}`)
    console.log(newEntry)
    setEntriesList(entriesList.map(entry => entry.id === idEdit ? newEntry : entry))
  }

  const deleteEntry = id => {
    console.log(`Deleting the entry with id ${id}`)
    setEntriesList(entriesList.filter(el => el.id !== id))
  }

  // Load a set of example tasks from a json file
  useEffect(() => setEntriesList(exampleEntries), [])

  return (
    <div>
      <h2>Time Tracker application</h2>
      <PanelInputs
        createNewEntry={createNewEntry} />
      <PanelData
        entriesList={entriesList}
        editEntry={editEntry}
        deleteEntry={deleteEntry} />
    </div>
  )
}