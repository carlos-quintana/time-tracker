import { isSameDay, isYesterday } from "./milestoneFilters";

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

describe("Test milestone filter for Yesterday", () => {
    test("Validate a correct yesterday", () => {
        // Different days, one hour of difference
        let dateToTest = new Date("Mar 03 2023 00:00");
        let dateYesterday = new Date("Mar 02 2023 23:30");
        expect(isYesterday(dateToTest, dateYesterday)).toBe(true);
        // Different days, 48 hours minus one minute of difference
        dateToTest = new Date("Mar 03 2023 23:59");
        dateYesterday = new Date("Mar 02 2023 00:00");
        expect(isYesterday(dateToTest, dateYesterday)).toBe(true);
    });
    test("Validate a correct yesterday different month", () => {
        // Different days, one hour of difference
        let dateToTest = new Date("Mar 01 2023 06:00");
        let dateYesterday = new Date("Feb 28 2023 18:30");
        expect(isYesterday(dateToTest, dateYesterday)).toBe(true);
    });
    test("Validate a correct yesterday different year", () => {
        // Different days, one hour of difference
        let dateToTest = new Date("Jan 01 2023 06:00");
        let dateYesterday = new Date("Dec 31 2022 18:30");
        expect(isYesterday(dateToTest, dateYesterday)).toBe(true);
    });
    test("Validate an incorrect yesterday", () => {
        // One day in between 
        let dateToTest = new Date("Mar 01 2023 23:59");
        let dateYesterday = new Date("Mar 03 2023 00:00");
        expect(isYesterday(dateToTest, dateYesterday)).toBe(false);
        // Same day 
        dateToTest = new Date("Mar 03 2023 23:59");
        dateYesterday = new Date("Mar 03 2023 00:00");
        expect(isYesterday(dateToTest, dateYesterday)).toBe(false);
    });
})