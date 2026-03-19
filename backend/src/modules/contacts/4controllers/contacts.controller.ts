import { Request, Response } from "express";
import { ContactsService } from "../2services/contacts.service";

export class ContactsController {
  static async submit(req: Request, res: Response) {
    try {
      const { name, email, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email and message are required" });
      }

      const contact = await ContactsService.create({ name, email, message });
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const contacts = await ContactsService.getAll();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
