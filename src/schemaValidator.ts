const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const timePattern = "^(0[7-9]|1[0-9]):00$";
const allowedTypes = ["Digest", "Immediate"];
const arrayItemSchema = { type: "string", pattern: timePattern };

const schema = {
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

const validate = ajv.compile(schema);

export function validateData(data) {
  const valid = validate(data);
  if (!valid) {
    throw new Error(ajv.errorsText(validate.errors));
  }
  return true;
}
