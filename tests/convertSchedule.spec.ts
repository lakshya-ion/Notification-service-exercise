import { convertSchedule } from "../src/convertSchedule";

describe("convertSchedule function", () => {
  test("should correctly convert schedule to America/New_York time", () => {
    const schedule = {
      monday: ["08:00"],
      friday: ["08:00"],
    };
    const timezone = "America/Los_Angeles";

    const expectedOutput = ["2025-03-31 11:00 EDT", "2025-04-04 11:00 EDT"];

    const result = convertSchedule(schedule, timezone);

    expect(result).toEqual(expectedOutput);
  });

  test("should return an empty array for an empty schedule", () => {
    expect(convertSchedule({}, "UTC")).toEqual([]);
  });

  test("should correctly handle multiple times in a single day", () => {
    const schedule = {
      wednesday: ["06:00", "18:00"],
    };
    const timezone = "Asia/Tokyo";

    const expectedOutput = ["2025-04-01 17:00 EDT", "2025-04-02 05:00 EDT"];

    const result = convertSchedule(schedule, timezone);

    expect(result).toEqual(expectedOutput);
  });
});
