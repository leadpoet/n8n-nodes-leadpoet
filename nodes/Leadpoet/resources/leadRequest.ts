import type { INodeProperties } from 'n8n-workflow';
import { returnAllAndLimit, splitList, unwrapData, uuidPlaceholder } from '../shared';

const show = { resource: ['leadRequest'] };

export const leadRequestDescription: INodeProperties[] = [
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
				action: 'Get a lead request',
				description: "Get one lead request's status, targeting and delivered counts",
				routing: {
					request: { method: 'GET', url: '=/requests/{{$parameter.requestId}}' },
					...unwrapData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many lead requests',
				description: 'List lead requests, newest first, with status and progress',
				routing: {
					request: { method: 'GET', url: '/requests' },
					...splitList('queries'),
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		placeholder: uuidPlaceholder,
		description: 'ID of the lead request',
		displayOptions: { show: { ...show, operation: ['get'] } },
	},
	...returnAllAndLimit({ ...show, operation: ['getAll'] }, {}),
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 1,
		description: 'Page of results to return, newest first',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
		routing: { send: { type: 'query', property: 'page' } },
	},
];
