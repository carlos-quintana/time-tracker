import { MilestoneFilter } from "../../types";

export const isFuture = (dateBase: Date, dateFuture: Date): boolean => {
    // If the timestamp given to test is bigger than the base date
    return (dateFuture.getTime() - dateBase.getTime()) > 0;
}

export const isSameDay = (dateA: Date, dateB: Date): boolean => {
    // If the date is the same, regardless of time
    return (
        dateA.getDate() === dateB.getDate() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getFullYear() === dateB.getFullYear())
};

export const isYesterday = (dateBase: Date, dateYesterday: Date): boolean => {
    // If the yesterday timestamp is within 24 hours + 1 min of the date to test at 00:00
    const timeDifference = ((new Date(dateBase.toDateString()).getTime()) - dateYesterday.getTime());
    return timeDifference > 0 && timeDifference < 24 * 3600 * 1000 + 60 * 1000;
}

export const isPastWeek = (dateBase: Date, datePastWeek: Date): boolean => {
    // If the yesterday timestamp is within 7* 24 hours + 1 min of the date to test at 00:00
    const timeDifference = ((new Date(dateBase.toDateString()).getTime()) - datePastWeek.getTime());
    return timeDifference > 0 && timeDifference < 7 * 24 * 3600 * 1000 + 60 * 1000;
}

const futureFilter: MilestoneFilter = {
    id: "future",
    title: "Tasks in the future",
    filter: isFuture
};

const todayFilter: MilestoneFilter = {
    id: "today",
    title: "Today",
    filter: isSameDay
};

const yesterdayFilter: MilestoneFilter = {
    id: "yesterday",
    title: "Yesterday",
    filter: isYesterday
}

const pastWeekFilter: MilestoneFilter = {
    id: "pastweek",
    title: "Past Week",
    filter: isPastWeek
}

// Idea: Make another filter for this month (by checking Date.getMonth()), and also for past month (Checking again Date.getMonth while also checking for the year for December), maybe this year as well and past year too.

export const FILTERS: MilestoneFilter[] = [futureFilter, todayFilter, yesterdayFilter, pastWeekFilter]