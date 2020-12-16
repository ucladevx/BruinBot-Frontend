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
	StyleSheet,
	Dimensions,
	ImageSourcePropType,
} from 'react-native';
import { Icon } from 'react-native-elements';

import Toggle from './Toggle';

const SIDEBAR_WIDTH_PERCENT = 0.78;
const BUFFER_WIDTH = 15;
const NAV_HEIGHT = 90;

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
	openState: boolean;
	onOpenChange(val: boolean): void;
}

const Menu = ({
	header,
	links,
	toggleState,
	onToggleChange,
	openState,
	onOpenChange,
}: MenuProps) => {
	// Translations are offset by a buffer to make swiping feel more natural
	// and allow for a `Animated.spring` bounce animation.
	const width = Dimensions.get('window').width * SIDEBAR_WIDTH_PERCENT;
	const openOffset = -BUFFER_WIDTH;
	const closeOffset = -1 * (width + BUFFER_WIDTH);

	const translateX = useRef(new Animated.Value(-width));
	const opacity = useRef(new Animated.Value(0));

	const animateSidemenu = useCallback(
		(open: boolean) => {
			Animated.spring(translateX.current, {
				toValue: open ? openOffset : closeOffset,
				speed: 20,
				useNativeDriver: true,
			}).start();

			Animated.spring(opacity.current, {
				toValue: open ? 1 : 0,
				speed: 20,
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
				if (gesture.dx < BUFFER_WIDTH) {
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
				<MenuHeader {...header} />
				{linkList}
				<Toggle
					state={toggleState}
					onChange={(val: boolean) => onToggleChange(val)}
					disabledIcon="md-person"
					enabledIcon="md-people"
				/>
			</Animated.View>
		</>
	);
};

interface NavProps {
	menu: Omit<MenuProps, 'widthPercent' | 'openState' | 'onOpenChange'>;
	title: string;
	logoSrc?: ImageSourcePropType;
}

const NavBar = ({ menu, title, logoSrc }: NavProps) => {
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
					{logoSrc && <Image style={imageStyles.navImage} source={logoSrc} />}
					<Text style={styles.headerText}>{title}</Text>
				</View>
			</SafeAreaView>
			<Menu {...menu} openState={open} onOpenChange={(val) => setOpen(val)} />
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
		width: menuWidth + BUFFER_WIDTH, // pad
		paddingLeft: BUFFER_WIDTH,
		zIndex: 2,
	},
	menuHeader: {
		padding: 15,
		paddingTop: 50,
		// move back to the left and repad,
		// so that the background color is not white
		marginLeft: -BUFFER_WIDTH,
		paddingLeft: BUFFER_WIDTH + 15,
		backgroundColor: '#eee',
		flexDirection: 'row',
		alignItems: 'center',
	},
	menuList: {
		backgroundColor: '#fff',
	},
	nav: {
		height: NAV_HEIGHT,
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		zIndex: 1,
	},
	headerText: {
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
		width: 40,
		height: 40,
		borderRadius: 10,
		marginRight: 5,
	},
	headerImage: {
		width: 100,
		height: 100,
		marginRight: 15,
		borderRadius: 5,
	},
});

export default NavBar;
