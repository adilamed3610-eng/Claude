import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { jobManager } from '../upwork/jobs.js';
import { contractManager } from '../upwork/contracts.js';
import { messageManager } from '../upwork/messages.js';
import { upworkClient } from '../upwork/client.js';
import { oauth } from '../auth/oauth.js';
import { initiateAuthentication } from '../auth/callback-server.js';

export const mcpTools: Tool[] = [
  {
    name: 'authenticate',
    description: 'Start the OAuth authentication flow with Upwork. Opens browser for login.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_profile',
    description: 'Retrieve your Upwork freelancer profile with skills, rates, and portfolio info',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'search_jobs',
    description: 'Search for Upwork jobs matching your criteria',
    inputSchema: {
      type: 'object' as const,
      properties: {
        skills: {
          type: 'array',
          items: { type: 'string' },
          description: 'Skills to search for (e.g., ["copywriting", "content writing"])',
        },
        category: {
          type: 'string',
          description: 'Job category to filter by',
        },
        min_budget: {
          type: 'number',
          description: 'Minimum job budget',
        },
        max_budget: {
          type: 'number',
          description: 'Maximum job budget',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'set_search_criteria',
    description: 'Set default search criteria for job searches',
    inputSchema: {
      type: 'object' as const,
      properties: {
        skills: {
          type: 'array',
          items: { type: 'string' },
          description: 'Skills to search for',
        },
        category: {
          type: 'string',
          description: 'Job category',
        },
        min_budget: {
          type: 'number',
          description: 'Minimum budget',
        },
        max_budget: {
          type: 'number',
          description: 'Maximum budget',
        },
      },
      required: [],
    },
  },
  {
    name: 'set_acceptance_rules',
    description: 'Configure rules for autonomous job acceptance',
    inputSchema: {
      type: 'object' as const,
      properties: {
        accept_jobs: {
          type: 'boolean',
          description: 'Enable or disable automatic job acceptance',
        },
        min_client_rating: {
          type: 'number',
          description: 'Minimum client feedback rating (0-5)',
        },
        min_payment: {
          type: 'number',
          description: 'Minimum payment amount',
        },
      },
      required: [],
    },
  },
  {
    name: 'accept_job',
    description: 'Accept or propose for a specific job',
    inputSchema: {
      type: 'object' as const,
      properties: {
        job_id: {
          type: 'string',
          description: 'The job ID to accept',
        },
        cover_letter: {
          type: 'string',
          description: 'Your proposal cover letter',
        },
        desired_rate: {
          type: 'number',
          description: 'Your desired rate (optional)',
        },
      },
      required: ['job_id', 'cover_letter'],
    },
  },
  {
    name: 'get_active_jobs',
    description: 'Get list of your active contracts and jobs',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_job_log',
    description: 'Get history of accepted, rejected, and proposed jobs',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'send_message',
    description: 'Send a message to a client on an active contract',
    inputSchema: {
      type: 'object' as const,
      properties: {
        contract_id: {
          type: 'string',
          description: 'The contract ID',
        },
        message: {
          type: 'string',
          description: 'Message to send',
        },
      },
      required: ['contract_id', 'message'],
    },
  },
  {
    name: 'get_messages',
    description: 'Get messages for a contract',
    inputSchema: {
      type: 'object' as const,
      properties: {
        contract_id: {
          type: 'string',
          description: 'The contract ID',
        },
      },
      required: ['contract_id'],
    },
  },
  {
    name: 'submit_deliverable',
    description: 'Submit deliverable/work for a contract',
    inputSchema: {
      type: 'object' as const,
      properties: {
        contract_id: {
          type: 'string',
          description: 'The contract ID',
        },
        description: {
          type: 'string',
          description: 'Description of the deliverable',
        },
        files: {
          type: 'array',
          items: { type: 'string' },
          description: 'File paths or URLs of deliverables',
        },
      },
      required: ['contract_id', 'description'],
    },
  },
];

export async function handleToolCall(toolName: string, toolInput: Record<string, unknown>): Promise<string> {
  try {
    switch (toolName) {
      case 'authenticate':
        try {
          await initiateAuthentication();
          return JSON.stringify({
            success: true,
            message: 'Browser opened for Upwork authentication. Please log in and authorize.',
            status: 'waiting_for_callback',
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to start authentication',
          });
        }

      case 'get_profile':
        const profile = await upworkClient.getProfile();
        return JSON.stringify({ success: true, profile });

      case 'search_jobs':
        jobManager.setSearchCriteria({
          skills: toolInput.skills as string[] | undefined,
          category: toolInput.category as string | undefined,
          minBudget: toolInput.min_budget as number | undefined,
          maxBudget: toolInput.max_budget as number | undefined,
          limit: toolInput.limit as number | undefined,
        });
        const jobs = await jobManager.searchJobs();
        return JSON.stringify({ success: true, jobs });

      case 'set_search_criteria':
        jobManager.setSearchCriteria({
          skills: toolInput.skills as string[] | undefined,
          category: toolInput.category as string | undefined,
          minBudget: toolInput.min_budget as number | undefined,
          maxBudget: toolInput.max_budget as number | undefined,
        });
        return JSON.stringify({ success: true, message: 'Search criteria updated' });

      case 'set_acceptance_rules':
        jobManager.setAcceptanceRules({
          acceptJobs: toolInput.accept_jobs as boolean | undefined,
          minClientRating: toolInput.min_client_rating as number | undefined,
          minPayment: toolInput.min_payment as number | undefined,
        });
        return JSON.stringify({ success: true, message: 'Acceptance rules updated', rules: jobManager.getAcceptanceRules() });

      case 'accept_job':
        const accepted = await jobManager.acceptJob(
          toolInput.job_id as string,
          toolInput.cover_letter as string,
          toolInput.desired_rate as number | undefined
        );
        return JSON.stringify({
          success: accepted,
          message: accepted ? 'Job proposal submitted successfully' : 'Failed to submit job proposal',
        });

      case 'get_active_jobs':
        const contracts = await contractManager.getActiveContracts();
        return JSON.stringify({ success: true, contracts });

      case 'get_job_log':
        const log = jobManager.getJobLog();
        return JSON.stringify({ success: true, log });

      case 'send_message':
        const messageSent = await messageManager.sendMessage(
          toolInput.contract_id as string,
          toolInput.message as string
        );
        return JSON.stringify({
          success: messageSent,
          message: messageSent ? 'Message sent successfully' : 'Failed to send message',
        });

      case 'get_messages':
        const messages = await messageManager.getMessages(toolInput.contract_id as string);
        return JSON.stringify({ success: true, messages });

      case 'submit_deliverable':
        const submitted = await contractManager.submitDeliverable(
          toolInput.contract_id as string,
          {
            description: toolInput.description as string,
            files: toolInput.files as string[] | undefined,
          }
        );
        return JSON.stringify({
          success: submitted,
          message: submitted ? 'Deliverable submitted successfully' : 'Failed to submit deliverable',
        });

      default:
        return JSON.stringify({ success: false, error: `Unknown tool: ${toolName}` });
    }
  } catch (error) {
    return JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
