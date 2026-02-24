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
const data_source_1 = require("../../config/data-source");
const addresses_entity_1 = require("./addresses.entity");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
const addressRepository = data_source_1.AppDataSource.getRepository(addresses_entity_1.Address);
// Get all addresses for current user
router.get('/', auth_middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addresses = yield addressRepository.find({
            where: { user: { id: req.user.id } },
            order: { isDefault: 'DESC', created_at: 'DESC' },
        });
        res.json(addresses);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch addresses' });
    }
}));
// Get single address
router.get('/:id', auth_middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield addressRepository.findOne({
            where: { id: parseInt(req.params.id), user: { id: req.user.id } },
        });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json(address);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch address' });
    }
}));
// Create new address
router.post('/', auth_middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, phone, address, city, district, ward, zipCode, label, isDefault } = req.body;
        // If setting as default, unset other defaults first
        if (isDefault) {
            yield addressRepository.update({ user: { id: req.user.id }, isDefault: true }, { isDefault: false });
        }
        const newAddress = addressRepository.create({
            fullName,
            phone,
            address,
            city,
            district,
            ward,
            zipCode,
            label,
            isDefault: isDefault || false,
            user: req.user,
        });
        yield addressRepository.save(newAddress);
        res.status(201).json(newAddress);
    }
    catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ message: 'Failed to create address' });
    }
}));
// Update address
router.put('/:id', auth_middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield addressRepository.findOne({
            where: { id: parseInt(req.params.id), user: { id: req.user.id } },
        });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        // If setting as default, unset other defaults first
        if (req.body.isDefault && !address.isDefault) {
            yield addressRepository.update({ user: { id: req.user.id }, isDefault: true }, { isDefault: false });
        }
        Object.assign(address, req.body);
        yield addressRepository.save(address);
        res.json(address);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update address' });
    }
}));
// Delete address
router.delete('/:id', auth_middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield addressRepository.findOne({
            where: { id: parseInt(req.params.id), user: { id: req.user.id } },
        });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        yield addressRepository.remove(address);
        res.json({ message: 'Address deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete address' });
    }
}));
// Set address as default
router.post('/:id/default', auth_middleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield addressRepository.findOne({
            where: { id: parseInt(req.params.id), user: { id: req.user.id } },
        });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        // Unset other defaults
        yield addressRepository.update({ user: { id: req.user.id }, isDefault: true }, { isDefault: false });
        // Set this as default
        address.isDefault = true;
        yield addressRepository.save(address);
        res.json(address);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to set default address' });
    }
}));
exports.default = router;
//# sourceMappingURL=addresses.routes.js.map