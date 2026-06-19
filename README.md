# Upwork Claude Integration

An MCP (Model Context Protocol) server that enables Claude to autonomously manage your Upwork freelance account. Search for jobs, accept them based on intelligent matching, generate proposals, communicate with clients, and submit deliverables—all through Claude.

## Features

- 🔐 **OAuth2 Security** - Secure Upwork authentication with encrypted token storage
- 🔍 **Smart Job Matching** - AI-powered job matching based on skills, budget, and client quality
- ✅ **Autonomous Job Acceptance** - Accept jobs automatically based on configurable rules
- 💡 **Intelligent Proposals** - Auto-generate personalized cover letters
- 💬 **Client Communication** - Send/receive messages with clients
- 📦 **Deliverable Management** - Submit and track work deliverables
- 📊 **Job History** - Complete audit trail of all interactions
- 🔄 **Works Everywhere** - Access from Claude Code on mobile, web, or desktop

## Quick Start (5 Minutes)

1. **Get Upwork OAuth Credentials**
   - Go to https://www.upwork.com/o/profiles/settings/applications
   - Create a new OAuth app with redirect URL: `http://localhost:3000/callback`
   - Copy your Client ID and Client Secret

2. **Install & Configure**
   ```bash
   git clone <repo>
   cd upwork-claude-integration
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run build
   ```

3. **Test Locally**
   ```bash
   npm run cli auth    # Authenticate with Upwork
   npm run cli search  # Search for jobs
   ```

4. **Add to Claude Code**
   - Edit `~/.claude/models.json`
   - Add MCP server configuration (see Setup section below)

5. **Start Using**
   ```
   @upwork authenticate
   @upwork search_jobs
   @upwork accept_job --job_id JOB123 --cover_letter "My proposal..."
   ```

## Full Setup

### 1. Prerequisites

- Node.js 18+ and npm
- Upwork Developer Account (free)

### 2. Get Upwork OAuth Credentials

1. Go to https://www.upwork.com/o/profiles/settings/applications
2. Create a new OAuth app
3. Get your Client ID and Client Secret
4. Set the redirect URL to `http://localhost:3000/callback`

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Upwork credentials:
```
UPWORK_CLIENT_ID=your_client_id
UPWORK_CLIENT_SECRET=your_client_secret
UPWORK_CALLBACK_URL=http://localhost:3000/callback
ENCRYPTION_KEY=generate_a_random_32_char_string
```

### 5. Build

```bash
npm run build
```

### 6. Add to Claude Code

Edit `~/.claude/models.json` (or create it):

```json
{
  "mcpServers": {
    "upwork": {
      "command": "node",
      "args": ["/path/to/upwork-integration/dist/index.js"]
    }
  }
}
```

Replace `/path/to/upwork-integration` with the actual path to this repository.

## Usage

### Quick Start (CLI)

Test the integration locally:

```bash
# Authenticate with Upwork
npm run cli auth

# Check your profile
npm run cli profile

# Search for jobs
npm run cli search

# View active contracts
npm run cli contracts

# See configuration
npm run cli config

# View job history
npm run cli log
```

### In Claude Code

1. **Authenticate**
   ```
   @upwork authenticate
   ```
   A browser window opens automatically. Log in to Upwork and authorize the application.

2. **Search Jobs** (with defaults from config)
   ```
   @upwork search_jobs
   ```
   
   Or override with custom criteria:
   ```
   @upwork search_jobs --skills "copywriting,content writing" --min_budget 100 --max_budget 5000
   ```

3. **Configure Search Criteria**
   ```
   @upwork set_search_criteria --skills "copywriting" --min_budget 150 --max_budget 3000
   ```

4. **Enable Auto Job Acceptance**
   ```
   @upwork set_acceptance_rules --accept_jobs true --min_client_rating 4.5 --min_payment 200
   ```

5. **Accept a Specific Job**
   ```
   @upwork accept_job --job_id "JOB123" --cover_letter "I'm experienced in this area and can deliver excellent results."
   ```

6. **View Active Jobs**
   ```
   @upwork get_active_jobs
   ```

7. **Send Message to Client**
   ```
   @upwork send_message --contract_id "CONTRACT123" --message "I've started working on your project and will have the first draft ready by Friday."
   ```

8. **Submit Deliverable**
   ```
   @upwork submit_deliverable --contract_id "CONTRACT123" --description "Completed content piece as requested" --files "https://example.com/deliverable.docx"
   ```

9. **View Job History**
   ```
   @upwork get_job_log
   ```

## Configuration

### Using config.json

Copy the example and customize it:

```bash
cp config.example.json config.json
```

Edit `config.json` with your preferences:

```json
{
  "jobSearchCriteria": {
    "skills": ["copywriting", "blog writing"],
    "category": "Writing",
    "minBudget": 100,
    "maxBudget": 5000,
    "limit": 20
  },
  "autoAcceptRules": {
    "acceptJobs": true,
    "minClientRating": 4.5,
    "minPayment": 150
  },
  "taskInstructions": {
    "copywriting": "Write engaging, high-quality content that matches brand voice",
    "blogWriting": "Create SEO-friendly blog posts with proper formatting"
  }
}
```

