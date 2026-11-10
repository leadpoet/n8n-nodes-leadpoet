import type { INodeProperties } from 'n8n-workflow';
import {
	idempotencyHeader,
	idempotencyOptions,
	returnAllAndLimit,
	splitList,
	unwrapData,
	uuidPlaceholder,
} from '../shared';

const show = { resource: ['contact'] };

export const contactDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Add Task',
				value: 'addTask',
				action: 'Add a follow up task to a contact',
				description: 'Add a follow-up reminder to a pipeline contact. It sends nothing.',
				routing: {
					request: {
						method: 'POST',
						url: '=/pipeline/contacts/{{$parameter.engagementId}}/tasks',
						headers: idempotencyHeader,
						body: {
							title: '={{$parameter.taskTitle}}',
							due_at: '={{ DateTime.fromISO(String($parameter.taskDueAt)).toISO() }}',
						},
					},
					...unwrapData,
				},
			},
			{
				name: 'Find Email or LinkedIn',
				value: 'enrich',
				action: 'Find a missing email or profile for a contact',
				description:
					"Look up a contact's missing work email or LinkedIn profile. Costs 1 credit, refunded when nothing is found.",
				routing: {
					request: {
						method: 'POST',
						url: '=/pipeline/contacts/{{$parameter.contactId}}/enrich',
						headers: idempotencyHeader,
						body: { field: '={{$parameter.enrichField}}' },
					},
					...unwrapData,
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many contacts',
				description: 'List contacts on the contact pipeline with stage, company and reply counts',
				routing: {
					request: {
						method: 'GET',
						url: '/pipeline/contacts',
						qs: { icp_id: '={{$parameter.icpId}}' },
					},
					...splitList('engagements'),
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
		description: 'List contacts for this ICP, from ICP → Get Many',
		displayOptions: { show: { ...show, operation: ['getAll'] } },
	},
	...returnAllAndLimit({ ...show, operation: ['getAll'] }, { cursorPath: 'pagination.next_cursor' }),
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		placeholder: uuidPlaceholder,
		description: "The contact's ID from Company → Get or Get Many (contacts on a company card)",
		displayOptions: { show: { ...show, operation: ['enrich'] } },
	},
	{
		displayName: 'Find',
		name: 'enrichField',
		type: 'options',
		options: [
			{ name: 'Work Email', value: 'email' },
			{ name: 'LinkedIn Profile', value: 'linkedin' },
		],
		default: 'email',
		description: 'Which missing value to look up. Existing values are never overwritten.',
		displayOptions: { show: { ...show, operation: ['enrich'] } },
	},
	{
		displayName: 'Engagement ID',
		name: 'engagementId',
		type: 'string',
		required: true,
		default: '',
		placeholder: uuidPlaceholder,
		description: "The contact's engagement ID, from Contact → Get Many",
		displayOptions: { show: { ...show, operation: ['addTask'] } },
	},
	{
		displayName: 'Title',
		name: 'taskTitle',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Call Dana',
		displayOptions: { show: { ...show, operation: ['addTask'] } },
	},
	{
		displayName: 'Due At',
		name: 'taskDueAt',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'When the task is due',
		displayOptions: { show: { ...show, operation: ['addTask'] } },
	},
	idempotencyOptions({ ...show, operation: ['addTask', 'enrich'] }),
];
