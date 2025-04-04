"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var convertSchedule_1 = require("../src/convertSchedule");
describe("convertSchedule function", function () {
    test("should correctly convert schedule to America/New_York time", function () {
        var schedule = {
            monday: ["08:00"],
            friday: ["08:00"],
        };
        var timezone = "America/Los_Angeles";
        var expectedOutput = ["2025-03-31 11:00 EDT", "2025-04-04 11:00 EDT"];
        var result = (0, convertSchedule_1.convertSchedule)(schedule, timezone);
        expect(result).toEqual(expectedOutput);
    });
    test("should return an empty array for an empty schedule", function () {
        expect((0, convertSchedule_1.convertSchedule)({}, "UTC")).toEqual([]);
    });
    test("should correctly handle multiple times in a single day", function () {
        var schedule = {
            wednesday: ["06:00", "18:00"],
        };
        var timezone = "Asia/Tokyo";
        var expectedOutput = ["2025-04-01 17:00 EDT", "2025-04-02 05:00 EDT"];
        var result = (0, convertSchedule_1.convertSchedule)(schedule, timezone);
        expect(result).toEqual(expectedOutput);
    });
});
