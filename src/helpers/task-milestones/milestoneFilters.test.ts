import { isSameDay } from "./milestoneFilters";

describe("Test milestone filter for Today", () => {
    test("Validate a correct date", () => {
        const dateA = new Date("2023-03-01 12:00");
        const dateB = new Date("2023-03-01 13:00")

        expect(isSameDay(dateA, dateB)).toBe(true);
    })
})