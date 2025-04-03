import { convertSchedule } from "../src/convertSchedule";

describe("convertSchedule function", () => {
  test("should correctly convert schedule to UTC in ISO format", () => {
    const schedule = {
      monday: ["08:00"],
      friday: ["08:00"],
    };
    const timezone = "America/New_York";

    const expectedOutput = [
      "2025-03-31T12:00:00.000Z", // Monday 08:00 EDT → 12:00 UTC
      "2025-04-04T12:00:00.000Z", // Friday 08:00 EDT → 12:00 UTC
    ];

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

    const expectedOutput = [
      "2025-04-01T21:00:00.000Z", // Wednesday 06:00 JST → 21:00 UTC (Previous Day)
      "2025-04-02T09:00:00.000Z", // Wednesday 18:00 JST → 09:00 UTC
    ];

    const result = convertSchedule(schedule, timezone);

    expect(result).toEqual(expectedOutput);
  });
});
