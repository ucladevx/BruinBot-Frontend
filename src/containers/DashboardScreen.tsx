import { Ctx } from '../components/StateProvider';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';

import infoImage from '../assets/info.png';
import messageImage from '../assets/message.png';
import settingImage from '../assets/setting.png';
import shopImage from '../assets/shop.png';
// Icons from <a target="_blank" href="https://icons8.com/icons/set/shop--v2">Shop icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> used

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Dashboard'>;
	route: RouteProp<RootStackParamList, 'Dashboard'>;
};

const DashboardScreen = ({ route, navigation }: Props) => {
	// Pass this bot onto the next screen that needs it
	// It's currently unused
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { bot } = route.params;
	const { state } = useContext(Ctx);
	return (
		<>
			<View style={styles.firstLevelFlex}>
				<View style={styles.secondLevelFlexTop}>
					{state.isEnterpriseMode ? (
						<TouchableOpacity
							style={styles.icon}
							onPress={() =>
								navigation.navigate('InventoryModification', {
									bot: bot,
								})
							}
						>
							<Image source={shopImage} />
							<Text style={styles.text}>Edit Inventory</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={styles.icon}
							onPress={() =>
								navigation.navigate('ItemCatalogue', {
									bot: bot,
								})
							}
						>
							<Image source={shopImage} />
							<Text style={styles.text}>Purchase items</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity style={styles.icon}>
						<Image source={messageImage} />
						<Text style={styles.text}>Talk to me!</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.secondLevelFlexBottom}>
					<TouchableOpacity style={styles.icon}>
						<Image source={infoImage} />
						<Text style={styles.text}>Statistics</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.icon}>
						<Image source={settingImage} />
						<Text style={styles.text}>Report bug</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	firstLevelFlex: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	secondLevelFlexTop: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	secondLevelFlexBottom: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	icon: {
		margin: 10,
	},
	text: {
		textAlign: 'center',
	},
	back: {
		left: 10,
		bottom: 10,
		marginTop: 10,
		width: 40,
		height: 40,
	},
});

export default DashboardScreen;
