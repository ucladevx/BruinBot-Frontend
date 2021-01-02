import {
	FlatList,
	Image,
	ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { RootStackParamList } from '../../App';
import React from 'react';
import Toggle from './Toggle';

interface HeaderProps {
	imgSrc: ImageSourcePropType;
	title: string;
	subtitles: string[];
}

const MenuHeader = ({ imgSrc, title, subtitles }: HeaderProps) => {
	return (
		<View style={styles.header}>
			<Image source={imgSrc} style={styles.headerImage} />
			<View>
				<Text style={styles.headerText}>{title}</Text>
				{subtitles.map((sub) => (
					<Text style={{ fontSize: 12 }} key={sub}>
						{sub}
					</Text>
				))}
			</View>
		</View>
	);
};

export interface Link {
	text: string;
	route: keyof RootStackParamList;
	iconName: string;
	onPress: () => void;
}

interface DrawerProps {
	headerProps: HeaderProps;
	links: Link[];
	toggleState: boolean;
	onToggleChange(val: boolean): void;
}

const Drawer = ({
	headerProps,
	links,
	toggleState,
	onToggleChange,
}: DrawerProps) => {
	const linkList = (
		<FlatList
			style={styles.menuList}
			data={links}
			renderItem={({ item }) => (
				<TouchableOpacity
					key={item.route}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
					onPress={item.onPress}
				>
					<Icon
						containerStyle={{ width: 50, paddingLeft: 20 }}
						name={item.iconName}
						type="ionicon"
					/>
					<Text style={styles.link}>{item.text}</Text>
				</TouchableOpacity>
			)}
			keyExtractor={(link) => link.route}
			horizontal={false}
			numColumns={1}
		/>
	);

	return (
		<>
			<MenuHeader {...headerProps} />
			{linkList}
			<Toggle
				state={toggleState}
				onChange={() => onToggleChange(!toggleState)}
				disabledIcon="md-person"
				enabledIcon="md-people"
			/>
		</>
	);
};

const styles = StyleSheet.create({
	header: {
		padding: 15,
		paddingTop: 50,
		backgroundColor: '#eee',
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerImage: {
		width: 100,
		height: 100,
		marginRight: 15,
		borderRadius: 5,
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 17,
	},
	menuList: {
		backgroundColor: '#fff',
	},
	link: {
		padding: 20,
		fontSize: 20,
		textAlign: 'left',
	},
});

export default Drawer;
