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
var mongodb_1 = require("mongodb");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var convertSchedule_1 = require("./convertSchedule");
var URL = "mongodb://localhost:27017";
var DB_NAME = "growthteam";
var COLLECTION_NAME = "test";
var COLLECTION_NAME_MATCH = "matches";
var DBOperations = /** @class */ (function () {
    function DBOperations() {
        this.client = null;
    }
    DBOperations.prototype.connectDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.client) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.client = new mongodb_1.MongoClient(URL);
                        return [4 /*yield*/, this.client.connect()];
                    case 2:
                        _a.sent();
                        console.log("Connected to '".concat(DB_NAME, "' database."));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // console.error("Database connection error:", error);
                        throw new Error("Database connection failed");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DBOperations.prototype.closeConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.client.close()];
                    case 1:
                        _a.sent();
                        this.client = null;
                        console.log("Database connection closed.");
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DBOperations.prototype.saveData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var db, collection, existingData, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!this.client) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connectDB()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        db = this.client.db(DB_NAME);
                        collection = db.collection(COLLECTION_NAME);
                        return [4 /*yield*/, collection.findOne({ u3Id: data.u3Id })];
                    case 3:
                        existingData = _a.sent();
                        if (existingData) {
                            throw new Error("The data entered already exists");
                        }
                        return [4 /*yield*/, collection.insertOne(data)];
                    case 4:
                        result = _a.sent();
                        console.log("Data inserted successfully:", result.insertedId);
                        return [2 /*return*/, result];
                    case 5:
                        error_2 = _a.sent();
                        // console.error("Error inserting data:", error);
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DBOperations.prototype.getData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var db, collection, retrievedData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!!this.client) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connectDB()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        db = this.client.db(DB_NAME);
                        collection = db.collection(COLLECTION_NAME);
                        return [4 /*yield*/, collection.findOne({ u3Id: data.u3Id })];
                    case 3:
                        retrievedData = _a.sent();
                        if (!retrievedData) {
                            throw new Error("No data found for the given u3Id");
                        }
                        return [2 /*return*/, __assign(__assign({}, data), retrievedData)];
                    case 4:
                        error_3 = _a.sent();
                        // console.error("Error retrieving data:", error);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DBOperations.prototype.saveMatch = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var db, collection, existingData, contentID, dbData, timezone, u3ID, createTime, deliveryTime, scheduleTimes, insData, inserted, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.connectDB()];
                    case 1:
                        _a.sent();
                        db = this.client.db(DB_NAME);
                        collection = db.collection(COLLECTION_NAME_MATCH);
                        return [4 /*yield*/, collection.findOne({ u3Id: data.u3Id })];
                    case 2:
                        existingData = _a.sent();
                        if (existingData) {
                            throw new Error("The data entered already exists");
                        }
                        contentID = data.contentID;
                        dbData = data.DbData;
                        timezone = data.timezone;
                        u3ID = dbData.u3Id;
                        createTime = new Date();
                        deliveryTime = void 0;
                        if (dbData.type === "Digest") {
                            scheduleTimes = (0, convertSchedule_1.convertSchedule)(dbData.schedule, timezone);
                            deliveryTime =
                                scheduleTimes.length > 0
                                    ? scheduleTimes[0]
                                    : createTime.toISOString();
                        }
                        else {
                            deliveryTime = moment_timezone_1.default
                                .tz(createTime, timezone)
                                .tz("America/New_York")
                                .toISOString();
                        }
                        insData = {
                            profileId: u3ID,
                            contentID: contentID,
                            created: createTime,
                            deliveryTime: deliveryTime,
                        };
                        return [4 /*yield*/, collection.insertOne(insData)];
                    case 3:
                        inserted = _a.sent();
                        console.log("Match inserted successfully:", inserted.insertedId);
                        return [2 /*return*/, inserted];
                    case 4:
                        error_4 = _a.sent();
                        // console.error("Error inserting match:", error.message);
                        throw new Error("Failed to insert match: ".concat(error_4.message));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return DBOperations;
}());
exports.default = DBOperations;
