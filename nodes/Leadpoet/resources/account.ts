import type { INodeProperties } from 'n8n-workflow';

const show = { resource: ['account'] };

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get Credits',
				value: 'getCredits',
				action: 'Get the credit balance',
				description: "Get the workspace's credit balance and plan allocation",
				// /credits returns its fields at the top level, not inside data.
				routing: {
					request: { method: 'GET', url: '/credits' },
				},
			},
		],
		default: 'getCredits',
	},
];
