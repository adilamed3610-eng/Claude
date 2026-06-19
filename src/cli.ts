import { initiateAuthentication } from './auth/callback-server.js';
import { jobManager } from './upwork/jobs.js';
import { contractManager } from './upwork/contracts.js';
import { messageManager } from './upwork/messages.js';
import { upworkClient } from './upwork/client.js';
import { oauth } from './auth/oauth.js';

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'auth':
        console.log('Starting authentication...');
        await initiateAuthentication();
        console.log('Please complete authentication in your browser.');
        break;

      case 'profile':
        if (!oauth.isAuthenticated()) {
          console.error('Not authenticated. Run: npm run cli auth');
          process.exit(1);
        }
        const profile = await upworkClient.getProfile();
        console.log('Profile:', JSON.stringify(profile, null, 2));
        break;

      case 'search':
        if (!oauth.isAuthenticated()) {
          console.error('Not authenticated. Run: npm run cli auth');
          process.exit(1);
        }
        const jobs = await jobManager.searchJobs();
        console.log('Jobs found:', JSON.stringify(jobs, null, 2));
        break;

      case 'contracts':
        if (!oauth.isAuthenticated()) {
          console.error('Not authenticated. Run: npm run cli auth');
          process.exit(1);
        }
        const contracts = await contractManager.getActiveContracts();
        console.log('Active contracts:', JSON.stringify(contracts, null, 2));
        break;

      case 'log':
        const jobLog = jobManager.getJobLog();
        console.log('Job Log:', JSON.stringify(jobLog, null, 2));
        break;

      case 'config':
        console.log('Search Criteria:', jobManager.getSearchCriteria());
        console.log('Acceptance Rules:', jobManager.getAcceptanceRules());
        break;

      case 'help':
      default:
        console.log(`
Upwork Claude Integration CLI

Commands:
  auth        - Start OAuth authentication
  profile     - Get your Upwork profile
  search      - Search for jobs
  contracts   - View active contracts
  log         - View job acceptance log
  config      - View current configuration
  help        - Show this help
        `);
        break;
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  process.exit(0);
}

main();
