# n8n-nodes-leadpoet

This is an n8n community node for [Leadpoet](https://leadpoet.com). Leadpoet
turns an ideal customer profile (ICP) into researched, qualified companies and
contacts, then moves them through a sales pipeline. This node lets n8n
workflows and n8n AI agents read that pipeline and make safe updates to it.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/)
workflow automation platform.

[Installation](#installation) ·
[Credentials](#credentials) ·
[Operations](#operations) ·
[Usage](#usage) ·
[Compatibility](#compatibility) ·
[Resources](#resources)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).
In n8n, open **Settings → Community Nodes → Install** and enter
`n8n-nodes-leadpoet`.

## Credentials

The node uses a Leadpoet API key.

1. In Leadpoet, open **Settings → Developer → API keys**. The workspace owner
   and team admins can create keys. Every plan, Free included, has API access.
2. Create a key and choose only the permissions your workflow needs:
   - `pipeline:read` for Company, Contact, Deal and Signal reads
   - `pipeline:write` for Company Update, Add Note, Add Task, Find Email or
     LinkedIn, Deal Create and Signal Mark
   - `lead_engine:read` for ICP and Lead Request reads
   - `outreach:read` for Campaign reads
   - `credits:read` for Account → Get Credits
3. Copy the secret. Leadpoet shows it once.
4. In n8n, create a **Leadpoet API** credential and paste the key. n8n checks
   it with `GET /api/v1/me`, which costs nothing and changes nothing.

You can revoke a key in Leadpoet at any time.

## Operations

| Resource | Operation | What it does |
| --- | --- | --- |
| Account | Get Credits | Credit balance and plan allocation |
| Campaign | Get | One campaign's settings, status and contact counts |
| Campaign | Get Analytics | Rolling 90-day email and LinkedIn summary |
| Campaign | Get Many | Campaigns with status and contact, message and reply counts |
| Company | Add Note | Note on a company, or on one of its contacts or deals |
| Company | Get | One pipeline company's full details and contacts |
| Company | Get Many | Pipeline companies, filterable by name, domain and stage |
| Company | Get Research | Researched facts with source, evidence link, confidence and freshness |
| Company | Update | Stage, pin, notes, owner, deal value, currency, close date, sales motion |
| Contact | Add Task | Follow-up reminder on a contact (sends nothing) |
| Contact | Find Email or LinkedIn | Fills a missing work email or LinkedIn profile; 1 credit, refunded when nothing is found |
| Contact | Get Many | Contacts on an ICP's contact pipeline |
| Deal | Create | Manual deal on a pipeline company |
| Deal | Get Many | Active or archived deals with open and won totals |
| ICP | Get | One ICP with its published version and draft |
| ICP | Get Many | The workspace's active ICPs |
| Lead Request | Get | One lead request's status and delivered counts |
| Lead Request | Get Many | Lead requests, newest first |
| Signal | Get Many | Buying-intent alerts (funding, new jobs, leadership news and more), grouped by account |
| Signal | Mark | Mark alerts reviewed, dismissed or new |

### What this node does not do

It never sends outreach, launches or resumes campaigns, or approves drafts for
sending. Those actions need the `outreach:send` permission and stay in the
Leadpoet app, where a person reviews them. The node also does not start paid
lead requests or watch accounts for signals, which reserve credits.

## Usage

- **Get Many** operations return one n8n item per company, contact, campaign,
  ICP, lead request or signal group. For companies, contacts and campaigns,
  turn on **Return All** to follow Leadpoet's pages, or set **Limit**. Lead
  requests use **Limit** and **Page**.
- Create operations send an `Idempotency-Key`. By default it is unique to the
  item, the execution and the node's settings, so n8n's **Retry On Fail** never
  creates a duplicate. Set your own key under **Options** to control this.
- IDs chain between operations. For example: ICP → Get Many gives an ICP ID for
  Contact → Get Many, and Company → Get Many gives the company card ID for
  Company → Add Note and Deal → Create.
- **AI agents:** the node is usable as a tool, so an n8n AI Agent can call any
  operation above. Give the agent a key with only the permissions it needs.
  To use Leadpoet from Claude, ChatGPT, Cursor and other assistants without
  n8n, see [Leadpoet in AI assistants](https://leadpoet.com/ai-assistants).

## Compatibility

Built with `@n8n/node-cli` 0.55. Tested on n8n 2.46 against a mocked Leadpoet
API.

## Resources

- [Leadpoet API reference](https://leadpoet.com/docs/api)
- [OpenAPI document](https://leadpoet.com/api/v1/openapi.json)
- [Leadpoet in AI assistants](https://leadpoet.com/ai-assistants)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE)
