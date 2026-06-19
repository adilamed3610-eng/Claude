# Upwork Claude Integration - API Reference

## Available MCP Tools

### Authentication

#### `authenticate`
Start the OAuth authentication flow with Upwork.

**Usage:**
```
@upwork authenticate
```

**Response:**
```json
{
  "success": true,
  "message": "Browser opened for Upwork authentication. Please log in and authorize.",
  "status": "waiting_for_callback"
}
```

### Profile & Configuration

#### `get_profile`
Retrieve your Upwork freelancer profile information.

**Usage:**
```
@upwork get_profile
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "...",
    "name": "Your Name",
    "title": "Freelancer",
    "skills": ["copywriting", "content writing"],
    "rate": 50,
    "rateType": "hourly"
  }
}
```

#### `set_search_criteria`
Configure default job search parameters.

**Parameters:**
- `skills` (array): List of skills to search for
- `category` (string): Job category filter
- `min_budget` (number): Minimum job budget
- `max_budget` (number): Maximum job budget

**Usage:**
```
@upwork set_search_criteria --skills copywriting,content-writing --min_budget 100 --max_budget 5000
```

#### `set_acceptance_rules`
Configure autonomous job acceptance rules.

**Parameters:**
- `accept_jobs` (boolean): Enable/disable auto-accept
- `min_client_rating` (number): Minimum client rating (0-5)
- `min_payment` (number): Minimum payment amount

**Usage:**
```
@upwork set_acceptance_rules --accept_jobs true --min_client_rating 4.5 --min_payment 200
```

### Job Search & Matching

#### `search_jobs`
Search for jobs matching your criteria.

**Parameters:**
- `skills` (array): Skills to search for
- `category` (string): Job category
- `min_budget` (number): Minimum budget
- `max_budget` (number): Maximum budget
- `limit` (number): Number of results (default: 10)

**Usage:**
```
@upwork search_jobs --skills copywriting --min_budget 150 --max_budget 3000
```

**Response:**
```json
{
  "success": true,
  "jobs": [
    {
      "id": "JOB123",
      "title": "Blog Article Writing",
      "budget": 500,
      "category": "Writing",
      "client": {
        "feedback_count": 15,
        "rating": 4.8
      }
    }
  ]
}
```

#### `match_jobs`
Analyze and score a list of jobs against your profile.

**Parameters:**
- `jobs` (array): Array of job objects to match

**Usage:**
```
@upwork match_jobs --jobs '[{"id":"JOB123","title":"Article Writing","budget":500}]'
```

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "jobId": "JOB123",
      "title": "Blog Article Writing",
      "totalScore": 0.85,
      "skillsMatch": 95,
      "budgetMatch": 88,
      "clientQuality": 96,
      "jobTypeMatch": 100,
      "recommendation": "high"
    }
  ]
}
```

### Job Acceptance

#### `accept_job`
Submit a proposal for a job.

**Parameters:**
- `job_id` (string, required): Job ID
- `cover_letter` (string, required): Your proposal text
- `desired_rate` (number): Your desired rate (optional)

**Usage:**
```
@upwork accept_job --job_id JOB123 --cover_letter "I have extensive copywriting experience and can deliver high-quality content."
```

**Response:**
```json
{
  "success": true,
  "message": "Job proposal submitted successfully"
}
```

#### `generate_proposal`
Generate an intelligent cover letter for a job.

**Parameters:**
- `job_title` (string, required): Job title
- `job_description` (string, required): Job description
- `required_skills` (array): Required skills
- `client_name` (string): Client name (optional)

**Usage:**
```
@upwork generate_proposal --job_title "Blog Writing" --job_description "Write 5 blog posts about productivity"
```

**Response:**
```json
{
  "success": true,
  "proposal": "Hi there,\n\nI'm interested in working on \"Blog Writing\"...",
  "jobId": "JOB123"
}
```

#### `get_job_log`
View history of all job proposals and acceptances.

**Usage:**
```
@upwork get_job_log
```

**Response:**
```json
{
  "success": true,
  "log": [
    {
      "jobId": "JOB123",
      "title": "Blog Article Writing",
      "budget": 500,
      "status": "proposed",
      "timestamp": 1699300000000,
      "reason": null
    }
  ]
}
```

### Contract & Job Management

#### `get_active_jobs`
List all your active contracts and ongoing work.

**Usage:**
```
@upwork get_active_jobs
```

**Response:**
```json
{
  "success": true,
  "contracts": [
    {
      "id": "CONTRACT123",
      "title": "Monthly Blog Writing",
      "client": "John Doe",
      "budget": 2000,
      "status": "active",
      "startDate": 1699300000000,
      "endDate": 1702000000000
    }
  ]
}
```

### Communication

#### `send_message`
Send a message to a client.

**Parameters:**
- `contract_id` (string, required): Contract ID
- `message` (string, required): Message to send

**Usage:**
```
@upwork send_message --contract_id CONTRACT123 --message "I've started working on the first draft and will have it ready by Friday."
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

