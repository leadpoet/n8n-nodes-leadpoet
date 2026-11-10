import type { INodeProperties } from 'n8n-workflow';
import { returnAllAndLimit, splitList, unwrapData } from '../shared';

const show = { resource: ['signal'] };

const signalTypes = [
	'acquisition',
	'cost_cutting',
	'customer_win',
	'expansion',
	'funding',
	'job_change',
	'leadership_news',
	'new_job',
	'partnership',
	'product_news',
	'technology_adopted',
	'title_change',
];

function label(value: string): string {
	const text = value.replace(/_/g, ' ');
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export const signalDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many signals',
				description:
					'List buying-intent alerts on watched accounts, such as funding, new jobs and leadership changes, grouped by account',
				routing: {
					request: { method: 'GET', url: '/signals' },
					...splitList('groups'),
				},
			},
			{
				name: 'Mark',
				value: 'mark',
				action: 'Mark signals',
				description: 'Mark alerts as reviewed (useful), dismissed (not useful) or new',
				routing: {
					request: {
						method: 'POST',
						url: '/signals/state',
						body: {
							event_ids:
								"={{ String($parameter.eventIds).split(',').map((id) => id.trim()).filter((id) => id) }}",
							state: '={{$parameter.signalState}}',
						},
					},
					...unwrapData,
				},
			},
		],
		default: 'getAll',
	},
	...returnAllAndLimit({ ...show, operation: ['getAll'] }, {}),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: "Part of an account's name",
				routing: { send: { type: 'query', property: 'company' } },
			},
			{
				displayName: 'Company Card ID',
				name: 'company_card_id',
				type: 'string',
				default: '',
				description: "One pipeline account's card ID",
				routing: { send: { type: 'query', property: 'company_card_id' } },
			},
			{
				displayName: 'Signal Type',
				name: 'signal_type',
				type: 'options',
				options: signalTypes.map((value) => ({ name: label(value), value })),
				default: 'funding',
				routing: { send: { type: 'query', property: 'signal_type' } },
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{ name: 'All', value: 'all', description: 'Include dismissed alerts' },
					{ name: 'New', value: 'new', description: 'Only alerts nobody has reviewed' },
					{ name: 'Open', value: 'open', description: 'Leave out dismissed alerts' },
				],
				default: 'open',
				routing: { send: { type: 'query', property: 'state' } },
			},
		],
	},
	{
		displayName: 'Alert IDs',
		name: 'eventIds',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated alert IDs from Signal → Get Many (up to 100)',
		displayOptions: { show: { ...show, operation: ['mark'] } },
	},
	{
		displayName: 'Mark As',
		name: 'signalState',
		type: 'options',
		options: [
			{ name: 'Dismissed', value: 'dismissed', description: 'Not useful; hidden from the open view' },
			{ name: 'New', value: 'new', description: 'Back to unreviewed' },
			{ name: 'Reviewed', value: 'reviewed', description: 'Useful' },
		],
		default: 'reviewed',
		displayOptions: { show: { ...show, operation: ['mark'] } },
	},
];
