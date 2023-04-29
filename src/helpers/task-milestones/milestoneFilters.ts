type MilestoneFilter = {
    id: string,
    title: string,
    filter: Function
};

export const isSameDay = (dateA: Date, dateB: Date): boolean => {
    return (
        dateA.getDate() === dateB.getDate() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getFullYear() === dateB.getFullYear())
};

const todayFilter: MilestoneFilter = {
    id: "today",
    title: "Today",
    filter: isSameDay
};

export const isYesterday = (dateA: Date, dateB: Date): boolean => {
    return (
        dateA.getDate() - 1 === dateB.getDate() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getFullYear() === dateB.getFullYear())
}

const yesterdayFilter: MilestoneFilter = {
    id: "yesterday",
    title: "Yesterday",
    filter: isYesterday
}

export const FILTERS: MilestoneFilter[] = [todayFilter, yesterdayFilter]