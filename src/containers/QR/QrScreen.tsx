import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import QrComponent from './QrView';
import React from 'react';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Qr'>;
};

const QrScreen = ({ navigation }: Props) => {
	return (
		<>
			<QrComponent navigation={navigation} />
		</>
	);
};

export default QrScreen;
