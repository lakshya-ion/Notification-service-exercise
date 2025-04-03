"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var express_1 = __importDefault(require("express"));
var DBOperations_1 = __importDefault(require("../src/DBOperations"));
var axios_1 = __importDefault(require("axios"));
var Router_1 = __importDefault(require("../src/Router"));
var app = (0, express_1.default)();
app.use("/", Router_1.default);
describe("Unit Tests for data routes", function () {
    describe("Get /", function () {
        test("GET /:u3Id should return 200 and call getData", function () { return __awaiter(void 0, void 0, void 0, function () {
            var u3Id, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jest.spyOn(DBOperations_1.default.prototype, "getData").mockResolvedValue({
                            profileName: "Energy M&A",
                            u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
                            type: "Digest",
                            isActive: true,
                            schedule: {
                                monday: ["08:00"],
                                friday: ["08:00"],
                            },
                        });
                        jest.spyOn(axios_1.default, "get").mockResolvedValue({
                            data: {
                                u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
                                firstName: "Jignesh",
                                lastName: "Patel",
                                email: "jignesh.patel@iongroup.com",
                                timezone: "Asia/Shanghai",
                            },
                        });
                        u3Id = "76DB413D-6B4F-4F88-9821-C12E306D7BD3";
                        return [4 /*yield*/, (0, supertest_1.default)(app).get("/".concat(u3Id))];
                    case 1:
                        res = _a.sent();
                        expect(res.status).toBe(200);
                        expect(res.body).toEqual({
                            u3Id: "76DB413D-6B4F-4F88-9821-C12E306D7BD3",
                            firstName: "Jignesh",
                            lastName: "Patel",
                            email: "jignesh.patel@iongroup.com",
                            timezone: "Asia/Shanghai",
                            profileName: "Energy M&A",
                            type: "Digest",
                            isActive: true,
                            schedule: {
                                monday: ["08:00"],
                                friday: ["08:00"],
                            },
                        });
                        expect(DBOperations_1.default.prototype.getData).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        test("GET /:u3Id should return 404 if data is not found", function () { return __awaiter(void 0, void 0, void 0, function () {
            var u3Id, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jest
                            .spyOn(DBOperations_1.default.prototype, "getData")
                            .mockRejectedValue(new Error("No data found for the given u3Id"));
                        jest.spyOn(axios_1.default, "get").mockResolvedValue("");
                        u3Id = "76DB413D-6B4F-4F88-9821-C12E306D7BD3";
                        return [4 /*yield*/, (0, supertest_1.default)(app).get("/".concat(u3Id))];
                    case 1:
                        res = _a.sent();
                        expect(res.status).toBe(404);
                        expect(res.body).toEqual({ error: "No data found for the given u3Id" });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Unit Tests for data routes", function () {
        describe("POST /", function () {
            test("should return 201 and call saveData", function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockData, mockResponse, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockData = {
                                profileName: "Energy M&A",
                                u3Id: "402A3266-CD0B-4F3E-8193-FE83AE880529",
                                type: "Digest",
                                isActive: true,
                                schedule: {
                                    monday: ["08:00"],
                                    friday: ["08:00"],
                                },
                            };
                            mockResponse = __assign({ id: "123" }, mockData);
                            jest
                                .spyOn(DBOperations_1.default.prototype, "saveData")
                                .mockResolvedValue(mockResponse);
                            return [4 /*yield*/, (0, supertest_1.default)(app).post("/").send(mockData)];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toBe(201);
                            expect(res.body).toEqual({
                                message: "Data inserted successfully",
                                result: mockResponse,
                            });
                            expect(DBOperations_1.default.prototype.saveData).toHaveBeenCalledWith(mockData);
                            return [2 /*return*/];
                    }
                });
            }); });
            test("should return 400 if saveData throws an error", function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockData, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockData = {
                                profileName: "Energy M&A",
                                type: "Digest",
                                isActive: true,
                                schedule: {
                                    monday: ["08:00"],
                                    friday: ["08:00"],
                                },
                            };
                            jest
                                .spyOn(DBOperations_1.default.prototype, "saveData")
                                .mockRejectedValue(new Error("Error in validating data"));
                            return [4 /*yield*/, (0, supertest_1.default)(app).post("/").send(mockData)];
                        case 1:
                            res = _a.sent();
                            expect(res.status).toBe(400);
                            expect(res.body).toEqual({ error: "Error in validating data" });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
