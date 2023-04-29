import { MilestoneFilter } from "../../types";

/**
 * This function compares the UNIX timestamp values of two dates and returns whether a given date is future of another one.
 * @param {Date} dateBase - The date that we want to test around.
 * @param {Date} dateFuture - The date that we want to test if it's future to dateBase.
 * @returns {boolean} - Whether dateFuture is indeed in the future.
 * @example isFuture(new Date('Mar 03 2023 12:00'), new Date('Mar 04 2023 12:00'))
 * true
 */
export const isFuture = (dateBase: Date, dateFuture: Date): boolean => {
    // If the timestamp given to test is bigger than the base date
    return (dateFuture.getTime() - dateBase.getTime()) > 0;
}

/**
 * This function compares two Date objects by comparing its days, months and years to determine whether they happen in the same day
 * @param {Date} dateA - The first date to compare.
 * @param {Date} dateB - The second date to compare.
 * @returns  {boolean} - Whether the two days happen in the same day.
 * @example isSameDay(new Date('Mar 03 2023 08:00'), new Date('Mar 03 2023 12:00'))
 * true
 */
export const isSameDay = (dateA: Date, dateB: Date): boolean => {
    // If the date is the same, regardless of time
    return (
        dateA.getDate() === dateB.getDate() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getFullYear() === dateB.getFullYear())
};

/**
 * This function compares two Date objects to determine if the second Date happens in the day before the first Date.
 * @param dateBase - The date we want to test around.
 * @param dateYesterday  The date that we want to test if it's yesterday relative to dateBase.
 * @returns {boolean} - Whether dateYesterday is indeed in the previous day.
 * @example isYesterday(new Date('Mar 03 2023 12:00'), new Date('Mar 02 2023 12:00'))
 * true
 */
export const isYesterday = (dateBase: Date, dateYesterday: Date): boolean => {
    // If the dateYesterday timestamp is within 24 hours + 1 min of the dateBase date at 00:00
    const timeDifference = ((new Date(dateBase.toDateString()).getTime()) - dateYesterday.getTime());
    return timeDifference > 0 && timeDifference < 24 * 3600 * 1000 + 60 * 1000;
}

/**
 * This function compares two Date objects to determine if the second Date happens within seven days before of the first Date.
 * @param dateBase - The date we want to test around.
 * @param datePastWeek  The date that we want to test if it's past week relative to dateBase.
 * @returns {boolean} - Whether datePastWeek is indeed within the previous seven days.
 * @example isPastWeek(new Date('Mar 03 2023 12:00'), new Date('Feb 27 2023 12:00'))
 * true
 */
export const isPastWeek = (dateBase: Date, datePastWeek: Date): boolean => {
    // If the yesterday timestamp is within 7* 24 hours + 1 min of the dateBase
    const timeDifference = dateBase.getTime() - datePastWeek.getTime();
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
    title: "Last 7 days",
    filter: isPastWeek
}

// Idea: Change the filter of the last 7 days to one checking this week and another for the past week (from Mon to Sun).
// Make another filter for this month (by checking Date.getMonth()), and also for past month (Checking again Date.getMonth while also checking for the year for December), maybe this year as well and past year too.

export const FILTERS: MilestoneFilter[] = [todayFilter, futureFilter, yesterdayFilter, pastWeekFilter]