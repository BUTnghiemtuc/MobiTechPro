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
const data_source_1 = require("../src/config/data-source");
const users_entity_1 = require("../src/modules/users/users.entity");
const products_entity_1 = require("../src/modules/products/products.entity");
const tags_service_1 = require("../src/modules/products/tags.service");
const bcrypt = __importStar(require("bcrypt"));
function verifyTags() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚀 Initializing Data Source...");
        yield data_source_1.AppDataSource.initialize();
        try {
            console.log("✅ Data Source has been initialized!");
            // 1. Get or Create a Test User (Admin)
            let admin = yield data_source_1.AppDataSource.getRepository(users_entity_1.User).findOne({ where: { role: users_entity_1.UserRole.ADMIN } });
            if (!admin) {
                console.log("⚠️ No Admin found, creating one...");
                admin = new users_entity_1.User();
                admin.username = "admin_test_tags";
                admin.email = "admin_test_tags@example.com";
                admin.password_hash = yield bcrypt.hash("password123", 10);
                admin.role = users_entity_1.UserRole.ADMIN;
                admin = yield data_source_1.AppDataSource.getRepository(users_entity_1.User).save(admin);
                console.log(`✅ Created Admin User: ${admin.username} (ID: ${admin.id})`);
            }
            else {
                console.log(`ℹ️ Using existing Admin User: ${admin.username} (ID: ${admin.id})`);
            }
            // 2. Get or Create a Test Product
            let product = yield data_source_1.AppDataSource.getRepository(products_entity_1.Product).findOne({ order: { id: "DESC" } });
            if (!product) {
                console.log("⚠️ No Product found, creating one...");
                product = new products_entity_1.Product();
                product.title = "Test Product for Tags";
                product.description = "This is a test product";
                product.price = 1000;
                product.quantity = 10;
                product.sell_quantity = 0;
                product.user = admin;
                product = yield data_source_1.AppDataSource.getRepository(products_entity_1.Product).save(product);
                console.log(`✅ Created Product: ${product.title} (ID: ${product.id})`);
            }
            else {
                console.log(`ℹ️ Using valid Product: ${product.title} (ID: ${product.id})`);
            }
            // 3. Create a Tag
            const tagName = `Test Tag ${Date.now()}`;
            const tagColor = "#FF0000";
            console.log(`🔄 Creating Tag: ${tagName}...`);
            const tag = yield tags_service_1.TagsService.createTag(tagName, tagColor, admin.id);
            console.log(`✅ Tag Created: ${tag.name} (ID: ${tag.id})`);
            // 4. Assign Tag to Product
            console.log(`🔄 Assigning Tag (ID: ${tag.id}) to Product (ID: ${product.id})...`);
            yield tags_service_1.TagsService.assignTagToProduct(product.id, tag.id);
            // Verify Assignment
            let updatedProduct = yield data_source_1.AppDataSource.getRepository(products_entity_1.Product).findOne({
                where: { id: product.id },
                relations: ["tags"]
            });
            const assigned = updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.tags.some(t => t.id === tag.id);
            if (assigned) {
                console.log("✅ Tag successfully assigned to Product!");
            }
            else {
                console.error("❌ Failed to assign Tag to Product!");
            }
            // 5. Remove Tag from Product
            console.log(`🔄 Removing Tag (ID: ${tag.id}) from Product (ID: ${product.id})...`);
            yield tags_service_1.TagsService.removeTagFromProduct(product.id, tag.id);
            // Verify Removal
            updatedProduct = yield data_source_1.AppDataSource.getRepository(products_entity_1.Product).findOne({
                where: { id: product.id },
                relations: ["tags"]
            });
            const removed = !(updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.tags.some(t => t.id === tag.id));
            if (removed) {
                console.log("✅ Tag successfully removed from Product!");
            }
            else {
                console.error("❌ Failed to remove Tag from Product!");
            }
        }
        catch (error) {
            console.error("❌ Error during verification:", error);
        }
        finally {
            yield data_source_1.AppDataSource.destroy();
            console.log("🏁 Data Source destroyed.");
        }
    });
}
verifyTags();
//# sourceMappingURL=verify_tags.js.map