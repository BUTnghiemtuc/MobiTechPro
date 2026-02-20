import { Router } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Address } from './addresses.entity';
import { authenticateJWT } from '../auth/auth.middleware';

const router = Router();
const addressRepository = AppDataSource.getRepository(Address);

// Get all addresses for current user
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const addresses = await addressRepository.find({
      where: { user: { id: req.user!.id } },
      order: { isDefault: 'DESC', created_at: 'DESC' },
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
});

// Get single address
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const address = await addressRepository.findOne({
      where: { id: parseInt(req.params.id), user: { id: req.user!.id } },
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch address' });
  }
});

// Create new address
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { fullName, phone, address, city, district, ward, zip Code, label, isDefault } = req.body;

    // If setting as default, unset other defaults first
    if (isDefault) {
      await addressRepository.update(
        { user: { id: req.user!.id }, isDefault: true },
        { isDefault: false }
      );
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
      user: req.user!,
    });

    await addressRepository.save(newAddress);
    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ message: 'Failed to create address' });
  }
});

// Update address
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const address = await addressRepository.findOne({
      where: { id: parseInt(req.params.id), user: { id: req.user!.id } },
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, unset other defaults first
    if (req.body.isDefault && !address.isDefault) {
      await addressRepository.update(
        { user: { id: req.user!.id }, isDefault: true },
        { isDefault: false }
      );
    }

    Object.assign(address, req.body);
    await addressRepository.save(address);
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update address' });
  }
});

// Delete address
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const address = await addressRepository.findOne({
      where: { id: parseInt(req.params.id), user: { id: req.user!.id } },
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await addressRepository.remove(address);
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address' });
  }
});

// Set address as default
router.post('/:id/default', authenticateJWT, async (req, res) => {
  try {
    const address = await addressRepository.findOne({
      where: { id: parseInt(req.params.id), user: { id: req.user!.id } },
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Unset other defaults
    await addressRepository.update(
      { user: { id: req.user!.id }, isDefault: true },
      { isDefault: false }
    );

    // Set this as default
    address.isDefault = true;
    await addressRepository.save(address);
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Failed to set default address' });
  }
});

export default router;
