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
import React from 'react';

import { RootStackParamList } from '../../../App';
import MainStyles from '../../styles/main.scss';

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
				<Text
					style={[MainStyles['text-header-2'], { width: '90%' }]}
					numberOfLines={1}
				>
					{title}
				</Text>
				{subtitles.map((sub) => (
					<Text
						style={[MainStyles['text-body-2'], MainStyles['primary-blue']]}
						key={sub}
					>
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

// if we use the toggle in the future, make sure to pass in toggleState and onToggleChange in the props
const Drawer = ({ headerProps, links }: DrawerProps) => {
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
		</>
	);
};

/*
	TODO: In addition to checking if user is logged in, if a user is logged in, check for the enterprise flag
Toggle for future use when we need
<Toggle
					state={toggleState}
					onChange={() => onToggleChange(!toggleState)}
					disabledIcon="md-person"
					enabledIcon="md-people"
				/>
				*/

const styles = StyleSheet.create({
	header: {
		padding: 15,
		paddingTop: 50,
		backgroundColor: '#eee',
		flexDirection: 'row',
		alignItems: 'center',
		overflow: 'hidden',
	},
	headerImage: {
		width: 100,
		height: 100,
		marginRight: 15,
		borderRadius: 5,
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
