import { upworkClient } from './client.js';

export interface Contract {
  id: string;
  title: string;
  client: string;
  budget: number;
  status: string;
  startDate: number;
  endDate?: number;
}

export class ContractManager {
  async getActiveContracts(): Promise<Contract[]> {
    try {
      const contracts = await upworkClient.getContracts();
      return contracts.contracts || [];
    } catch (error) {
      console.error('Failed to get contracts:', error);
      throw error;
    }
  }

  async getContractDetails(contractId: string): Promise<Contract | null> {
    try {
      const contracts = await this.getActiveContracts();
      return contracts.find(c => c.id === contractId) || null;
    } catch (error) {
      console.error('Failed to get contract details:', error);
      throw error;
    }
  }

  async submitDeliverable(contractId: string, deliverable: {
    description: string;
    files?: string[];
  }): Promise<boolean> {
    try {
      await upworkClient.submitDeliverable(contractId, deliverable);
      return true;
    } catch (error) {
      console.error('Failed to submit deliverable:', error);
      return false;
    }
  }

  async getContractMessages(contractId: string) {
    try {
      return await upworkClient.getMessages(contractId);
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }
}

export const contractManager = new ContractManager();
