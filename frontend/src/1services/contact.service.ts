import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  submitContact: async (data: ContactData) => {
    const response = await axios.post(`${API_BASE_URL}/contacts`, data);
    return response.data;
  }
};
