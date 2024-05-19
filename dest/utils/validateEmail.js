"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailFormate = void 0;
const validateEmailFormate = (email) => {
    return !!String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
exports.validateEmailFormate = validateEmailFormate;
