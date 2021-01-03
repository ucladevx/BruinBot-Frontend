import { Ctx } from '../components/StateProvider';
import { Icon } from 'react-native-elements';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import infoImage from '../assets/info.png';
import messageImage from '../assets/message.png';
import settingImage from '../assets/setting.png';
import shopImage from '../assets/shop.png';

// Icons from <a target="_blank" href="https://icons8.com/icons/set/shop--v2">Shop icon</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> used

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Qr'>;
};

const DashboardScreen = ({ navigation }: Props) => {
	const { dispatch } = useContext(Ctx);
	return (
		<>
			<View style={styles.firstLevelFlex}>
				<View style={styles.secondLevelFlexTop}>
					<TouchableOpacity
						style={styles.icon}
						onPress={() => navigation.navigate('InventoryModification')}
					>
						<Image source={shopImage} />
						<Text style={styles.text}>Purchase items</Text>
					</TouchableOpacity>
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
			<Icon
				name="ios-arrow-back"
				type="ionicon"
				size={40}
				style={styles.back}
				onPress={() => {
					dispatch({ type: 'SET_BOT', bot: null });
					navigation.navigate('Qr');
				}}
			/>
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
