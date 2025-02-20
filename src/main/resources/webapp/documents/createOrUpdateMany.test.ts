import type {
	User,
	getUser,
	hasRole
} from '@enonic-types/lib-auth';
import type {
	get,
	run
} from '@enonic-types/lib-context';
import type {
	listener,
	send
} from '@enonic-types/lib-event';
import type { DocumentNode } from '@enonic-types/lib-explorer/Document.d';
import type { PostRequest } from './createOrGetOrModifyOrDeleteMany';


import {
	describe,
	expect,
	jest,
	test as it
} from '@jest/globals';
import {
	Log,
	Server,
} from '@enonic/mock-xp';
import {
	COLLECTION_REPO_PREFIX,
	Folder,
	NodeType,
	Path,
	Repo,
} from '@enonic/explorer-utils';
import fnv = require('fnv-plus');
import mockLibXpNode from '../../../../../test/mocks/libXpNode';
import mockLibXpRepo from '../../../../../test/mocks/libXpRepo';

//──────────────────────────────────────────────────────────────────────────────
// Constants
//──────────────────────────────────────────────────────────────────────────────
const API_KEY = 'password';
const API_KEY_HASHED = '5a42wj07pr5v1ftmiwdys7w60';
const API_KEY_NAME = 'my_api_key';
const COLLECTION_NAME = 'my_collection';
const COLLECTION_NAME2 = 'my_collection2';
const COLLECTION_REPO_ID = `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME}`;
const COLLECTION_REPO_ID2 = `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME2}`;
const DOCUMENT_TYPE_NAME = 'my_document_type';
const USER = {
	type: 'user',
	key: 'user:system:john.doe',
	displayName: 'John Doe',
	modifiedTime: '',
	disabled: false,
	email: 'john.doe@example.com',
	login: 'john.doe',
	idProvider: 'system'
} as User;

