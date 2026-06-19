# Upwork Claude Integration - Project Documentation

## Overview

This project implements an MCP (Model Context Protocol) server that enables Claude AI to autonomously manage Upwork freelance accounts. It handles job search, intelligent matching, proposal generation, contract management, and client communication.

## Project Structure

```
src/
├── auth/
│   ├── oauth.ts              # OAuth2 authentication flow
│   ├── token-manager.ts      # Encrypted token storage
│   └── callback-server.ts    # OAuth callback handler with Express
├── upwork/
│   ├── client.ts             # Upwork API wrapper (axios-based)
│   ├── jobs.ts               # Job search & acceptance logic
│   ├── contracts.ts          # Contract & deliverable management
│   ├── messages.ts           # Client messaging
│   ├── job-matcher.ts        # Intelligent job matching algorithm
│   └── proposal-generator.ts # AI-powered cover letter generation
├── config/
│   └── loader.ts             # Config file parsing and loading
├── mcp/
│   └── tools.ts              # MCP tool definitions and handlers
├── utils/
│   ├── validation.ts         # Input validation utilities
│   ├── error-handler.ts      # Error handling and standardization
│   └── logger.ts             # Structured logging
├── index.ts                  # MCP server entry point
└── cli.ts                    # CLI utility for local testing
```

## Key Technologies

- **Node.js & TypeScript** - Core runtime and type safety
- **@modelcontextprotocol/sdk** - MCP server framework
- **Axios** - HTTP client for Upwork API
- **Express** - OAuth callback server
- **Crypto** - Token encryption

## Core Concepts

### 1. OAuth Authentication
- Uses OAuth2 flow with Upwork
- Tokens stored locally with AES-256 encryption
- Automatic token refresh when expired
- Secure callback handling

### 2. Job Matching Algorithm
- **Skills Match (40%)**: Evaluates job required skills against profile
- **Budget Match (25%)**: Checks if job budget falls within preferences
- **Client Quality (20%)**: Rates job based on client feedback/rating
- **Job Type Match (15%)**: Prefers hourly vs fixed-price
- Returns ranked recommendations

### 3. Proposal Generation
- Creates context-aware cover letters
- Matches job requirements to profile strengths
- Customizable based on freelancer profile
- Professional tone and structure

### 4. Job Logging
- Tracks all job interactions (proposed, accepted, rejected)
- Stores in `.job_log.json` for audit trail
- Helps avoid duplicate proposals

## Configuration

### config.json Structure

```json
{
  "jobSearchCriteria": {
    "skills": ["copywriting", "content writing"],
    "minBudget": 100,
    "maxBudget": 5000
  },
  "autoAcceptRules": {
    "acceptJobs": false,
    "minClientRating": 4.5,
    "minPayment": 150
  },
  "taskInstructions": {
    "copywriting": "Instructions for copywriting tasks",
    "contentWriting": "Instructions for content writing"
  }
}
```

### Environment Variables (.env)

```
UPWORK_CLIENT_ID=your_id
UPWORK_CLIENT_SECRET=your_secret
UPWORK_CALLBACK_URL=http://localhost:3000/callback
ENCRYPTION_KEY=32_character_random_string
PORT=3000
NODE_ENV=development
```

## Development Workflow

### Building

```bash
npm run build       # Compile TypeScript
npm run dev        # Watch mode with auto-reload
npm start          # Run built version
```

### Testing Locally

```bash
npm run cli auth        # Test authentication
npm run cli profile     # Check profile
npm run cli search      # Search jobs
npm run cli contracts   # View contracts
npm run cli config      # Check configuration
```

### MCP Server

The MCP server listens on stdin/stdout and provides these tools:
- `authenticate` - Start OAuth flow
- `get_profile` - Get freelancer profile
- `search_jobs` - Search for jobs
- `set_search_criteria` - Configure search
- `set_acceptance_rules` - Configure auto-accept
- `accept_job` - Submit proposal
- `match_jobs` - Score jobs
- `generate_proposal` - Create cover letter
- `get_active_jobs` - View contracts
- `send_message` - Message client
- `get_messages` - Retrieve messages
- `submit_deliverable` - Submit work
- `get_job_log` - View history

## Error Handling

Error codes (in `src/utils/error-handler.ts`):
- `AUTH_REQUIRED` - Not authenticated
- `INVALID_INPUT` - Bad parameters
- `NOT_FOUND` - Resource missing
- `API_ERROR` - Upwork API error
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Unexpected error
- `TOKEN_EXPIRED` - Token invalid

All errors logged and tracked for debugging.

## Logging

Structured logging to `.log` file:
- DEBUG: Detailed operation info
- INFO: Key events (jobs found, auth success)
- WARN: Potential issues
- ERROR: Failures and exceptions

## Security Considerations

✅ **Implemented:**
- AES-256 encryption for stored tokens
- Encrypted local storage in `.tokens.json`
- Secure OAuth flow with callback validation
- No credentials in code or logs
- Token refresh before expiration

⚠️ **User Responsibility:**
- Keep `.env` file private
- Don't commit sensitive files
- Rotate encryption key if exposed
- Review auto-accept rules carefully

## Testing & Verification

Before using in production:

1. **Authentication**: Run `npm run cli auth` and verify browser login
2. **Profile**: Check `npm run cli profile` returns correct data
3. **Search**: Test `npm run cli search` with realistic criteria
4. **Config**: Verify `npm run cli config` loads correctly
5. **Manual Review**: Test with `acceptJobs: false` first
6. **MCP Integration**: Test each tool in Claude Code

## Upwork API Details

**Base URL**: `https://api.upwork.com/api`

**Key Endpoints**:
- `GET /hr/v2/users/me` - Profile
- `GET /profiles/v2/search/jobs` - Job search
- `POST /proposals/v2/contractors/me/offers` - Submit proposal
- `GET /contracts/v2/contracts` - Active contracts
- `POST /messages/v3/{id}` - Send message
- `POST /deliverables/v1/{id}` - Submit deliverable

**Rate Limits**:
- Job search: 40 req/hour
- Proposals: 10/day
- Messages: No specific limit

## Future Enhancements

Potential improvements:
- Auto-generation of task instructions via Claude
- Work execution via Claude's capabilities
- Client communication automation
- Time tracking and billing integration
- Performance analytics dashboard
- Multi-language support

## Contributing

When modifying:
1. Maintain TypeScript types
2. Add error handling for new features
3. Log important operations
4. Update documentation
5. Test with `npm run build`

## Troubleshooting

**Common Issues**:
- Token not saving → Check `.env` encryption key
- Auth fails → Verify OAuth app redirect URL
- No jobs found → Check search criteria and Upwork availability
- Port 3000 in use → Change `PORT` in `.env`

**Debug Mode**:
```bash
LOG_LEVEL=debug npm run dev
```

## References

- [Upwork API Docs](https://developers.upwork.com)
- [MCP Documentation](https://modelcontextprotocol.io)
- [OAuth 2.0 Flow](https://oauth.net/2/)
