# time-tracker

## Description
With this application you will be able to track your time and improve your productivity by focusing on the tasks with the highest impact.

This is a Work In Progress (WIP) to be showcased on my online portfolio.

Here are some current features that I will be progressively implementing in this project:

>Basic barebones functionality (1st sprint):
- ~~Have a working timer that increments every second.~~
- ~~Have a working timer that displays time in the shape of `hh:mm:ss`.~~
- ~~The timer should have controls to start, pause, resume and stop (reset).~~
- Have an input field to assign each timer session the name of a task.
- To have each of the inputted tasks be displayed on a list.
- Minimum page styling.

>(2nd sprint):
- Be able to edit a task's description and time elapsed.
- Be able to delete a task.
- Tasks should not only have time but also dates.

>(3rd sprint):
- Be able to add, delete and edit projects.
- Be able to assign each task to one or more projects.

> Additional notes:
- Incrementing the timer inside an interval is not a good idea, as JavaScript is single threaded, and the interval is sensitive to small delays. Look into using timestamps and the unix time.


## How to use
>*The following text was mostly generated by Create React App*

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts
In the project directory, you can run:

#### `npm start`
Runs the app in the development mode.\
Open http://localhost:3000 to view it in your browser.

#### `npm test`
Launches the test runner in the interactive watch mode.\

#### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
