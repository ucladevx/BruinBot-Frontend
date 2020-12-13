import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	FlatList,
	Text,
	Image,
	TouchableOpacity,
	Switch,
	StyleSheet,
	Dimensions,
	ImageSourcePropType,
} from 'react-native';
import { Icon } from 'react-native-elements';

interface HeaderProps {
	imgSrc: ImageSourcePropType;
	title: string;
	subtitles: string[];
}

const MenuHeader = ({ imgSrc, title, subtitles }: HeaderProps) => {
	return (
		<View style={styles.menuHeader}>
			<Image source={imgSrc} style={imageStyles.headerImage} />
			<View>
				<Text style={styles.text}>{title}</Text>
				{subtitles.map((sub) => (
					<Text style={{ fontSize: 12 }} key={sub}>
						{sub}
					</Text>
				))}
			</View>
		</View>
	);
};

interface Link {
	text: string;
	route: string;
	iconName: string;
}

interface MenuProps {
	header: HeaderProps;
	links: Link[];
	toggleState: boolean;
	onToggleChange(val: boolean): void;
}

const Menu = ({ header, links, toggleState, onToggleChange }: MenuProps) => {
	return (
		<SafeAreaView style={styles.menu}>
			<MenuHeader {...header} />
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
					color={!toggleState ? '#000' : '#ccc'}
				/>
				<Switch
					trackColor={{ false: '#eee', true: '#aaa' }}
					value={toggleState}
					onValueChange={() => onToggleChange(!toggleState)}
				/>
				<Icon
					style={{ marginLeft: 15 }}
					name="md-people"
					type="ionicon"
					color={toggleState ? '#000' : '#ccc'}
				/>
			</View>
		</SafeAreaView>
	);
};

interface NavProps {
	menu: MenuProps;
	title: string;
	imgSrc?: ImageSourcePropType;
}

const NavMenu = ({ menu, title, imgSrc }: NavProps) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<SafeAreaView style={styles.nav}>
				<Icon
					containerStyle={{ width: 50 }}
					name="md-menu"
					type="ionicon"
					size={30}
					onPress={() => setOpen(true)}
				/>
				<View
					style={{
						width: '100%',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						paddingRight: 100,
					}}
				>
					{imgSrc && <Image style={imageStyles.navImage} source={imgSrc} />}
					<Text style={styles.text}>{title}</Text>
				</View>
			</SafeAreaView>
			{open && (
				<>
					<TouchableOpacity
						style={styles.overlay}
						onPress={() => setOpen(false)}
						activeOpacity={1}
					/>
					<Menu {...menu} />
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		zIndex: 1,
	},
	menu: {
		position: 'absolute',
		backgroundColor: '#eee',
		width: Dimensions.get('window').width * 0.78,
		height: Dimensions.get('window').height,
		zIndex: 1,
	},
	menuHeader: {
		padding: 15,
		backgroundColor: '#eee',
		flexDirection: 'row',
		alignItems: 'center',
	},
	menuList: {
		height: '100%',
		backgroundColor: '#fff',
	},
	nav: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},
	text: {
		fontWeight: 'bold',
		fontSize: 17,
	},
	link: {
		padding: 20,
		fontSize: 20,
		textAlign: 'left',
	},
});

const imageStyles = StyleSheet.create({
	navImage: {
		width: 30,
		height: 30,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#ddd',
		marginRight: 5,
	},
	headerImage: {
		width: 100,
		height: 100,
		marginRight: 15,
		borderRadius: 5,
	},
});

export default NavMenu;
