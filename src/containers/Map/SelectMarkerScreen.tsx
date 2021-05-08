import {
	Dimensions,
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';

import { NAV_HEIGHT } from '../../constants';
import { RootStackParamList } from '../../../App';
import BotIcon from '../../assets/botIcon.png';
import MainStyles from '../../styles/main.scss';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'SelectMarker'>;
	route: RouteProp<RootStackParamList, 'SelectMarker'>;
};

const SelectMarkerScreen = ({ route, navigation }: Props) => {
	const { markers, selectedId } = route.params;

	const [selected, setSelected] = useState<String | null>(selectedId);

	useEffect(() => {
		setSelected(selectedId);
	}, [selectedId]);

	const handlePress = (id: string) => setSelected(id);

	return (
		<View style={{ margin: 0, flexDirection: 'column', alignItems: 'center' }}>
			<FlatList
				style={styles.container}
				data={markers}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => handlePress(item._id)}
						style={[
							styles.select,
							{
								backgroundColor:
									item._id === selected
										? MainStyles['primary-blue'].color + '33'
										: '#fff',
							},
						]}
					>
						<Image style={styles.icon} source={BotIcon} />
						<Text style={styles.text}>{item.name.toUpperCase()}</Text>
					</TouchableOpacity>
				)}
			/>
			<TouchableOpacity
				style={[
					styles.button,

					{
						backgroundColor: !selected
							? MainStyles['primary-gray'].color
							: MainStyles['primary-blue'].color,
					},
				]}
				disabled={selected === null}
				onPress={() => {
					// @ts-ignore
					// Navigating inside a nested navigator gives an tsc error.
					navigation.navigate('BottomBar', {
						screen: 'Map',
						params: {
							botSelected: markers.find((item) => item._id === selected),
						},
					});
				}}
			>
				<Text style={styles.buttonText}>Continue</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		maxHeight: Dimensions.get('window').height,
		marginTop: NAV_HEIGHT + 10,
	},
	select: {
		flexDirection: 'row',
		height: 64,
		width: 344,
		marginVertical: 8,
		marginHorizontal: 15,
		borderRadius: 15,
		backgroundColor: '#fff',
		shadowOffset: { width: 0, height: 1.5 },
		shadowRadius: 2,
		shadowColor: '#000',
		shadowOpacity: 0.3,
	},
	icon: {
		marginTop: 12,
		marginHorizontal: 16,
		height: 40,
		width: 40,
	},
	text: {
		lineHeight: 64,
		color: '#000',
		fontSize: 14,
		fontWeight: '700',
	},
	button: {
		position: 'absolute',
		top: Dimensions.get('window').height - 36 - 64,
		height: 36,
		width: 281,
		borderRadius: 22.5,
	},
	buttonText: {
		color: '#fff',
		lineHeight: 36,
		fontSize: 18,
		textAlign: 'center',
	},
});

export default SelectMarkerScreen;
