"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
var Ajv = require("ajv");
var addFormats = require("ajv-formats");
var ajv = new Ajv({ allErrors: true });
addFormats(ajv);
var timePattern = "^(0[7-9]|1[0-9]):00$";
var allowedTypes = ["Digest", "Immediate"];
var arrayItemSchema = { type: "string", pattern: timePattern };
var schema = {
    type: "object",
    properties: {
        profileName: { type: "string" },
        u3Id: { type: "string", format: "uuid" },
        type: { type: "string", enum: allowedTypes },
        isActive: { type: "boolean" },
        schedule: {
            type: "object",
            properties: {
                monday: { type: "array", items: arrayItemSchema },
                tuesday: { type: "array", items: arrayItemSchema },
                wednesday: { type: "array", items: arrayItemSchema },
                thursday: { type: "array", items: arrayItemSchema },
                friday: { type: "array", items: arrayItemSchema },
            },
            required: [],
            additionalProperties: false,
        },
    },
    required: ["profileName", "u3Id", "type", "isActive"],
    additionalProperties: false,
    if: {
        properties: { type: { const: "Digest" } },
    },
    then: { required: ["schedule"] },
    else: { not: { required: ["schedule"] } },
};
var validate = ajv.compile(schema);
function validateData(data) {
    var valid = validate(data);
    if (!valid) {
        throw new Error(ajv.errorsText(validate.errors));
    }
    return true;
}
