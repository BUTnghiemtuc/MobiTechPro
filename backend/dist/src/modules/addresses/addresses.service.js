"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const addresses_entity_1 = require("./addresses.entity");
let AddressesService = class AddressesService {
    constructor(addressesRepository) {
        this.addressesRepository = addressesRepository;
    }
    findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.addressesRepository.find({
                where: { user: { id: userId } },
                order: { isDefault: 'DESC', created_at: 'DESC' },
            });
        });
    }
    findOne(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.addressesRepository.findOne({
                where: { id, user: { id: userId } },
            });
            if (!address) {
                throw new common_1.NotFoundException('Address not found');
            }
            return address;
        });
    }
    create(user, createAddressDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = this.addressesRepository.create(Object.assign(Object.assign({}, createAddressDto), { user }));
            // If this is set as default, unset other defaults
            if (address.isDefault) {
                yield this.unsetOtherDefaults(user.id);
            }
            return this.addressesRepository.save(address);
        });
    }
    update(id, userId, updateAddressDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.findOne(id, userId);
            // If updating to default, unset other defaults
            if (updateAddressDto.isDefault && !address.isDefault) {
                yield this.unsetOtherDefaults(userId);
            }
            Object.assign(address, updateAddressDto);
            return this.addressesRepository.save(address);
        });
    }
    remove(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.findOne(id, userId);
            yield this.addressesRepository.remove(address);
        });
    }
    setDefault(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.findOne(id, userId);
            // Unset other defaults
            yield this.unsetOtherDefaults(userId);
            // Set this as default
            address.isDefault = true;
            return this.addressesRepository.save(address);
        });
    }
    unsetOtherDefaults(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addressesRepository.update({ user: { id: userId }, isDefault: true }, { isDefault: false });
        });
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(addresses_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map