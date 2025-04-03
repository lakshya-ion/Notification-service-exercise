"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSchedule = convertSchedule;
var moment_timezone_1 = __importDefault(require("moment-timezone"));
function convertSchedule(schedule, timezone) {
    var result = [];
    var today = (0, moment_timezone_1.default)().tz(timezone);
    Object.entries(schedule).forEach(function (_a) {
        var day = _a[0], times = _a[1];
        times.forEach(function (time) {
            var localDateTime = today.clone().day(day).format("YYYY-MM-DD");
            var localTime = moment_timezone_1.default.tz("".concat(localDateTime, " ").concat(time), "YYYY-MM-DD HH:mm", timezone);
            if (!localTime.isValid()) {
                throw new Error("Invalid date/time format for ".concat(day, " ").concat(time));
            }
            result.push(localTime.utc().toISOString());
        });
    });
    return result;
}
