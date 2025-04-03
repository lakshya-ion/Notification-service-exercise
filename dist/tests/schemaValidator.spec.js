"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schemaValidator_1 = require("../src/schemaValidator");
describe("Schema Validation", function () {
    test("Valid Digest Profile with Schedule", function () {
        var validDigestData = {
            profileName: "Energy M&A",
            u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
            type: "Digest",
            isActive: true,
            schedule: {
                monday: ["08:00"],
                friday: ["12:00"],
            },
        };
        expect((0, schemaValidator_1.validateData)(validDigestData)).toBe(true);
    });
    test("Valid Immediate Profile (without Schedule)", function () {
        var validImmediateData = {
            profileName: "Energy M&A",
            u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
            type: "Immediate",
            isActive: true,
        };
        expect((0, schemaValidator_1.validateData)(validImmediateData)).toBe(true);
    });
    test("Invalid Digest Profile without Schedule", function () {
        var invalidDigestData = {
            profileName: "Energy M&A",
            u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
            type: "Digest",
            isActive: true,
        };
        expect(function () { return (0, schemaValidator_1.validateData)(invalidDigestData); }).toThrow("data must have required property 'schedule', data must match \"then\" schema");
    });
    test("Invalid Immediate Profile (with Schedule)", function () {
        var invalidImmediateData = {
            profileName: "Energy M&A",
            u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
            type: "Immediate",
            isActive: true,
            schedule: {
                monday: ["08:00"],
            },
        };
        expect(function () { return (0, schemaValidator_1.validateData)(invalidImmediateData); }).toThrow('data must NOT be valid, data must match "else" schema');
    });
    test("Invalid Schedule Time Format", function () {
        var invalidTimeData = {
            profileName: "Energy M&A",
            u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
            type: "Digest",
            isActive: true,
            schedule: {
                monday: ["08:30"],
            },
        };
        expect(function () { return (0, schemaValidator_1.validateData)(invalidTimeData); }).toThrow('data/schedule/monday/0 must match pattern "^(0[7-9]|1[0-9]):00$"');
    });
});
