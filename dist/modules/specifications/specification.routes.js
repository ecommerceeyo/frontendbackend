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
const specificationController = __importStar(require("./specification.controller"));
const router = (0, express_1.Router)();
/**
 * @route   GET /api/admin/specifications
 * @desc    Get all specification templates
 * @access  Admin
 */
router.get('/', specificationController.getSpecificationTemplates);
/**
 * @route   GET /api/admin/specifications/groups
 * @desc    Get all unique groups
 * @access  Admin
 */
router.get('/groups', specificationController.getSpecificationGroups);
/**
 * @route   GET /api/admin/specifications/group/:group
 * @desc    Get templates by group
 * @access  Admin
 */
router.get('/group/:group', specificationController.getSpecificationsByGroup);
/**
 * @route   GET /api/admin/specifications/:id
 * @desc    Get specification template by ID
 * @access  Admin
 */
router.get('/:id', specificationController.getSpecificationTemplate);
/**
 * @route   POST /api/admin/specifications
 * @desc    Create a new specification template
 * @access  Admin
 */
router.post('/', specificationController.createSpecificationTemplate);
/**
 * @route   PUT /api/admin/specifications/:id
 * @desc    Update a specification template
 * @access  Admin
 */
router.put('/:id', specificationController.updateSpecificationTemplate);
/**
 * @route   DELETE /api/admin/specifications/:id
 * @desc    Delete a specification template
 * @access  Admin
 */
router.delete('/:id', specificationController.deleteSpecificationTemplate);
exports.default = router;
//# sourceMappingURL=specification.routes.js.map