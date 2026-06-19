import { upworkClient } from './client.js';

export interface Message {
  id: string;
  sender: string;
  body: string;
  timestamp: number;
}

export class MessageManager {
  async sendMessage(contractId: string, message: string): Promise<boolean> {
    try {
      await upworkClient.sendMessage(contractId, message);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  async getMessages(contractId: string): Promise<Message[]> {
    try {
      const messages = await upworkClient.getMessages(contractId);
      return messages.messages || [];
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }

  async getUnreadMessages(contractId: string): Promise<Message[]> {
    try {
      const messages = await this.getMessages(contractId);
      return messages.filter(m => m.sender !== 'me');
    } catch (error) {
      console.error('Failed to get unread messages:', error);
      throw error;
    }
  }
}

export const messageManager = new MessageManager();
