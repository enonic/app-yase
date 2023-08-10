import type { QueryNodeParams } from '@enonic-types/lib-node';


import { useState } from 'react';
import {
	Form,
	Segment
} from 'semantic-ui-react';
import Action from './documentsApi/Action';
import { DOCUMENT_REST_API_VERSION } from '../../webapp/constants';


const PATH_PREFIX = '';//`/api/v${DOCUMENT_REST_API_VERSION}/documents`;


export default function DocumentsApiDoc() {

	const [apiKey, setApiKey] = useState<string>('XXXX');
	const [collection, setCollection] = useState<string>();
	const [documentId, setDocumentId] = useState<string>();

	const prefix = `${PATH_PREFIX}/${collection ?? '{collection}'}`;
	const documentPath = `${prefix}/${documentId ?? '{documentId}'}`;

	return <main>
		<Segment>
			<h1>Documents API documentation</h1>

			<h2>Common</h2>
			<Form>
				<Form.Input
					defaultValue={apiKey}
					label='API key'
					placeholder='API key'
					onChange={(_, { value }) => setApiKey(value)}
				/>
				<Form.Input
					label='Collection'
					placeholder='Collection'
					onChange={(_, { value }) => setCollection(value)}
				/>
			</Form>

			<h2>Bulk</h2>
			<Action
				apiKey={apiKey}
				comment='Get document(s)'
				curl={`-H "authorization:Explorer-Api-Key ${apiKey}"`}
				headers={{
					// accept: {
					// 	value: 'application/json',
					// 	attributes: '<optional>',
					// 	description: 'The response format.'
					// },
					authorization: {
						value: `Explorer-Api-Key ${apiKey}`,
						attributes: '<required>',
						description: 'The API key (password) for the collection you want to get documents from.'
					},
					// 'content-type': {
					// 	value: 'application/json',
					// 	attributes: '<optional>',
					// 	description: "Get requests can't have a body (content) in the Fetch API standard"
					// },
				}}
				method="GET"
				pattern={`${prefix}`}
				parameters={{
					// collection: {
					// 	attributes: '<required>',
					// 	description: 'The collection to get documents from. Typically provided via the url path.'
					// },
					// count: {
					// 	attributes: '<optional>',
					// 	default: '10',
					// 	description: 'How many documents to get. Limited to between 1 and 100.'
					// },
					id: {
						default: ['1', '2'],
						description: 'The id of the document to get. Can be provided multiple times.',
						list: true,
						required: true,
						type: 'string'
					},
					// start: {
					// 	attributes: '<optional>',
					// 	default: '0',
					// 	description: 'Start index (used for paging).'
					// },
					// filters: {
					// 	attributes: '<optional>',
					// 	default: '{}',
					// 	description: 'Query filters. See <a href="https://developer.enonic.com/docs/xp/stable/storage/filters">documentation</a>.'
					// },
					// query: {
					// 	attributes: '<optional>',
					// 	default: '{}',
					// 	description: 'Query expression. Keep in mind that filters are usually more quicker. See <a href="https://developer.enonic.com/docs/xp/stable/storage/noql">documentation</a>.'
					// }
				}}
				responses={[{
					body: [{
						_id: '1',
						_name: 'name',
						_path: '/name',
						document_metadata: {
							collection: "enonic",
							collector:{
								id: "com.enonic.app.explorer:webcrawl",
								version: "2.0.0.SNAPSHOT"
							},
							createdTime: "2023-07-24T11:27:10.679Z",
							documentType: "webpage",
							language: "en",
							modifiedTime: "2023-08-07T08:54:42.294Z",
							stemmingLanguage: "en",
							valid: true
						},
						text: 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
						title: 'Example Domain',
						url: 'https://www.example.com'
					}],
					// contentType: 'text/json;charset=utf-8',
					status: 200,
				},{
					body: {
						message: "Didn't find any documents for ids:1,2"
					},
					// contentType: 'text/json;charset=utf-8',
					status: 404,
				}]}
			/>
			<Action
				apiKey={apiKey}
				comment='Create or modify document(s)'
				curl={`-H "authorization:Explorer-Api-Key ${apiKey}" -H "content-type:application/json"`}
				data={{
					default: [{
						available: true,
						count: -999999999999999,
						date: '2021-01-01',
						datetime: '2021-01-01T00:00:00',
						instant: '2021-01-01T00:00:00Z',
						location: '59.9090442,10.7423389',
						price: -999999999999999.9,
						time: '00:00:00',
						language: 'english',
						text: 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
						title: 'Example Domain',
						url: 'https://www.example.com'
					},{
						available: false,
						count: 999999999999999,
						date: '2021-12-31',
						datetime: '2021-12-31T23:59:59',
						instant: '2021-12-31T23:59:59Z',
						location: [
							59.9090442,
							10.7423389
						],
						price: 999999999999999.9,
						time: '23:59:59',
						language: 'english',
						text: 'Whatever',
						title: 'Whatever',
						url: 'https://www.whatever.com'
					}],
					examples: [{
						comment: 'Create a document',
						type: 'object',
						example: {
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
							title: 'Hello World',
							uri: 'https://www.example.com'
						}
					},{
						comment: 'Modify a document',
						type: 'object',
						example: {
							_id: '1',
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
							title: 'Hello World',
							uri: 'https://www.example.com'
						}
					}, {
						comment: 'Create multiple documents',
						type: 'object[]',
						example: [{
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
							title: 'The standard Lorem Ipsum passage, used since the 1500s',
							uri: 'https://www.example.com'
						}, {
							text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
							title: 'Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC',
							uri: 'https://www.example.com'
						}]
					},{
						comment: 'Update multiple documents',
						type: 'object[]',
						example: [{
							_id: '1',
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
							title: 'The standard Lorem Ipsum passage, used since the 1500s',
							uri: 'https://www.example.com'
						}, {
							_id: '2',
							text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
							title: 'Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC',
							uri: 'https://www.example.com'
						}]
					},{
						comment: 'Create or update multiple documents',
						type: `{
  _id?: string
  [key: string]?: unknown
}[]`,
						example: [{
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
							title: 'The standard Lorem Ipsum passage, used since the 1500s',
							uri: 'https://www.example.com'
						}, {
							_id: '1',
							text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
							title: 'Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC',
							uri: 'https://www.example.com'
						}]
					}],
					type: 'object | object[]'
				}}
				method="POST"
				parameters={{
					documentType: {
						description: <>The documentType is selected in the following order:
						<ol>
							<li>_documentTypeId property on each document in the body json.</li>
							<li>_documentType property on each document in the body json.</li>
							<li>documentTypeId url query parameter.</li>
							<li>documentType url query.</li>
							<li>documentTypeId property stored on the collection node.</li>
						</ol>
						If it's not provided by any of these ways, the document will NOT be created or updated.
						</>,
						list: false,
						required: false,
						type: 'string'
					},
					partial: {
						default: false,
						description: 'When true, values are only added or updated. Unprovided values are not removed.',
						list: false,
						required: false,
						type: 'boolean'
					},
					requireValid: {
						default: true,
						description: 'The data has to be valid, according to the field types, to be created or updated. If requireValid=true and the data is not strictly valid, an error will be returned.',
						list: false,
						required: false,
						type: 'boolean'
					}
				}}
				pattern={`${prefix}`}
			/>
			<Action
				apiKey={apiKey}
				comment='Query document(s)'
				curl={`-H "authorization:Explorer-Api-Key ${apiKey}" -H "content-type:application/json" -d'${JSON.stringify({
					count: 10,
					filters: {
						boolean: {
							must: {
								exists: {
									field: 'url'
								}
							}
						}
					},
					query: {
						boolean: {
							must: {
								term: {
									field: 'url',
									value: 'https://enonic.com'
								}
							}
						}
					},
					sort: {
						field: 'score',
						direction: 'DESC'
					},
					start: 0,
				} as QueryNodeParams, null, 4)}'`}
				method="POST"
				pattern={`${prefix}/query`}
			/>
			<Action
				apiKey={apiKey}
				comment='Delete document(s)'
				curl={`-H "authorization:Explorer-Api-Key ${apiKey}"`}
				parameters={{
					id: {
						default: ['1', '2'],
						description: 'The id of the document to delete. Can be provided multiple times.',
						list: true,
						required: true,
						type: 'string'
					},
				}}
				method="DELETE"
				pattern={`${prefix}`}
			/>
			<h2>Single</h2>
			<Form>
				<Form.Input
					label='Document ID'
					placeholder='Document ID'
					onChange={(_, { value }) => setDocumentId(value)}
				/>
			</Form>
			<Action
				apiKey={apiKey}
				curl={`-H "authorization:Explorer-Api-Key ${apiKey}"`}
				comment='Get a document'
				method="GET"
				pattern={documentPath}
			/>
			<Action
				apiKey={apiKey}
				curl={`-H "authorization:Explorer-Api-Key ${apiKey}" -H "content-type:application/json"`}
				comment='Patch a document'
				data={{
					default: {
						available: false,
						count: 0,
						date: '2023-01-01',
						datetime: '2023-01-01T00:00:00',
						instant: '2023-01-01T00:00:00Z',
						location: '59.9090442,10.7423389',
						price: 0,
						// time: '00:00:00',
						language: 'norsk',
						text: 'Hei!',
						title: 'Tittel',
						url: 'https://www.example.no'
					},
					examples: [{
						comment: 'Patch a document',
						type: 'object',
						example: {
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
							title: 'Hello World',
							uri: 'https://www.example.com'
						}
					}],
					type: 'object'
				}}
				method="POST"
				parameters={{
					documentType: {
						description: <>The documentType is selected in the following order:
						<ol>
							<li>_documentTypeId property on each document in the body json.</li>
							<li>_documentType property on each document in the body json.</li>
							<li>documentTypeId url query parameter.</li>
							<li>documentType url query.</li>
							<li>documentTypeId property stored on the collection node.</li>
						</ol>
						If it's not provided by any of these ways, the document will NOT be created or updated.
						</>,
						list: false,
						required: false,
						type: 'string'
					},
					partial: {
						default: false,
						description: 'When true, values are only added or updated. Unprovided values are not removed.',
						list: false,
						required: false,
						type: 'boolean'
					},
					requireValid: {
						default: true,
						description: 'The data has to be valid, according to the field types, to be created or updated. If requireValid=true and the data is not strictly valid, an error will be returned.',
						list: false,
						required: false,
						type: 'boolean'
					}
				}}
				pattern={documentPath}
			/>
			<Action
				apiKey={apiKey}
				curl={`-H "authorization:Explorer-Api-Key ${apiKey}"`}
				comment='Delete a document'
				method="DELETE"
				pattern={documentPath}
			/>
		</Segment>
	</main>;
}
