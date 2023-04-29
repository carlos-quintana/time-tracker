import { isSameDay, isFuture, isYesterday, isPastWeek } from "./milestoneFilters";

describe("Test milestone filter for Today", () => {
    test("Validate a correct today", () => {
        // Same day, one hour of difference
        let dateA = new Date("2023-03-01 12:00");
        let dateB = new Date("2023-03-01 13:00");
        expect(isSameDay(dateA, dateB)).toBe(true);
        // Same day, 24 hours of difference
        dateA = new Date("2023-03-01 00:00");
        dateB = new Date("2023-03-01 23:59");
        expect(isSameDay(dateA, dateB)).toBe(true);
    });
    test("Validate an incorrect today", () => {
        // Different days
        let dateA = new Date("2023-03-01 23:00");
        let dateB = new Date("2023-03-02 01:00");
        expect(isSameDay(dateA, dateB)).toBe(false);
    });
});

describe("Test milestone filter for Future", () => {
    test("Validate a correct future", () => {
        // One day and one hour ahead 
        let dateBase = new Date("2023-03-01 23:30");
        let dateFuture = new Date("2023-03-02 00:30");
        expect(isFuture(dateBase, dateFuture)).toBe(true);
        // Three days ahead
        dateBase = new Date("2023-03-01 08:00");
        dateFuture = new Date("2023-03-04 09:30");
        expect(isFuture(dateBase, dateFuture)).toBe(true);
        // Same day but ahead - It is important to have the Today filter first 
        dateBase = new Date("2023-03-01 08:00");
        dateFuture = new Date("2023-03-01 10:00");
        expect(isFuture(dateBase, dateFuture)).toBe(true);
    });
    test("Validate an incorrect future on a previous day", () => {
        // Previous day
        let dateBase = new Date("2023-03-03 08:00");
        let dateFuture = new Date("2023-03-01 10:00");
        expect(isFuture(dateBase, dateFuture)).toBe(false);
    });
});

describe("Test milestone filter for Yesterday", () => {
    test("Validate a correct yesterday", () => {
        // Different days, one hour of difference
        let dateBase = new Date("Mar 03 2023 00:00");
        let dateYesterday = new Date("Mar 02 2023 23:30");
        expect(isYesterday(dateBase, dateYesterday)).toBe(true);
        // Different days, 48 hours minus one minute of difference
        dateBase = new Date("Mar 03 2023 23:59");
        dateYesterday = new Date("Mar 02 2023 00:00");
        expect(isYesterday(dateBase, dateYesterday)).toBe(true);
    });
    test("Validate a correct yesterday different month", () => {
        // Different days, one hour of difference
        let dateBase = new Date("Mar 01 2023 06:00");
        let dateYesterday = new Date("Feb 28 2023 18:30");
        expect(isYesterday(dateBase, dateYesterday)).toBe(true);
    });
    test("Validate a correct yesterday different year", () => {
        // Different days, one hour of difference
        let dateBase = new Date("Jan 01 2023 06:00");
        let dateYesterday = new Date("Dec 31 2022 18:30");
        expect(isYesterday(dateBase, dateYesterday)).toBe(true);
    });
    test("Validate an incorrect yesterday", () => {
        // One day in between 
        let dateBase = new Date("Mar 01 2023 23:59");
        let dateYesterday = new Date("Mar 03 2023 00:00");
        expect(isYesterday(dateBase, dateYesterday)).toBe(false);
        // Same day 
        dateBase = new Date("Mar 03 2023 23:59");
        dateYesterday = new Date("Mar 03 2023 00:00");
        expect(isYesterday(dateBase, dateYesterday)).toBe(false);
    });
})

describe("Test milestone filter for Past Week", () => {
    test("Validate a correct past week", () => {
        // The previous day
        let dateBase = new Date("Mar 03 2023 08:00");
        let datePastWeek = new Date("Mar 02 2023 08:00");
        expect(isPastWeek(dateBase, datePastWeek)).toBe(true);
        // Three days before
        dateBase = new Date("Mar 03 2023 08:00");
        datePastWeek = new Date("Feb 28 2023 08:00");
        expect(isPastWeek(dateBase, datePastWeek)).toBe(true);
        // Seven days before
        dateBase = new Date("Mar 03 2023 08:00");
        datePastWeek = new Date("Feb 24 2023 09:00");
        expect(isPastWeek(dateBase, datePastWeek)).toBe(true);
    });
    test("Validate an incorrect past week", () => {
        // Eight days before
        let dateBase = new Date("Mar 03 2023 09:00");
        let datePastWeek = new Date("Feb 22 2023 23:00");
        expect(isPastWeek(dateBase, datePastWeek)).toBe(false);
        // In the future 
        dateBase = new Date("Mar 03 2023 08:00");
        datePastWeek = new Date("Mar 04 2023 08:00");
        expect(isPastWeek(dateBase, datePastWeek)).toBe(false);
    });
})