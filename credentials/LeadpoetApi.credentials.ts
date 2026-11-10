import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LeadpoetApi implements ICredentialType {
	name = 'leadpoetApi';

	displayName = 'Leadpoet API';

	icon: Icon = { light: 'file:../icons/leadpoet.svg', dark: 'file:../icons/leadpoet.dark.svg' };

	documentationUrl = 'https://leadpoet.com/docs/api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'lp_live_...',
			description:
				'Create a key in Leadpoet under Settings → Developer → API keys. Give it only the permissions this workflow needs.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://leadpoet.com/api/v1',
			url: '/me',
			method: 'GET',
		},
	};
}
