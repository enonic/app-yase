import type {
	CollectorComponentRef,
	CollectorProps
} from '/lib/explorer/types/index.d';
import type {CollectorConfig} from './useWebCrawlerState';

import * as React from 'react';
import {
	Button,
	Form,
	Header,
	Icon,
	Input,
	Table
} from 'semantic-ui-react';
import {DeleteItemButton} from './components/DeleteItemButton';
import {InsertButton} from './components/InsertButton';
import {MoveDownButton} from './components/MoveDownButton';
import {MoveUpButton} from './components/MoveUpButton';
import {useWebCrawlerState} from './useWebCrawlerState';


const DEFAULT_UA = 'Mozilla/5.0 (compatible; Enonic XP Explorer Collector Web crawler/1.0.0)';


export const Collector = React.forwardRef(({
	collectorConfig, // Changes is affected by setCollectorConfig
	initialCollectorConfig, // Never changes, is not affected by setCollectorConfig
	//explorer,
	setCollectorConfig, // This only affects collectorConfig, NOT initialCollectorConfig.
	setCollectorConfigErrorCount
} :CollectorProps<CollectorConfig>, ref :CollectorComponentRef<CollectorConfig>) => {
	const {
		baseUriError,
		baseUriOnBlur,
		baseUriOnChange,
		excludesArray,
		setExcludesArray,
		setUserAgent,
		userAgent
	} = useWebCrawlerState({
		collectorConfig,
		initialCollectorConfig,
		ref,
		setCollectorConfig,
		setCollectorConfigErrorCount
	});
	return <Form>
		<Form.Input
			error={baseUriError}
			fluid
			label='Uri'
			onBlur={baseUriOnBlur}
			onChange={baseUriOnChange}
			required
			value={collectorConfig
				? (collectorConfig.baseUri || '')
				: ''}
		/>
		{excludesArray && Array.isArray(excludesArray) && excludesArray.length
			? <>
				<Header as='h4' content='Exclude pattern(s)' dividing/>
				<Table celled compact selectable striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell collapsing>Regular expression</Table.HeaderCell>
							<Table.HeaderCell collapsing>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>{excludesArray.map((
						exclude = '',
						index
					) => {
						return <Table.Row key={index}>
							<Table.Cell>
								<Input
									fluid
									onChange={(_event,{value}) => {
										const deref = JSON.parse(JSON.stringify(excludesArray));
										deref[index] = value;
										setExcludesArray(deref);
									}}
									value={exclude}
								/>
							</Table.Cell>
							<Table.Cell collapsing>
								<Button.Group>
									<InsertButton
										array={excludesArray}
										insertAtIndex={index + 1}
										setArrayFunction={setExcludesArray}
										valueToInsert=''
									/>
									<MoveDownButton
										array={excludesArray}
										index={index}
										setArrayFunction={setExcludesArray}
									/>
									<MoveUpButton
										array={excludesArray}
										index={index}
										setArrayFunction={setExcludesArray}
									/>
									<DeleteItemButton
										array={excludesArray}
										disabled={false}
										index={index}
										setArrayFunction={setExcludesArray}
									/>
								</Button.Group>
							</Table.Cell>
						</Table.Row>;
					})}</Table.Body>
				</Table>
			</>
			: <Form.Field>
				<Button
					onClick={() => {
						setExcludesArray(['']);
					}}
				>
					<Icon color='green' name='plus'/>Add exclude pattern(s)
				</Button>
			</Form.Field>
		}
		<Form.Input
			fluid
			label='Custom User-Agent'
			onChange={(_event,{value}) => setUserAgent(value)}
			placeholder={`Leave empty to use ${DEFAULT_UA}`}
			value={userAgent}
		/>
	</Form>;
}); // Collector
Collector.displayName = 'Collector';