//──────────────────────────────────────────────────────────────────────────────
// Mocks
//──────────────────────────────────────────────────────────────────────────────
const server = new Server({
	loglevel: 'silent',
}).createRepo({
	id: Repo.EXPLORER
}).createRepo({
	id: COLLECTION_REPO_ID
}).createRepo({
	id: COLLECTION_REPO_ID2
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log;

const explorerNodeConnection = server.connect({
	branchId: 'master',
	repoId: Repo.EXPLORER
});

explorerNodeConnection.create({
	_name: Folder.DOCUMENT_TYPES
});

const createdDocumentTypeNode = explorerNodeConnection.create({
	_name: DOCUMENT_TYPE_NAME,
	_nodeType: NodeType.DOCUMENT_TYPE,
	_parentPath: Path.DOCUMENT_TYPES,
	//properties: [{}]
});
// log.debug('createdDocumentTypeNode', createdDocumentTypeNode);


explorerNodeConnection.create({
	_name: Folder.COLLECTIONS,
});
const createdCollection = explorerNodeConnection.create({
	_name: COLLECTION_NAME,
	_nodeType: NodeType.COLLECTION,
	_parentPath: Path.COLLECTIONS,
	// documentTypeId // optional
	// collector: {}, // optional
	language: 'en',
});
const createdCollection2 = explorerNodeConnection.create({
	_name: COLLECTION_NAME2,
	_nodeType: NodeType.COLLECTION,
	_parentPath: Path.COLLECTIONS,
	documentTypeId: createdDocumentTypeNode._id,
	// collector: {}, // optional
	// language: 'no', // optional?
});
explorerNodeConnection.create({
	_name: 'api-keys',
});
//const createdApiKeyNode =
explorerNodeConnection.create({
	_name: API_KEY_NAME,
	_nodeType: NodeType.API_KEY,
	_parentPath: Path.API_KEYS,
	collections: [COLLECTION_NAME],
	interfaces: [],
	hashed: true,
	key: API_KEY_HASHED
});

jest.mock('/lib/explorer/string/hash', () => ({
	hash: jest.fn().mockImplementation((
		value: string,
		bitlength: number = 128
	) => fnv.hash(value, bitlength).str())
}), { virtual: true });

jest.mock('/lib/xp/auth', () => ({
	getUser: jest.fn<typeof getUser>().mockReturnValue(USER),
	hasRole: jest.fn<typeof hasRole>().mockReturnValue(true)
}), { virtual: true });

jest.mock('/lib/xp/common', () => ({
}), { virtual: true });

jest.mock('/lib/xp/context', () => ({
	get: jest.fn<typeof get>().mockReturnValue({
		attributes: {},
		branch: 'master',
		repository: Repo.EXPLORER,
		authInfo: {
			principals: [],
			user: USER
		}
	}),
	run: jest.fn<typeof run>().mockImplementation((_context, callback) => callback())
}), { virtual: true });

jest.mock('/lib/xp/event', () => ({
	listener: jest.fn<typeof listener>().mockReturnValue(undefined),
	send: jest.fn<typeof send>().mockReturnValue(undefined)
}), { virtual: true });

mockLibXpNode({server});
mockLibXpRepo({server});

jest.mock('/lib/xp/value', () => ({
}), { virtual: true });

//──────────────────────────────────────────────────────────────────────────────
// Tests
//──────────────────────────────────────────────────────────────────────────────
describe('webapp', () => {
	describe('documents', () => {
		describe('createOrUpdateMany', () => {
			const collectionConnection = server.connect({
				branchId: 'master',
				repoId: COLLECTION_REPO_ID
			});
			const collection2Connection = server.connect({
				branchId: 'master',
				repoId: COLLECTION_REPO_ID2
			});

			it('creates a single document and modifies the documentType', () => {
				import('./createOrGetOrModifyOrDeleteMany').then((moduleName) => {
					const createOrUpdateManyResponse = moduleName.default({
						body: JSON.stringify({
							key: 'value'
						}),
						contentType: 'application/json',
						headers: {
							authorization: `Explorer-Api-Key ${API_KEY}`
						},
						params: {
							// documentType: createdDocumentTypeNode._name,
							documentTypeId: createdDocumentTypeNode._id,
							// partial: 'false',
							requireValid: 'false',
							// returnDocument: 'true'
						},
						pathParams: {
							collectionName: COLLECTION_NAME
						}
					} as PostRequest);
					// log.error('createOrUpdateManyResponse', createOrUpdateManyResponse);

					const queryRes = collectionConnection.query({
						query: {
							boolean: {
								must: {
									term: {
										field: '_nodeType',
										value: NodeType.DOCUMENT
									}
								}
							}
						}
					});
					// log.error('queryRes', queryRes);

					expect(queryRes.total).toBe(1);
					let documentNode: DocumentNode;
					queryRes.hits.forEach(({id}) => {
						documentNode = collectionConnection.get(id) as unknown as DocumentNode;
						// log.debug('documentNode', documentNode);
					});
					expect(createOrUpdateManyResponse).toStrictEqual({
						body: {
							collection: documentNode['document_metadata']['collection'],
							collector: documentNode['document_metadata']['collector'],
							createdTime: documentNode['document_metadata']['createdTime'],
							document: {
								key: 'value'
							},
							documentType: documentNode['document_metadata']['documentType'],
							id: documentNode._id,
							language: documentNode['document_metadata']['language'],
							stemmingLanguage: documentNode['document_metadata']['stemmingLanguage'],
							valid: documentNode['document_metadata']['valid'],
						},
						contentType: 'text/json;charset=utf-8',
						status: 200
					});
					expect(documentNode['key']).toBe('value');
					collectionConnection.delete(documentNode._id);

					// const queryExplorerRes = explorerNodeConnection.query({});
					// // log.debug('queryExplorerRes', queryExplorerRes);
					// queryExplorerRes.hits.forEach(({id}) => {
					// 	const node = explorerNodeConnection.get(id) //as unknown as DocumentNode;
					// 	log.debug('node', node);
					// });

					const modifiedDocumentTypeNode = explorerNodeConnection.get(createdDocumentTypeNode._id);
					// log.debug('modifiedDocumentTypeNode', modifiedDocumentTypeNode);
					expect(modifiedDocumentTypeNode['properties']).toStrictEqual([{
						active: true,
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						name: 'key',
						nGram: false,
						path: false,
						stemmed: false,
						valueType: 'string'
					}]);
				});
			}); // it

			it('creates multiple documents', () => {
				import('./createOrGetOrModifyOrDeleteMany').then((moduleName) => {
					const createOrUpdateManyResponse = moduleName.default({
						body: JSON.stringify([{
							action: 'create',
							document: {
								key: 'value1'
							}
						},{
							action: 'create',
							document: {
								key: 'value2'
							}
						}]),
						contentType: 'application/json',
						headers: {
							authorization: `Explorer-Api-Key ${API_KEY}`
						},
						params: {
							documentType: createdDocumentTypeNode._name,
							// documentTypeId: createdDocumentTypeNode._id,
							requireValid: 'false'
						},
						pathParams: {
							collectionName: COLLECTION_NAME
						}
					} as PostRequest);
					// log.error('createOrUpdateManyResponse', createOrUpdateManyResponse);

					const queryRes = collectionConnection.query({
						query: {
							boolean: {
								must: {
									term: {
										field: '_nodeType',
										value: NodeType.DOCUMENT
									}
								}
							}
						}
					});
					// log.error('queryRes', queryRes);

					expect(queryRes.total).toBe(2);
					// queryRes.hits.forEach(({id}) => {
					// 	const documentNode = collectionConnection.get(id) as unknown as DocumentNode;
					// 	log.debug('documentNode', documentNode);
					// });
					expect(createOrUpdateManyResponse).toStrictEqual({
						body: queryRes.hits.map(({id}) => {
							const documentNode = collectionConnection.get(id) as unknown as DocumentNode;
							const {
								collection,
								collector,
								createdTime,
								documentType,
								language,
								stemmingLanguage,
								valid
							} = documentNode.document_metadata;
							return {
								action: 'create',
								collection,
								collector,
								createdTime,
								documentType,
								id,
								language,
								status: 200,
								stemmingLanguage,
								valid
							};
						}),
						contentType: 'text/json;charset=utf-8',
						status: 200
					});
					expect(collectionConnection.get(queryRes.hits[0].id)['key']).toBe('value1');
					expect(collectionConnection.get(queryRes.hits[1].id)['key']).toBe('value2');

					collectionConnection.delete(queryRes.hits[0].id);
					collectionConnection.delete(queryRes.hits[1].id);
				});
			}); // it

			it('creates document using query param documentType', () => {
				import('./createOrGetOrModifyOrDeleteMany').then((moduleName) => {
					const createOrUpdateManyResponse = moduleName.default({
						body: JSON.stringify({
							key: 'value'
						}),
						contentType: 'application/json',
						headers: {
							authorization: `Explorer-Api-Key ${API_KEY}`
						},
						params: {
							documentType: createdDocumentTypeNode._name,
							requireValid: 'false'
						},
						pathParams: {
							collectionName: COLLECTION_NAME
						}
					} as PostRequest);
					// log.error('createOrUpdateManyResponse', createOrUpdateManyResponse);

					const queryRes = collectionConnection.query({
						query: {
							boolean: {
								must: {
									term: {
										field: '_nodeType',
										value: NodeType.DOCUMENT
									}
								}
							}
						}
					});
					// log.error('queryRes', queryRes);

					expect(queryRes.total).toBe(1);

					const documentNode = collectionConnection.get(queryRes.hits[0].id) as unknown as DocumentNode;
					// log.error('documentNode', documentNode);
					const {
						collection,
						collector,
						createdTime,
						documentType,
						language,
						stemmingLanguage,
						valid
					} = documentNode.document_metadata;

					expect(createOrUpdateManyResponse).toStrictEqual({
						body: {
							collection,
							collector,
							createdTime,
							document: {
								key: 'value'
							},
							documentType,
							id: documentNode._id,
							language,
							stemmingLanguage,
							valid
						},
						contentType: 'text/json;charset=utf-8',
						status: 200
					});
					expect(collectionConnection.get(queryRes.hits[0].id)['key']).toBe('value');

					collectionConnection.delete(queryRes.hits[0].id);
				});
			}); // it

			it("does NOT create a document when it's unable to determine documentType", () => {
				import('./createOrGetOrModifyOrDeleteMany').then((moduleName) => {
					const createOrUpdateManyResponse = moduleName.default({
						body: JSON.stringify([{
							action: 'create',
							document: {
								key: 'value'
							}
						}]),
						contentType: 'application/json',
						headers: {
							authorization: `Explorer-Api-Key ${API_KEY}`
						},
						params: {
							requireValid: 'false'
						},
						pathParams: {
							collectionName: COLLECTION_NAME
						}
					} as PostRequest);
					// log.error('createOrUpdateManyResponse', createOrUpdateManyResponse);

					const queryRes = collectionConnection.query({
						query: {
							boolean: {
								must: {
									term: {
										field: '_nodeType',
										value: NodeType.DOCUMENT
									}
								}
							}
						}
					});
					// log.error('queryRes', queryRes);

					expect(queryRes.total).toBe(0);
					expect(createOrUpdateManyResponse).toStrictEqual({
						body: [{
							error: 'Unknown error. The stacktrace has been logged.'
						}],
						contentType: 'text/json;charset=utf-8',
						status: 200
					});
				});
			}); // it

			it('creates a single document when documentType is only stored in the collection', () => {
				import('./createOrGetOrModifyOrDeleteMany').then((moduleName) => {
					const createOrUpdateManyResponse = moduleName.default({
						body: JSON.stringify({
							key: 'value'
						}),
						contentType: 'application/json',
						headers: {
							authorization: `Explorer-Api-Key ${API_KEY}`
						},
						params: {
							documentTypeId: createdDocumentTypeNode._id,
							requireValid: 'false'
						},
						pathParams: {
							collectionName: COLLECTION_NAME2
						}
					} as PostRequest);
					// log.error('createOrUpdateManyResponse', createOrUpdateManyResponse);

					const queryRes = collection2Connection.query({
						query: {
							boolean: {
								must: {
									term: {
										field: '_nodeType',
										value: NodeType.DOCUMENT
									}
								}
							}
						}
					});
					// log.error('queryRes', queryRes);

					expect(queryRes.total).toBe(1);
					let documentNode: DocumentNode;
					queryRes.hits.forEach(({id}) => {
						documentNode = collection2Connection.get(id) as unknown as DocumentNode;
						// log.debug('documentNode', documentNode);
					});
					expect(createOrUpdateManyResponse).toStrictEqual({
						body: {
							collection: documentNode['document_metadata']['collection'],
							collector: documentNode['document_metadata']['collector'],
							createdTime: documentNode['document_metadata']['createdTime'],
							document: {
								key: 'value'
							},
							documentType: documentNode['document_metadata']['documentType'],
							id: documentNode._id,
							valid: documentNode['document_metadata']['valid'],
						},
						contentType: 'text/json;charset=utf-8',
						status: 200
					});
					expect(documentNode['key']).toBe('value');
					collection2Connection.delete(documentNode._id);

					// const queryExplorerRes = explorerNodeConnection.query({});
					// // log.debug('queryExplorerRes', queryExplorerRes);
					// queryExplorerRes.hits.forEach(({id}) => {
					// 	const node = explorerNodeConnection.get(id) //as unknown as DocumentNode;
					// 	log.debug('node', node);
					// });
				});
			}); // it

		}); // describe createOrUpdateMany
	});
});