#### `get_messages`
Retrieve messages from a contract.

**Parameters:**
- `contract_id` (string, required): Contract ID

**Usage:**
```
@upwork get_messages --contract_id CONTRACT123
```

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "MSG123",
      "sender": "client",
      "body": "Can you send me the first draft?",
      "timestamp": 1699300000000
    }
  ]
}
```

### Deliverables

#### `submit_deliverable`
Submit completed work for a contract.

**Parameters:**
- `contract_id` (string, required): Contract ID
- `description` (string, required): Description of deliverable
- `files` (array): File URLs or paths (optional)

**Usage:**
```
@upwork submit_deliverable --contract_id CONTRACT123 --description "5 blog posts completed and ready for review" --files "https://example.com/blog-posts.zip"
```

**Response:**
```json
{
  "success": true,
  "message": "Deliverable submitted successfully"
}
```

## Error Handling

All tools return responses in this format:

**Success:**
```json
{
  "success": true,
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "errorCode": "ERROR_CODE"
}
```

### Common Error Codes

- `AUTH_REQUIRED`: Not authenticated. Run `authenticate` first.
- `INVALID_INPUT`: Invalid parameters provided.
- `NOT_FOUND`: Resource not found.
- `API_ERROR`: Upwork API error.
- `RATE_LIMITED`: Too many requests. Wait before retrying.
- `INTERNAL_ERROR`: Unexpected internal error.
- `TOKEN_EXPIRED`: Token expired. Re-authenticate.

## Rate Limiting

Upwork API has rate limits:
- **Search jobs:** 40 requests per hour
- **Post proposals:** 10 per day
- **Send messages:** No specific limit

The integration includes automatic backoff for rate limit errors.

## Examples

### Complete Workflow

```
# 1. Authenticate
@upwork authenticate

# 2. Set preferences
@upwork set_search_criteria --skills "copywriting,content writing" --min_budget 150 --max_budget 3000
@upwork set_acceptance_rules --accept_jobs true --min_client_rating 4.5 --min_payment 200

# 3. Search jobs
@upwork search_jobs

# 4. Check matches (optional)
@upwork match_jobs --jobs [...]

# 5. Auto-accept or manually accept
@upwork accept_job --job_id JOB123 --cover_letter "Proposal text here"

# 6. Manage active work
@upwork get_active_jobs
@upwork send_message --contract_id CONTRACT123 --message "Progress update"
@upwork submit_deliverable --contract_id CONTRACT123 --description "Work completed"
```

### Autonomous Mode (with config.json)

```
# 1. Configure one-time preferences in config.json
# 2. Authenticate
@upwork authenticate

# 3. Let Claude search and auto-accept jobs
@upwork search_jobs
```

## Limitations

- Upwork API access is limited to authenticated users
- Some operations require specific Upwork account status
- API endpoints may change without notice
- Rate limiting applies to all requests
