import type { INodeProperties } from 'n8n-workflow';
import { returnAllAndLimit, splitList, unwrapData, uuidPlaceholder } from '../shared';

const show = { resource: ['campaign'] };

// Read-only on purpose: this node never launches campaigns, approves drafts or
// sends messages (the outreach:send scope).
export const campaignDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a campaign',
				description: "Get one campaign's settings, status and contact counts",
				routing: {
					request: { method: 'GET', url: '=/outreach/campaigns/{{$parameter.campaignId}}' },
					...unwrapData,
				},
			},
			{
				name: 'Get Analytics',
				value: 'getAnalytics',
				action: 'Get outreach analytics',
				description:
					'Get the rolling 90-day email and LinkedIn summary: messages sent, prospects reached, replies and outcomes',
				routing: {
					request: { method: 'GET', url: '/outreach/analytics' },
					...unwrapData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many campaigns',
				description: 'List campaigns with status and contact, message and reply counts',
				routing: {
					request: { method: 'GET', url: '/outreach/campaigns' },
					...splitList('strategies'),
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		default: '',
		placeholder: uuidPlaceholder,
		description: 'ID of the campaign, from Campaign → Get Many',
		displayOptions: { show: { ...show, operation: ['get'] } },
	},
	...returnAllAndLimit({ ...show, operation: ['getAll'] }, { cursorPath: 'next_cursor' }),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Name Contains',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Only campaigns whose name contains this text',
				routing: { send: { type: 'query', property: 'q' } },
			},
			{
				displayName: 'View',
				name: 'view',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Archived', value: 'archived' },
					{ name: 'Current', value: 'current' },
				],
				default: 'current',
				routing: { send: { type: 'query', property: 'view' } },
			},
		],
	},
];
