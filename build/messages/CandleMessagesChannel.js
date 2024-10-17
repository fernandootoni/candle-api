"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const dotenv = __importStar(require("dotenv"));
const CandleController_1 = __importDefault(require("../controllers/CandleController"));
const socket_io_1 = require("socket.io");
dotenv.config();
class CandleMessageChannel {
    constructor(server) {
        this._candleController = new CandleController_1.default();
        this._io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.SOCKET_CLIENT_SERVER,
                methods: ["GET", "POST"]
            }
        });
        this._io.on('connection', () => console.log('WebSocket connection success'));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createMessageChannel();
        });
    }
    createMessageChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield (0, amqplib_1.connect)(process.env.AMQP_SERVER);
                console.log('Connected to RabbitMQ');
                this._channel = yield connection.createChannel();
                this._channel.assertQueue(process.env.QUEUE_NAME);
            }
            catch (error) {
                console.error('Connection to RabbitMQ failed');
                console.log(error);
            }
        });
    }
    consumeMessages() {
        this._channel.consume(process.env.QUEUE_NAME, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (!msg) {
                console.log("No message found");
                return;
            }
            const candleObj = JSON.parse(msg.content.toString());
            console.log('- Candle received');
            console.log(candleObj);
            try {
                const candle = yield this._candleController.save(candleObj);
                console.log("- Candle saved at Database");
                this._io.emit(process.env.SOCKET_EVENT_NAME, candle);
                this._channel.ack(msg);
                console.log("- Candle emitted to Client via WebSocket");
            }
            catch (error) {
                console.log(error);
                console.log('Error while trying to process Candle');
            }
        }));
        console.log('Candle consumer started');
    }
}
exports.default = CandleMessageChannel;