### At Runtime

Set search criteria:
```
@upwork set_search_criteria --skills "copywriting,content-writing" --min_budget 150 --max_budget 3000
```

Configure acceptance rules:
```
@upwork set_acceptance_rules --accept_jobs true --min_client_rating 4.5 --min_payment 200
```

View current settings:
```
npm run cli config
```

## Architecture

```
src/
├── auth/
│   ├── oauth.ts           # OAuth2 authentication
│   └── token-manager.ts   # Secure token storage
├── upwork/
│   ├── client.ts          # Upwork API wrapper
│   ├── jobs.ts            # Job search & acceptance
│   ├── contracts.ts       # Contract management
│   └── messages.ts        # Client messaging
├── mcp/
│   └── tools.ts           # MCP tool definitions
└── index.ts               # MCP server entry
```

## Security

- OAuth tokens are encrypted before storage
- Tokens are refreshed automatically when expired
- Sensitive data is never logged
- Environment variables for credentials

## Limitations

- Upwork API rate limits apply
- Some operations may require human review for safety
- Job acceptance follows Upwork Terms of Service

## Development

```bash
npm run dev      # Run with auto-reload
npm run build    # Build TypeScript
npm start        # Run production build
```

## How It Works

### Smart Job Matching Algorithm

The system evaluates every job on four criteria:

- **Skills Match (40%)**: Compares job requirements to your profile
- **Budget Match (25%)**: Scores based on your budget preferences
- **Client Quality (20%)**: Evaluates client rating and feedback
- **Job Type Match (15%)**: Prefers your preferred job type

Jobs are ranked with scores 0-1, and you can set rules to auto-accept jobs above a certain threshold.

### Autonomous Workflow

```
Search Jobs → Match & Score → Generate Proposal → Auto-Accept
   ↓            ↓              ↓                    ↓
Find 10 jobs   Score each     Create personalized  Accept best fits
matching your  against your   cover letter         based on rules
skills & rate  profile
```

### Example: Full Automation

With proper configuration, Claude can:
1. Search for copywriting jobs (5 times daily)
2. Rank them based on your preferences
3. Auto-accept jobs from reputable clients with budgets > $150
4. Send an initial message to the client
5. Track all interactions in a log file

## What You Need to Know

### Before Using Auto-Accept

⚠️ **Start with `acceptJobs: false`** to review jobs manually first.

Once comfortable:
- Set realistic `minClientRating` (usually 4.5+)
- Set `minPayment` appropriately for your rate
- Review job categories that fit your skills
- Monitor `.job_log.json` regularly

### Limitations

- Upwork API rate limits apply (40 searches/hour, 10 proposals/day)
- Some operations may require human review for safety
- Job acceptance follows Upwork Terms of Service
- Budget estimates are approximate

### Best Practices

1. **Start small** - Use `acceptJobs: false` initially
2. **Monitor jobs** - Check `.job_log.json` daily
3. **Set realistic rules** - Min payment should match your rate
4. **Review proposals** - Consider manual review of high-value jobs
5. **Update profile** - Keep Upwork profile current with skills/rate
6. **Check client ratings** - Higher minimum rating = better clients

## Troubleshooting

### I don't see my jobs in search results
- Check your search criteria matches available jobs
- Try broader search terms or lower minimum budget
- Upwork may not have matching jobs available

### Authentication keeps failing
- Verify OAuth app redirect URL is `http://localhost:3000/callback`
- Clear `.tokens.json` and try again
- Check you have freelancer/contractor status on Upwork

### Too many API errors
- Upwork API has rate limits - wait before retrying
- Don't search more than once per 2 minutes
- Don't accept more than 10 jobs per day

## Architecture

### Security
- **Encryption**: AES-256 for token storage
- **OAuth2**: Industry-standard authentication
- **Validation**: Input validation for all parameters
- **Logging**: Secure logging without sensitive data

### Scalability
- Efficient job matching algorithm
- Batch operations where possible
- Automatic rate limit handling
- Extensible tool architecture

### Maintenance
- TypeScript for type safety
- Structured error handling
- Comprehensive logging
- Automated token refresh

## Documentation

- **[Setup Guide](docs/SETUP.md)** - Detailed installation steps
- **[API Reference](docs/API.md)** - All available tools
- **[Project Docs](CLAUDE.md)** - Technical architecture
- **[Examples](README.md#usage)** - Real usage examples

## Support

- 📖 Check [docs/SETUP.md](docs/SETUP.md) for setup issues
- 🔍 Review [docs/API.md](docs/API.md) for tool usage
- 🐛 Check `.log` file for error details
- 📋 View `.job_log.json` for interaction history

## License

MIT

## Disclaimer

This tool automates Upwork account management. Always:
- Review auto-accept rules carefully before enabling
- Ensure you can meet job deadlines before accepting
- Follow Upwork Terms of Service
- Maintain professional communication with clients
- Deliver high-quality work on time

The authors are not responsible for job disputes, account issues, or Upwork policy violations.
