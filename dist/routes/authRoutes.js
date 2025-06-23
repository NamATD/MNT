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
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const User = require('../models/User').default;
        const user = yield User.findOne({ username, password });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = require('jsonwebtoken').sign({ _id: user._id, username: user.username, role: user.role }, 'secret');
        res.json({ token });
    }
    catch (error) {
        const err = error;
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}));
exports.default = router;
