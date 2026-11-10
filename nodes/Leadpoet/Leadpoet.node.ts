import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { campaignDescription } from './resources/campaign';
import { companyDescription } from './resources/company';
import { contactDescription } from './resources/contact';
import { dealDescription } from './resources/deal';
import { icpDescription } from './resources/icp';
import { leadRequestDescription } from './resources/leadRequest';
import { signalDescription } from './resources/signal';

export class Leadpoet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Leadpoet',
		name: 'leadpoet',
		icon: { light: 'file:../../icons/leadpoet.svg', dark: 'file:../../icons/leadpoet.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Read and update researched companies, contacts, deals and buying signals in Leadpoet',
		defaults: {
			name: 'Leadpoet',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'leadpoetApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://leadpoet.com/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Campaign', value: 'campaign' },
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'ICP', value: 'icp' },
					{ name: 'Lead Request', value: 'leadRequest' },
					{ name: 'Signal', value: 'signal' },
				],
				default: 'company',
			},
			...accountDescription,
			...campaignDescription,
			...companyDescription,
			...contactDescription,
			...dealDescription,
			...icpDescription,
			...leadRequestDescription,
			...signalDescription,
		],
	};
}
