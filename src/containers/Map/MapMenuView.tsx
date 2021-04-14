import {
	Animated,
	Dimensions,
	FlatList,
	Image,
	PanResponder,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { useRef } from 'react';

import emptyInventoryRobot from '../../assets/emptyInventoryRobot.png';

import {
	HeaderProps,
	InventoryItemProps,
	MapMenuProps,
} from '../../types/inventoryTypes';
import { NAV_HEIGHT } from '../../constants';

const HEADER_HEIGHT = 150;
const BUFFER_HEIGHT = 30;
const BOTTOM_HEIGHT = 50;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const inventoryHeight = screenHeight - (NAV_HEIGHT + 20);

const Item = ({
	_id,
	name,
	price,
	imgSrc,
	quantity,
	clickable = false,
	navigation = undefined,
	bot,
}: InventoryItemProps) => {
	const itemBody = (
		<View
			style={{
				...styles.item,
				// adjust item width when nested under TouchableOpacity
				width: clickable ? screenWidth * 0.44 : styles.item.width,
			}}
			key={_id}
		>
			<Image
				style={{
					width: '100%',
					height: 150,
					borderRadius: 10,
					resizeMode: 'contain',
				}}
				source={{ uri: imgSrc }}
			/>
			<View
				style={{
					marginTop: 10,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Text style={{ fontSize: 16 }}>{name}</Text>
				{quantity !== 0 ? (
					<Text style={{ fontStyle: 'italic' }}>{quantity} left</Text>
				) : (
					<View
						style={{
							borderColor: 'red',
							borderRadius: 5,
							borderWidth: 1,
							padding: 3,
						}}
					>
						<Text style={{ fontWeight: 'bold', color: 'red' }}>
							{quantity} left
						</Text>
					</View>
				)}
			</View>
			<Text style={{ fontWeight: 'bold' }}>
				{price === 0 ? 'FREE' : '$' + price.toFixed(2)}
			</Text>
		</View>
	);

	if (clickable) {
		return (
			<TouchableOpacity
				onPress={() => {
					if (price !== 0) {
						navigation?.navigate('PaymentInfo', {
							amount: price,
							itemId: _id,
							quantity: 1,
							bot: bot,
						});
					} else {
						navigation?.navigate('PaymentSuccess', {
							success: true,
						});
					}
				}}
				key={_id}
			>
				{itemBody}
			</TouchableOpacity>
		);
	} else {
		return itemBody;
	}
};

const MapMenuHeader = ({ info, standalone, button, ...rest }: HeaderProps) => {
	if (!info) {
		// No info, return empty view
		return <View />;
	}

	return (
		<View style={{ ...styles.header }} {...rest}>
			{!standalone ? (
				<Icon
					name="minus"
					type="feather"
					size={40}
					color="#aaa"
					iconStyle={{ marginVertical: -10 }}
				/>
			) : (
				<Icon
					name="minus"
					type="feather"
					size={40}
					color="#fff" // Hides the drag bar
					iconStyle={{ marginVertical: -10 }}
				/>
			)}
			<Image
				style={{
					height: 70,
					width: 70,
					marginLeft: 'auto',
					marginRight: 'auto',
				}}
				source={info.imgSrc}
			/>
			<View style={styles.flexBetween}>
				<Text style={{ fontWeight: 'bold' }}>{info.topLeft}</Text>
				<Text style={{ fontWeight: 'bold' }}>{info.topRight}</Text>
			</View>
			<View style={styles.flexBetween}>
				<Text>{info.bottomLeft}</Text>
				<Text>{info.bottomRight}</Text>
			</View>
			{button && (
				<Pressable
					onPressOut={() => {
						button.onButton(true);
					}}
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? 'rgb(210, 230, 255)'
								: 'rgb(179, 236, 238)',
						},
						styles.orderButton,
					]}
				>
					<Text>{button.title}</Text>
				</Pressable>
			)}
		</View>
	);
};

interface WrapValue {
	value: Animated.Value;
	collapsed: boolean;
}

