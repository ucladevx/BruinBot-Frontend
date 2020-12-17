import React from 'react';
import { View, Switch } from 'react-native';
import { Icon } from 'react-native-elements';

interface Props {
	state: boolean;
	onChange(val: boolean): void;
	disabledIcon: string;
	enabledIcon: string;
	iconType?: string;
}

const Toggle = ({
	state,
	onChange,
	disabledIcon,
	enabledIcon,
	iconType = 'ionicon',
}: Props) => {
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
				name={disabledIcon}
				type={iconType}
				color={!state ? '#000' : '#ccc'}
			/>
			<Switch
				trackColor={{ false: '#eee', true: '#aaa' }}
				value={state}
				onValueChange={() => onChange(!state)}
			/>
			<Icon
				style={{ marginLeft: 15 }}
				name={enabledIcon}
				type={iconType}
				color={state ? '#000' : '#ccc'}
			/>
		</View>
	);
};

export default Toggle;
