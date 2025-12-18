"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpecificationTemplates = getSpecificationTemplates;
exports.getSpecificationTemplate = getSpecificationTemplate;
exports.getSpecificationsByGroup = getSpecificationsByGroup;
exports.getSpecificationGroups = getSpecificationGroups;
exports.createSpecificationTemplate = createSpecificationTemplate;
exports.updateSpecificationTemplate = updateSpecificationTemplate;
exports.deleteSpecificationTemplate = deleteSpecificationTemplate;
const specification_service_1 = require("./specification.service");
const response_1 = require("../../utils/response");
/**
 * Get all specification templates
 */
async function getSpecificationTemplates(req, res, next) {
    try {
        const templates = await specification_service_1.specificationService.getAll();
        return (0, response_1.successResponse)(res, templates);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get specification template by ID
 */
async function getSpecificationTemplate(req, res, next) {
    try {
        const template = await specification_service_1.specificationService.getById(req.params.id);
        return (0, response_1.successResponse)(res, template);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get specification templates by group
 */
async function getSpecificationsByGroup(req, res, next) {
    try {
        const templates = await specification_service_1.specificationService.getByGroup(req.params.group);
        return (0, response_1.successResponse)(res, templates);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get all unique groups
 */
async function getSpecificationGroups(req, res, next) {
    try {
        const groups = await specification_service_1.specificationService.getGroups();
        return (0, response_1.successResponse)(res, groups);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create a new specification template
 */
async function createSpecificationTemplate(req, res, next) {
    try {
        const template = await specification_service_1.specificationService.create(req.body);
        return (0, response_1.successResponse)(res, template, 'Specification template created successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update a specification template
 */
async function updateSpecificationTemplate(req, res, next) {
    try {
        const template = await specification_service_1.specificationService.update(req.params.id, req.body);
        return (0, response_1.successResponse)(res, template, 'Specification template updated successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete a specification template
 */
async function deleteSpecificationTemplate(req, res, next) {
    try {
        await specification_service_1.specificationService.delete(req.params.id);
        return (0, response_1.successResponse)(res, null, 'Specification template deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=specification.controller.js.map