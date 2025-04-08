import { validateData } from "../../src/schemaValidator";

describe("Schema Validation", () => {
  test("Valid Digest Profile with Schedule", () => {
    const validDigestData = {
      profileName: "Energy M&A",
      u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
      type: "Digest",
      isActive: true,
      schedule: {
        monday: ["08:00"],
        friday: ["12:00"],
      },
    };
    expect(validateData(validDigestData)).toBe(true);
  });

  test("Valid Immediate Profile (without Schedule)", () => {
    const validImmediateData = {
      profileName: "Energy M&A",
      u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
      type: "Immediate",
      isActive: true,
    };
    expect(validateData(validImmediateData)).toBe(true);
  });

  test("Invalid Digest Profile without Schedule", () => {
    const invalidDigestData = {
      profileName: "Energy M&A",
      u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
      type: "Digest",
      isActive: true,
    };
    expect(() => validateData(invalidDigestData)).toThrow(
      "data must have required property 'schedule', data must match \"then\" schema"
    );
  });

  test("Invalid Immediate Profile (with Schedule)", () => {
    const invalidImmediateData = {
      profileName: "Energy M&A",
      u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
      type: "Immediate",
      isActive: true,
      schedule: {
        monday: ["08:00"],
      },
    };
    expect(() => validateData(invalidImmediateData)).toThrow(
      'data must NOT be valid, data must match "else" schema'
    );
  });

  test("Invalid Schedule Time Format", () => {
    const invalidTimeData = {
      profileName: "Energy M&A",
      u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
      type: "Digest",
      isActive: true,
      schedule: {
        monday: ["08:30"],
      },
    };
    expect(() => validateData(invalidTimeData)).toThrow(
      'data/schedule/monday/0 must match pattern "^(0[7-9]|1[0-9]):00$"'
    );
  });
});
