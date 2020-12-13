import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
	SafeAreaView,
	View,
	FlatList,
	Text,
	Image,
	TouchableOpacity,
	Animated,
	PanResponder,
	Easing,
	StyleSheet,
	Dimensions,
	ImageSourcePropType,
} from 'react-native';
import { Icon } from 'react-native-elements';

import Toggle from './Toggle';

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
	widthPercent: number;
	toggleState: boolean;
	onToggleChange(val: boolean): void;
	openState: boolean;
	onOpenChange(val: boolean): void;
}

const Menu = ({
	header,
	links,
	widthPercent,
	toggleState,
	onToggleChange,
	openState,
	onOpenChange,
}: MenuProps) => {
	// All translations are offset by `width`,
	// to account for the visual buffer on the left of the menu if the user swipes too far.
	// (the full width of the sidebar menu is `2 * width`)

	const width = Dimensions.get('window').width * widthPercent;
	const openOffset = -width;
	const closeOffset = -2 * width;

	const translateX = useRef(new Animated.Value(-width));
	const opacity = useRef(new Animated.Value(0));

	const animateSidemenu = useCallback(
		(open: boolean) => {
			Animated.timing(translateX.current, {
				toValue: open ? openOffset : closeOffset,
				duration: 120,
				easing: Easing.ease,
				useNativeDriver: true,
			}).start();

			Animated.timing(opacity.current, {
				toValue: open ? 1 : 0,
				duration: 120,
				easing: Easing.ease,
				useNativeDriver: true,
			}).start();
		},
		[openOffset, closeOffset]
	);

	useEffect(() => {
		animateSidemenu(openState);
	}, [openState, animateSidemenu]);

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (_, gesture) => {
				if (gesture.dx < width) {
					translateX.current.setValue(openOffset + gesture.dx);
				}
			},
			onPanResponderRelease: (_, gesture) => {
				const collapse = gesture.vx < 0; // swiping left
				onOpenChange(!collapse);
				if (!collapse) {
					animateSidemenu(true);
				}
			},
		})
	).current;

	const overlay = (
		<Animated.View
			pointerEvents={openState ? 'auto' : 'none'}
			style={{
				position: 'absolute',
				zIndex: 1,
				opacity: opacity.current,
			}}
		>
			<TouchableOpacity
				style={styles.overlay}
				onPress={() => onOpenChange(!openState)}
				activeOpacity={1}
			/>
		</Animated.View>
	);

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
			{overlay}
			<Animated.View
				style={{
					...styles.menu,
					transform: [{ translateX: translateX.current }],
				}}
				{...panResponder.panHandlers}
			>
				<Icon
					containerStyle={{
						position: 'absolute',
						top: '50%',
						right: -10,
						zIndex: 1,
						transform: [{ rotate: '90deg' }],
					}}
					name="minus"
					type="feather"
					size={40}
					color="#aaa"
				/>
				<MenuHeader {...header} />
				{linkList}
				<Toggle
					state={toggleState}
					onChange={(val: boolean) => onToggleChange(val)}
				/>
			</Animated.View>
		</>
	);
};

interface NavProps {
	menu: MenuProps;
	title: string;
	imgSrc?: ImageSourcePropType;
}

const SIDEBAR_WIDTH_PERCENT = 0.78;

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
			<Menu
				{...menu}
				openState={open}
				onOpenChange={(val) => setOpen(val)}
				widthPercent={SIDEBAR_WIDTH_PERCENT}
			/>
		</>
	);
};

const window = Dimensions.get('window');
const menuWidth = window.width * SIDEBAR_WIDTH_PERCENT;

const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		width: window.width,
		height: window.height,
		zIndex: 1,
	},
	menu: {
		position: 'absolute',
		backgroundColor: '#fff',
		height: window.height,

		// menu is `2 * width`, with a padded offset of `width`
		// to prevent user from swiping too far
		width: 2 * menuWidth,
		paddingLeft: menuWidth,

		zIndex: 2,
	},
	menuHeader: {
		padding: 15,
		paddingTop: 50,

		// move back to the left and repad,
		// so that the background color is not white
		marginLeft: -menuWidth,
		paddingLeft: menuWidth + 15,

		backgroundColor: '#eee',
		flexDirection: 'row',
		alignItems: 'center',
	},
	menuList: {
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
