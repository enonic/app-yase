//import {toStr} from '@enonic/js-utils';
import {coerseInterfaceType} from '/lib/explorer/interface/coerseInterfaceType';
import {PRINCIPAL_EXPLORER_WRITE} from '/lib/explorer/model/2/constants';
import {create} from '/lib/explorer/interface/create';
import {connect} from '/lib/explorer/repo/connect';
import {
	GraphQLID,
	GraphQLString,
	list
	//@ts-ignore
} from '/lib/graphql';
import {
	GQL_INPUT_TYPE_INTERFACE_FIELD_NAME,
	GQL_MUTATION_INTERFACE_CREATE_NAME,
	GQL_TYPE_INTERFACE_NAME
} from '../constants';


export function addMutationInterfaceCreate({glue}) {
	glue.addMutation({
		name: GQL_MUTATION_INTERFACE_CREATE_NAME,
		args: {
			_name: glue.getScalarType('_name'),
			collectionIds: list(GraphQLID), // null allowed
			fields: list(glue.getInputType(GQL_INPUT_TYPE_INTERFACE_FIELD_NAME)), // null allowed
			//stopWordIds: list(GraphQLID), // null allowed
			stopWords: list(GraphQLString), // null allowed
			synonymIds: list(GraphQLID) // null allowed
		},
		resolve(env :{
			args :{
				_name :string
				collectionIds :Array<string>
				fields :Array<{
					boost ?:number
					name :string
				}>
				stopWords :Array<string>
				synonymIds :Array<string>
			}
		}) {
			//log.debug(`env:${toStr(env)}`);
			const {
				args: {
					_name,
					collectionIds = [],
					fields = [],
					//stopWordIds = [],
					stopWords = [],
					synonymIds = []
				}
			} = env;
			const createdNode = create({ // Model applies forceArray and reference
				_name,
				collectionIds, // empty array allowed
				fields,
				//stopWordIds: stopWordIds.map((stopWordId) => reference(stopWordId)), // empty array allowed
				stopWords,
				synonymIds // empty array allowed
			}, {
				writeConnection: connect({principals: [PRINCIPAL_EXPLORER_WRITE]})
			});
			//log.debug(`createdNode:${toStr(createdNode)}`);
			return coerseInterfaceType(createdNode);
		},
		type: glue.getObjectType(GQL_TYPE_INTERFACE_NAME)
	});
}
