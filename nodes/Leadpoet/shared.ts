import type { IDataObject, INodeProperties } from 'n8n-workflow';

/**
 * Leadpoet requires an Idempotency-Key on create calls. The default key is
 * stable for one item in one run of one node configuration, so n8n's
 * "Retry On Fail" reuses it and never creates a second record. A new
 * execution gets a new key. Users can set their own key under Options.
 */
export const idempotencyHeader = {
	'Idempotency-Key':
		"={{ $parameter.options?.idempotencyKey || ('n8n-' + ($execution.id ?? 'manual') + '-' + $runIndex + '-' + $itemIndex + '-' + JSON.stringify($parameter).hash('sha256').slice(0, 24)) }}",
};

export function idempotencyOptions(show: Record<string, string[]>): INodeProperties {
	return {
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show },
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description:
					'Sending the same key again returns the first result instead of creating a duplicate. 8 to 160 characters: letters, numbers, dot, underscore, colon or hyphen. Leave empty to use a key unique to this item and execution.',
			},
		],
	};
}

/** Unwraps Leadpoet's { data, request_id } envelope. */
export const unwrapData = {
	output: {
		postReceive: [{ type: 'rootProperty' as const, properties: { property: 'data' } }],
	},
};

/** Unwraps the envelope and splits a list inside it into one item per entry. */
export function splitList(path: string) {
	return {
		output: {
			postReceive: [{ type: 'rootProperty' as const, properties: { property: `data.${path}` } }],
		},
	};
}

export function returnAllAndLimit(
	show: Record<string, string[]>,
	opts: { cursorPath?: string },
): INodeProperties[] {
	const fields: INodeProperties[] = [];
	if (opts.cursorPath) {
		const next = `$response.body?.data?.${opts.cursorPath}`;
		fields.push({
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: { show },
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			routing: {
				send: {
					paginate: '={{ $value }}',
					type: 'query',
					property: 'limit',
					value: '100',
				},
				operations: {
					pagination: {
						type: 'generic',
						properties: {
							// n8n evaluates this before every page, including the first,
							// and it replaces the whole query string, so keep the original.
							continue: `={{ !!${next} }}`,
							request: {
								// An expression that resolves to the query object.
								qs: `={{ Object.assign({}, $request.qs, ${next} ? { cursor: ${next} } : {}) }}` as unknown as IDataObject,
							},
						},
					},
				},
			},
		});
	}
	fields.push({
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: opts.cursorPath ? { ...show, returnAll: [false] } : show,
		},
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
		routing: {
			send: { type: 'query', property: 'limit' },
			output: { maxResults: '={{$value}}' },
		},
	});
	return fields;
}

export const uuidPlaceholder = '00000000-0000-0000-0000-000000000000';
