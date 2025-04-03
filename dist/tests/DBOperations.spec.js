"use strict";
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
var schemaValidator_1 = require("../src/schemaValidator");
var mongodb_1 = require("mongodb");
var DBOperations_1 = __importDefault(require("../src/DBOperations"));
jest.mock("mongodb", function () {
    return {
        MongoClient: jest.fn().mockImplementation(function () { return ({
            connect: jest.fn().mockResolvedValue(true),
            close: jest.fn().mockResolvedValue(true),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    insertOne: jest.fn().mockResolvedValue({ insertedId: "mockId" }),
                    findOne: jest.fn().mockResolvedValue(null),
                }),
            }),
        }); }),
    };
});
jest.mock("../src/schemaValidator", function () { return ({
    validateData: jest.fn().mockReturnValue(true),
}); });
describe("DBOperations test suite", function () {
    var dbOperations;
    beforeEach(function () {
        dbOperations = new DBOperations_1.default();
        dbOperations.connectDB();
    });
    afterEach(function () {
        jest.restoreAllMocks();
    });
    describe("saveData Tests", function () {
        test("saveData should save the data to db successfully", function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockData, result;
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
                        return [4 /*yield*/, dbOperations.saveData(mockData)];
                    case 1:
                        result = _a.sent();
                        expect(schemaValidator_1.validateData).toHaveBeenCalledWith(mockData);
                        expect(mongodb_1.MongoClient).toHaveBeenCalled();
                        expect(result).toEqual({ insertedId: "mockId" });
                        return [2 /*return*/];
                }
            });
        }); });
        test("saveData should return an error if the record is found in the db", function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockData;
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
                        jest
                            .spyOn(dbOperations.client.db().collection(), "findOne")
                            .mockReturnValue({ user: "lakshya", u3Id: "123456" });
                        return [4 /*yield*/, expect(dbOperations.saveData(mockData)).rejects.toThrow("The data entered already exists")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("getData test suite", function () {
        test("getData should return the full data from the DB", function () { return __awaiter(void 0, void 0, void 0, function () {
            var u3Id, mockData, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        u3Id = "402A3266-CD0B-4F3E-8193-FE83AE880529";
                        mockData = {
                            u3Id: u3Id,
                            profileName: "Energy M&A",
                            type: "Digest",
                            isActive: true,
                            schedule: {
                                monday: ["08:00"],
                                friday: ["08:00"],
                            },
                        };
                        jest
                            .spyOn(dbOperations.client.db().collection(), "findOne")
                            .mockResolvedValue(mockData);
                        return [4 /*yield*/, dbOperations.getData({ u3Id: u3Id })];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockData);
                        return [2 /*return*/];
                }
            });
        }); });
        test("getData should return an error, if the data is not found", function () { return __awaiter(void 0, void 0, void 0, function () {
            var u3ID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        u3ID = "402A3266-CD0B-4F3E-8193-FE83AE880529";
                        return [4 /*yield*/, expect(dbOperations.getData({ u3ID: u3ID })).rejects.toThrow("No data found for the given u3Id")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
