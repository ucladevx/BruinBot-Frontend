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
} from 'react-native';
import { Icon } from 'react-native-elements';

import {
	ItemProps,
	HeaderProps,
	InventoryProps,
} from '../types/inventoryTypes';

const Item = ({ _id, name, price, imgSrc }: ItemProps) => {
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

const InventoryHeader = ({ height, vendor, ...rest }: HeaderProps) => {
	return (
		<View style={{ ...styles.nav, height }} {...rest}>
			<Icon
				name="minus"
				type="feather"
				size={40}
				color="#aaa"
				iconStyle={{ marginVertical: -10 }}
			/>
			<Image
				style={{
					height: 70,
					width: 70,
					marginLeft: 'auto',
					marginRight: 'auto',
				}}
				source={vendor.imgSrc}
			/>
			<View style={styles.flexBetween}>
				<Text style={{ fontWeight: 'bold' }}>{vendor.name} BruinBot</Text>
				<Text style={{ fontWeight: 'bold' }}>{vendor.inventorySize} items</Text>
			</View>
			<View style={styles.flexBetween}>
				<Text>{vendor.distance.toFixed(2)} miles away</Text>
				<Text>{vendor.itemsSold} items sold</Text>
			</View>
		</View>
	);
};

interface WrapValue {
	value: Animated.Value;
	collapsed: boolean;
}

const Inventory = ({
	id,
	info,
	items,
	collapsedHeight = 150,
	collapsable = true,
}: InventoryProps) => {
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

	return (
		<Animated.View style={animatedStyle}>
			<InventoryHeader
				vendor={info[id]}
				height={collapsedHeight}
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
					/>
				)}
				keyExtractor={(item) => item._id}
				horizontal={false}
				numColumns={2}
			/>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	nav: {
		borderColor: '#ccc',
		borderBottomWidth: 1,
		paddingHorizontal: 10,
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
});

export default Inventory;
