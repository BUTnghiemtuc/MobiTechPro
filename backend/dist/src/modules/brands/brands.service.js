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
exports.BrandsService = void 0;
const data_source_1 = require("../../config/data-source");
const brands_entity_1 = require("./brands.entity");
const brandRepository = data_source_1.AppDataSource.getRepository(brands_entity_1.Brand);
class BrandsService {
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield brandRepository.find({
                order: { displayOrder: 'ASC' }
            });
        });
    }
    static findActive() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield brandRepository.find({
                where: { isActive: true },
                order: { displayOrder: 'ASC' }
            });
        });
    }
    static findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield brandRepository.findOneBy({ id });
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = brandRepository.create(data);
            return yield brandRepository.save(brand);
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield brandRepository.update(id, data);
            return yield brandRepository.findOneBy({ id });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield brandRepository.delete(id);
        });
    }
}
exports.BrandsService = BrandsService;
//# sourceMappingURL=brands.service.js.map