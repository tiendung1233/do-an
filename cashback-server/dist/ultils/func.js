"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeHttps = removeHttps;
exports.getRandomInt = getRandomInt;
exports.extractId = extractId;
function removeHttps(url) {
    const parts = url.split("/");
    return parts[parts.length - 1];
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function extractId(input) {
    const match = input.match(/j:\\?"([^"]+)\\?"/);
    return match ? match[1] : "";
}
