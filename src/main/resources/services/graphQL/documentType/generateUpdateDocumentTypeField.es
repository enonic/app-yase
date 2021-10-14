import {
	isNotFalse,
	isNull//,
	//toStr
} from '@enonic/js-utils';

import {updateDocumentType} from '/lib/explorer/documentType/updateDocumentType';
import {list} from '/lib/graphql';

import {
	GQL_INPUT_TYPE_DOCUMENT_TYPE_FIELDS_NAME,
	GQL_INPUT_TYPE_DOCUMENT_TYPE_PROPERTIES_NAME,
	GQL_TYPE_DOCUMENT_TYPE_NAME
} from '../constants';


export function generateUpdateDocumentTypeField({
	GQL_INPUT_TYPE_ADD_FIELDS,
	glue
}) {
	return {
		args: {
			_id: glue.getScalarType('_id'),
			_name: glue.getScalarType('_name'),
			_versionKey: glue.getScalarType('_versionKey'),
			addFields: GQL_INPUT_TYPE_ADD_FIELDS,
			fields: list(glue.getInputType(GQL_INPUT_TYPE_DOCUMENT_TYPE_FIELDS_NAME)),
			properties: list(glue.getInputType(GQL_INPUT_TYPE_DOCUMENT_TYPE_PROPERTIES_NAME))
		},
		resolve({args: {
			_id,
			_name,
			_versionKey,
			// GraphQL sends null so default values are not applied
			addFields,
			fields,
			properties
		}}) {
			if (isNotFalse(addFields)) { addFields = true; }
			if (isNull(fields)) { fields = []; }
			if (isNull(properties)) { properties = []; }
			return updateDocumentType({
				_id,
				_name,
				_versionKey,
				addFields,
				fields,
				properties
			});
		},
		type: glue.getObjectType(GQL_TYPE_DOCUMENT_TYPE_NAME)
	};
}
