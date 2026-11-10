import type { INodeProperties } from 'n8n-workflow';
import { idempotencyHeader, idempotencyOptions, unwrapData, uuidPlaceholder } from '../shared';

const show = { resource: ['deal'] };

export const dealDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a deal',
				description: 'Add a manual deal to a pipeline company',
				routing: {
					request: {
						method: 'POST',
						url: '=/pipeline/companies/{{$parameter.cardId}}/deals',
						headers: idempotencyHeader,
						body: { name: '={{$parameter.dealName}}' },
					},
					...unwrapData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many deals',
				description: 'List active or archived deals with stages and open and won totals',
				routing: {
					request: { method: 'GET', url: '/pipeline/deals' },
					...unwrapData,
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Company Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		default: '',
		placeholder: uuidPlaceholder,
		description: "The company's card ID, from Company → Get Many",
		displayOptions: { show: { ...show, operation: ['create'] } },
	},
	{
		displayName: 'Deal Name',
		name: 'dealName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...show, operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { ...show, operation: ['create'] } },
		options: [
			{
				displayName: 'Amount',
				name: 'amount_native',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				routing: { send: { type: 'body', property: 'amount_native' } },
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'USD',
				description: 'Three-letter currency code, such as USD',
				routing: { send: { type: 'body', property: 'currency' } },
			},
			{
				displayName: 'Deal Type',
				name: 'deal_type',
				type: 'options',
				options: [
					{ name: 'Cross-Sell', value: 'cross_sell' },
					{ name: 'New Business', value: 'new_business' },
					{ name: 'Other', value: 'other' },
					{ name: 'Renewal', value: 'renewal' },
					{ name: 'Services', value: 'services' },
					{ name: 'Upsell', value: 'upsell' },
				],
				default: 'new_business',
				routing: { send: { type: 'body', property: 'deal_type' } },
			},
			{
				displayName: 'Expected Close Date',
				name: 'expected_close_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				routing: { send: { type: 'body', property: 'expected_close_date' } },
			},
			{
				displayName: 'Owner Name',
				name: 'owner_name',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'owner_name' } },
			},
		],
	},
	idempotencyOptions({ ...show, operation: ['create'] }),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		options: [
			{
				displayName: 'ICP ID',
				name: 'icp_id',
				type: 'string',
				default: '',
				placeholder: uuidPlaceholder,
				description: 'Only deals for this ICP',
				routing: { send: { type: 'query', property: 'icp_id' } },
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Archived', value: 'archived' },
				],
				default: 'active',
				routing: { send: { type: 'query', property: 'visibility' } },
			},
		],
	},
];
