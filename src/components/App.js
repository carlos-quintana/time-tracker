import { useState, useEffect } from "react";
import InputPanel from "./InputPanel"
import ListPanel from "./ListPanel"

export default function App() {

  /*  Entries in the list have the form:
      { id: number, description: string, secondsCount: number }  */
  const [entriesList, setEntriesList] = useState([])

  const exampleTasks = [
    ["Example Task One", 20015],
    ["Example Task Two", 12057],
    ["Example Task Three", 3605],
    ["Example Task Four", 5179],
    ["Example Task Five", 17873],
    ["Example Task Six", 2150],
    ["Example Task Seven", 4102]];

  useEffect(() => setEntriesList(exampleTasks.map((entry, index) => {
    return {
      id: index,
      description: entry[0],
      secondsCount: entry[1],
    }
  })), [])

  const deleteTask = id => {
    console.log(`Requested to delete the task with ${id}`)
    const selectedTask = entriesList.filter(task => task.id === id);
    console.log(selectedTask);
    setEntriesList(entriesList.filter(task => task.id !== id));
  }

  const editTask = (id, newDescription) => {
    console.log(`Requested to edit the task with ${id} with a new description of "${newDescription}"`)
    setEntriesList(
      entriesList.map(task =>
        task.id === id ?
          { ...task, description: newDescription, }
          :
          task
      )
    )
  }

  return (
    <>
      <header>
        <h1>Time Tracker Application</h1>
      </header>
      < InputPanel
        entriesList={entriesList}
        setEntriesList={setEntriesList} />
      < ListPanel
        entriesList={entriesList}
        deleteTaskCallback={deleteTask}
        editTaskCallback={editTask}
      />
    </>
  );
}