const MapMenu = ({
	id,
	info,
	items,
	collapsable = true,
	clickable = false,
	navigation = undefined,
	button,
}: MapMenuProps) => {
	const openOffset = -inventoryHeight + HEADER_HEIGHT + BOTTOM_HEIGHT;
	const collapsedOffset = 0;

	const translateY: WrapValue = {
		value: useRef(new Animated.Value(collapsedOffset)).current,
		collapsed: true,
	};

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (_, gesture) => {
				// dy < 0 is upwards, dy > 0 is downwards
				const opening = translateY.collapsed
					? gesture.dy < 0 // opening inventory
					: gesture.dy > -BUFFER_HEIGHT; // allow opening up to buffer
				const closing = !translateY.collapsed
					? gesture.dy > 0 // closing inventory
					: gesture.dy < BUFFER_HEIGHT; // allow closing down to buffer
				if (opening || closing) {
					translateY.value.setValue(
						(translateY.collapsed ? collapsedOffset : openOffset) + gesture.dy
					);
				}
			},
			onPanResponderRelease: (_, gesture) => {
				let collapse = gesture.vy > 0; // swiping down
				if (gesture.vy === 0) {
					// tapped, no velocity
					collapse = !translateY.collapsed;
				}
				Animated.spring(translateY.value, {
					toValue: collapse ? collapsedOffset : openOffset,
					velocity: gesture.vy,
					speed: 20,
					useNativeDriver: true,
				}).start();
				translateY.collapsed = collapse;
			},
		})
	).current;

	const animatedStyle = collapsable
		? {
				...styles.container,
				transform: [{ translateY: translateY.value }],
		  }
		: { ...styles.container, top: NAV_HEIGHT };

	if (!id.length || !info[id]) {
		// invalid id, return empty view
		return <View />;
	}

	if (!items) {
		return <MapMenuHeader info={info[id]} standalone={true} />;
	} else {
		return (
			<Animated.View style={animatedStyle}>
				<MapMenuHeader
					info={info[id]}
					button={button}
					standalone={!collapsable}
					{...panResponder.panHandlers}
				/>
				{items[id].length === 0 ? (
					<View style={styles.emptyInventoryContainer}>
						<Image
							source={emptyInventoryRobot}
							style={styles.emptyInventoryRobot}
						/>
						<Text style={styles.emptyInventoryText}>Sold Out</Text>
					</View>
				) : (
					<FlatList
						contentContainerStyle={styles.list}
						data={items[id]}
						renderItem={({ item }) => (
							<Item
								_id={item._id}
								name={item.name}
								price={item.price}
								quantity={item.quantity}
								imgSrc={item.imgSrc}
								clickable={clickable}
								navigation={navigation}
								bot={item.bot}
							/>
						)}
						keyExtractor={(item) => item._id}
						horizontal={false}
						numColumns={2}
					/>
				)}
			</Animated.View>
		);
	}
};

const styles = StyleSheet.create({
	header: {
		height: HEADER_HEIGHT,
		borderColor: '#ccc',
		borderBottomWidth: 1,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
	},
	flexBetween: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	container: {
		width: screenWidth - 17 * 2,
		height: inventoryHeight + BUFFER_HEIGHT,
		marginBottom: -inventoryHeight - BUFFER_HEIGHT + HEADER_HEIGHT,
		marginLeft: 17,
		borderRadius: 10,
		backgroundColor: '#fff',
		overflow: 'scroll',
	},
	list: {
		width: '94%',
		marginLeft: '3%',
		paddingTop: 25,
		paddingBottom: 75,
	},
	item: {
		width: '46%',
		marginHorizontal: '2%',
		marginVertical: '2%',
		padding: 10,
		backgroundColor: '#fff',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 3,
	},
	orderButton: {
		position: 'absolute',
		top: 10,
		left: 10,
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10,
		padding: 5,
	},
	emptyInventoryContainer: {
		flex: 1,
		height: screenHeight - HEADER_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyInventoryText: {
		fontSize: 35,
		fontWeight: 'bold',
		marginTop: screenHeight * 0.01,
		color: '#bababa',
	},
	emptyInventoryRobot: {
		aspectRatio: 1,
		width: screenWidth * 0.4,
		height: undefined,
	},
});

export default MapMenu;
export { MapMenuHeader };
