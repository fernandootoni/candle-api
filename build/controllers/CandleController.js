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
Object.defineProperty(exports, "__esModule", { value: true });
const Candle_1 = require("../models/Candle");
class CandleController {
    save(candle) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCandle = yield Candle_1.CandleModel.create(candle);
            return newCandle;
        });
    }
    findLastCandles(quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const n = quantity > 0 ? quantity : 10;
            const lastCandles = yield Candle_1.CandleModel
                .find()
                .sort({ _id: -1 })
                .limit(n);
            return lastCandles;
        });
    }
}
exports.default = CandleController;
