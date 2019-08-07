import {
	getIn,
	ErrorMessage,
	Field
} from 'formik';
import {
	Icon,
	Input as SemanticUiReactInput,
	Message
} from 'semantic-ui-react';


export const Input = (props) => {
	//console.debug('FormikSemanticUiReactInput props', props);
	const {
		label,
		name,
		parentPath,
		path = parentPath ? `${parentPath}.${name}` : name,
		...inputRest
	} = props;
	//console.debug('FormikSemanticUiReactInput inputRest', inputRest);
	return <Field
		name={path}
		render={(props) => {
			//console.debug('Field.render props', props);
			const {
				field,
				form: formik
			} = props;
			//console.debug('FormikSemanticUiReactInput formik', formik);
			const {
				//name,
				onBlur, // Remove from fieldRest
				//onChange, // Also in inputRest!
				type = 'text',
				//value,
				...fieldRest
			} = field;
			//console.debug('FormikSemanticUiReactInput fieldRest', fieldRest);
			const {
				errors//,
				//touched
			} = formik;
			//console.debug('FormikSemanticUiReactInput errors', errors);
			const error = getIn(errors, path);
			const boolError = !!error;
			const boolTouched = getIn(formik.touched, path, false);
			//console.debug('FormikSemanticUiReactInput touched', formik.touched, boolTouched);
			//console.debug('FormikSemanticUiReactInput error', error, boolError);
			return <>
				<SemanticUiReactInput
					{...fieldRest}
					{...inputRest}
					error={boolTouched && boolError}
					label={label}
					type={type}
				/>
				<ErrorMessage
					name={path}
					render={(string) => {
						// the render callback will only be called when the
						// field has been touched and an error exists and
						// subsequent updates.
						return <Message icon negative>
							<Icon name='warning'/>
							<Message.Content>
								<Message.Header>{path}</Message.Header>
								{string}
							</Message.Content>
						</Message>
					}}
				/>
			</>;
		}}
	/>; // Field
} // Input
