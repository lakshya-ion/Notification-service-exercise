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
var express_1 = __importDefault(require("express"));
var DBOperations_1 = __importDefault(require("./DBOperations"));
var axios_1 = __importDefault(require("axios"));
var app = (0, express_1.default)();
var dbOperations = new DBOperations_1.default();
app.use(express_1.default.json());
app.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dbOperations.saveData(req.body)];
            case 1:
                result = _a.sent();
                res.status(201).json({ message: "Data inserted successfully", result: result });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(400).json({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/:u3Id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var u3Id, userData, result, combinedData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                u3Id = req.params.u3Id;
                return [4 /*yield*/, axios_1.default.get("http://localhost:3000/users/u3ID/".concat(u3Id))];
            case 1:
                userData = _a.sent();
                return [4 /*yield*/, dbOperations.getData({ u3Id: u3Id })];
            case 2:
                result = _a.sent();
                combinedData = __assign(__assign({}, userData.data), result);
                res.status(200).json(combinedData);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(404).json({ error: error_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/create_match", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, contentID_1, profileIDs;
    return __generator(this, function (_a) {
        try {
            payload = req.body;
            contentID_1 = payload.contentId;
            profileIDs = payload.profileIds;
            profileIDs.forEach(function (u3Id) { return __awaiter(void 0, void 0, void 0, function () {
                var userApiData, timezone, DbData, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_1.default.get("http://localhost:3000/users/u3ID/".concat(u3Id))];
                        case 1:
                            userApiData = _a.sent();
                            timezone = userApiData.data.timezone;
                            return [4 /*yield*/, dbOperations.getData({ u3Id: u3Id })];
                        case 2:
                            DbData = _a.sent();
                            result = dbOperations.addMatch({ contentID: contentID_1, timezone: timezone, DbData: DbData });
                            res
                                .status(201)
                                .json({ message: "Matches inserted successfully", result: result });
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
app.listen(4500, function () {
    console.log("Server is running on port 4500");
});
exports.default = app;
