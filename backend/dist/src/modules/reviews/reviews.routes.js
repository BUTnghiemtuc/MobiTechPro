"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_controller_1 = require("./reviews.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
const reviewsController = new reviews_controller_1.ReviewsController();
router.post("/", auth_middleware_1.authMiddleware, reviewsController.create.bind(reviewsController));
router.get("/:productId", reviewsController.getByProduct.bind(reviewsController));
exports.default = router;
//# sourceMappingURL=reviews.routes.js.map