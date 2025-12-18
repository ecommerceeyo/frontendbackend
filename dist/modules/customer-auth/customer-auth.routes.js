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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const controller = __importStar(require("./customer-auth.controller"));
const router = (0, express_1.Router)();
// Public routes
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/google', controller.googleAuth);
// Protected routes (require customer authentication)
router.get('/me', auth_1.authenticateCustomer, controller.getProfile);
router.put('/me', auth_1.authenticateCustomer, controller.updateProfile);
router.put('/password', auth_1.authenticateCustomer, controller.changePassword);
// Address management
router.get('/addresses', auth_1.authenticateCustomer, controller.getAddresses);
router.post('/addresses', auth_1.authenticateCustomer, controller.addAddress);
router.put('/addresses/:addressId', auth_1.authenticateCustomer, controller.updateAddress);
router.delete('/addresses/:addressId', auth_1.authenticateCustomer, controller.deleteAddress);
// Order history
router.get('/orders', auth_1.authenticateCustomer, controller.getOrders);
router.get('/orders/:orderId', auth_1.authenticateCustomer, controller.getOrder);
exports.default = router;
//# sourceMappingURL=customer-auth.routes.js.map