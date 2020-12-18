import React, { useRef } from 'react';
import {
	View,
	FlatList,
	Image,
	Text,
	Dimensions,
	Animated,
	PanResponder,
	StyleSheet,
	Pressable,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
	InventoryItemProps,
	HeaderProps,
	MapMenuProps,
} from '../types/inventoryTypes';

const Item = ({ _id, name, price, imgSrc, clickable }: InventoryItemProps) => {
	if (clickable) {
		return (
			// TODO: Navigate to payment screen
			<TouchableOpacity onPress={() => console.log('Here')} key={_id}>
				<View
					style={[
						styles.item,
						{ width: Dimensions.get('window').width * 0.44 },
					]}
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
					<Text style={{ marginTop: 10 }}>{name}</Text>
					<Text style={{ fontWeight: 'bold' }}>${price.toFixed(2)}</Text>
				</View>
			</TouchableOpacity>
		);
	}
	return (
		<View style={styles.item} key={_id}>
			<Image
				style={{
					width: '100%',
					height: 150,
					borderRadius: 10,
					resizeMode: 'contain',
				}}
				source={{ uri: imgSrc }}
			/>
			<Text style={{ marginTop: 10 }}>{name}</Text>
			<Text style={{ fontWeight: 'bold' }}>${price.toFixed(2)}</Text>
		</View>
	);
};

const MapMenuHeader = ({
	height,
	info,
	onButton,
	standalone,
	...rest
}: HeaderProps) => {
	if (!info) {
		// No info, return empty view
		return <View />;
	}

	return (
		<View style={{ ...styles.nav, height }} {...rest}>
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
			{onButton && (
				<Pressable
					onPressOut={() => {
						onButton(true);
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
					<Text>Order</Text>
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
	collapsedHeight = 150,
	collapsable = true,
	clickable = false,
	setMapProperty,
}: MapMenuProps) => {
	const openOffset = 44; // ios statusbar
	const collapsedOffset = Dimensions.get('window').height - collapsedHeight;

	const translateY: WrapValue = {
		value: useRef(new Animated.Value(collapsedOffset)).current,
		collapsed: true,
	};

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (_, gesture) => {
				translateY.value.setValue(
					(translateY.collapsed ? collapsedOffset : openOffset) + gesture.dy
				);
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
		: { ...styles.container };

	if (!id.length || !info[id]) {
		// invalid id, return empty view
		return <View />;
	}

	if (!items) {
		return (
			<MapMenuHeader
				info={info[id]}
				height={collapsedHeight}
				standalone={true}
			/>
		);
	} else {
		return (
			<Animated.View style={animatedStyle}>
				<MapMenuHeader
					info={info[id]}
					height={collapsedHeight}
					onButton={
						setMapProperty &&
						(() => {
							setMapProperty(id);
						})
					}
					standalone={false}
					{...panResponder.panHandlers}
				/>
				<FlatList
					contentContainerStyle={styles.list}
					data={items[id]}
					renderItem={({ item }) => (
						<Item
							_id={item._id}
							name={item.name}
							price={item.price}
							imgSrc={item.imgSrc}
							clickable={clickable}
						/>
					)}
					keyExtractor={(item) => item._id}
					horizontal={false}
					numColumns={2}
				/>
			</Animated.View>
		);
	}
};

const styles = StyleSheet.create({
	nav: {
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
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		position: 'absolute',
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
});

export default MapMenu;
export { MapMenuHeader };
