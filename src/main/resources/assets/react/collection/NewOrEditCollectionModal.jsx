import {Button, Icon, Modal, Popup} from 'semantic-ui-react';

import {Collection} from './Collection';
import {UploadLicense} from '../UploadLicense';

export function NewOrEditCollectionModal(props) {
	const {
		afterClose = () => {},
		beforeOpen = () => {},
		//collectors,
		collectorComponents,
		collectorOptions,
		contentTypeOptions,
		disabled = false,
		fields,
		initialValues,
		licenseValid,
		locales, // []
		_name,
		servicesBaseUrl,
		setLicensedTo,
		setLicenseValid,
		siteOptions,
		totalNumberOfCollections
	} = props;
	//console.debug('totalNumberOfCollections',totalNumberOfCollections);
	const [state, setState] = React.useState({
		open: false
	});
	//console.debug('NewOrEditModal', {props, state});

	const doClose = () => {
		setState({open: false});
		afterClose();
	};

	// Made doOpen since onOpen doesn't get called consistently.
	const doOpen = () => {
		beforeOpen();
		setState({open: true});
	};

	return <Modal
		closeIcon
		onClose={doClose}
		open={state.open}
		size='large'
		trigger={_name ? <Popup
			content={`Edit collection ${_name}`}
			inverted
			trigger={<Button
				icon
				disabled={disabled}
				onClick={doOpen}
			><Icon color='blue' name='edit'/></Button>}/>
			: <Button
				circular
				color='green'
				disabled={disabled}
				icon
				onClick={doOpen}
				size='massive'
				style={{
					bottom: 13.5,
					position: 'fixed',
					right: 13.5
				}}><Icon
					name='plus'
				/></Button>}
	>{licenseValid || totalNumberOfCollections <= 2 // This means it will be allowed to create collection 3, but not number 4
			? <>
				<Modal.Header>{_name ? `Edit collection ${_name}`: 'New collection'}</Modal.Header>
				<Modal.Content>
					<Collection
						collectorComponents={collectorComponents}
						collectorOptions={collectorOptions}
						contentTypeOptions={contentTypeOptions}
						fields={fields}
						initialValues={initialValues}
						locales={locales}
						doClose={doClose}
						servicesBaseUrl={servicesBaseUrl}
						siteOptions={siteOptions}
					/>
				</Modal.Content>
			</>
			: <UploadLicense
				servicesBaseUrl={servicesBaseUrl}
				setLicensedTo={setLicensedTo}
				setLicenseValid={setLicenseValid}
			/>}
	</Modal>;
} // NewOrEditModal
