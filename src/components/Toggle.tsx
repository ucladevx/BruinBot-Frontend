import React from 'react';
import { View, Switch } from 'react-native';
import { Icon } from 'react-native-elements';

interface ToggleProps {
	state: boolean;
	onChange(val: boolean): void;
}

const Toggle = ({ state, onChange }: ToggleProps) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				paddingBottom: 50,
				backgroundColor: '#fff',
			}}
		>
			<Icon
				style={{ marginRight: 15 }}
				name="md-person"
				type="ionicon"
				color={!state ? '#000' : '#ccc'}
			/>
			<Switch
				trackColor={{ false: '#eee', true: '#aaa' }}
				value={state}
				onValueChange={() => onChange(!state)}
			/>
			<Icon
				style={{ marginLeft: 15 }}
				name="md-people"
				type="ionicon"
				color={state ? '#000' : '#ccc'}
			/>
		</View>
	);
};

export default Toggle;
