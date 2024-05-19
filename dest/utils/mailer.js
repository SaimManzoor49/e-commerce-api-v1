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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockUpdatesMailer = exports.sendEmailForPasswordChange = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const getHtmlForResetPassword_1 = require("../views/getHtmlForResetPassword");
const generateToken_1 = __importDefault(require("./generateToken"));
const getHtmlForStock_1 = require("../views/getHtmlForStock");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 995,
    secure: true,
    auth: {
        user: process.env.APP_GMAIL,
        pass: process.env.APP_GMAIL_PASSWORD,
    },
});
const sendEmailForPasswordChange = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, username, }) {
    try {
        const token = yield (0, generateToken_1.default)({ email });
        const resetUrl = `${process.env.SERVER_HOSTED_URL}/users/reset-password/${token}`;
        const info = transporter.sendMail({
            from: process.env.APP_GMAIL, // sender address
            to: email, // list of receivers
            subject: "Change Password", // Subject line
            text: resetUrl, // plain text body
            html: (0, getHtmlForResetPassword_1.getHtmlForResetPassword)({ username, resetUrl }), // html body
        });
    }
    catch (error) {
        console.log("Something went wrong while sending mail for password reset");
    }
});
exports.sendEmailForPasswordChange = sendEmailForPasswordChange;
const stockUpdatesMailer = (_b) => __awaiter(void 0, [_b], void 0, function* ({ email, product, avaliablity, }) {
    try {
        const productURL = `${process.env.SERVER_HOSTED_URL}/---/${product.slug}`;
        if (avaliablity) {
            const info = transporter.sendMail({
                from: process.env.APP_GMAIL, // sender address
                to: email, // list of receivers
                subject: `${product.name} is in stock now!`, // Subject line
                text: "Hello world!", // plain text body
                html: (0, getHtmlForStock_1.getHtmlForStock)({ email, product, avaliablity }), // html body
            });
        }
        else {
            const info = transporter.sendMail({
                from: process.env.APP_GMAIL, // sender address
                to: email, // list of receivers
                subject: `${product.name} is now out of stock!`, // Subject line
                text: "Hello world!", // plain text body
                html: (0, getHtmlForStock_1.getHtmlForStock)({ email, product, avaliablity }), // html body
            });
        }
    }
    catch (error) {
        console.log("Something went wrong while sending mail for Stock updates");
    }
});
exports.stockUpdatesMailer = stockUpdatesMailer;
