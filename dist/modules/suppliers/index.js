"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierService = exports.supplierController = exports.supplierRoutes = void 0;
const express_1 = require("express");
const supplier_controller_1 = require("./supplier.controller");
const router = (0, express_1.Router)();
// Public routes
router.get('/', supplier_controller_1.supplierController.getSuppliers);
router.get('/:idOrSlug', supplier_controller_1.supplierController.getSupplier);
router.get('/:idOrSlug/products', supplier_controller_1.supplierController.getSupplierProducts);
exports.supplierRoutes = router;
var supplier_controller_2 = require("./supplier.controller");
Object.defineProperty(exports, "supplierController", { enumerable: true, get: function () { return supplier_controller_2.supplierController; } });
var supplier_service_1 = require("./supplier.service");
Object.defineProperty(exports, "supplierService", { enumerable: true, get: function () { return supplier_service_1.supplierService; } });
//# sourceMappingURL=index.js.map