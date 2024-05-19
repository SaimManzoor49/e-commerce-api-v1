"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtmlForStock = void 0;
const getHtmlForStock = ({ email, product, avaliablity, }) => {
    return avaliablity
        ? `
    <h1>Hello World!!!</h1>
    `
        : `
    <h1>Not Helllo</h1>
    `;
};
exports.getHtmlForStock = getHtmlForStock;
