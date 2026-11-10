import type { INodeProperties } from 'n8n-workflow';
import { splitList, unwrapData, uuidPlaceholder } from '../shared';

const show = { resource: ['icp'] };

export const icpDescription: INodeProperties[] = [
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
				action: 'Get an ICP',
				description: 'Get one ideal customer profile with its published version and any draft',
				routing: {
					request: { method: 'GET', url: '=/icps/{{$parameter.icpId}}' },
					...unwrapData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many ideal customer profiles',
				description: "List the workspace's active ideal customer profiles",
				routing: {
					request: { method: 'GET', url: '/icps' },
					...splitList('profiles'),
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'ICP ID',
		name: 'icpId',
		type: 'string',
		required: true,
		default: '',
		placeholder: uuidPlaceholder,
		description: 'ID of the ICP, from ICP → Get Many',
		displayOptions: { show: { ...show, operation: ['get'] } },
	},
];
