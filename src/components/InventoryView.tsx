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
	ImageSourcePropType,
} from 'react-native';
import { Icon } from 'react-native-elements';

interface ItemProps {
	id: string;
	name: string;
	price: number;
	imgSrc: ImageSourcePropType;
}

const Item = ({ name, price, imgSrc }: ItemProps) => {
	return (
		<View style={styles.item}>
			<Image
				style={{
					width: '100%',
					height: 150,
					borderRadius: 10,
				}}
				source={imgSrc}
			/>
			<Text style={{ marginTop: 10 }}>{name}</Text>
			<Text style={{ fontWeight: 'bold' }}>${price.toFixed(2)}</Text>
		</View>
	);
};

interface VendorInfo {
	name: string;
	distance: number;
	inventorySize: number;
	itemsSold: number;
	imgSrc: ImageSourcePropType;
}

interface HeaderProps {
	height: number;
	vendor: VendorInfo;
}

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

interface InventoryProps {
	id: string;
	info: VendorInfo[];
	items: ItemProps[];
	collapsedHeight?: number;
}

const Inventory = ({
	id,
	info,
	items,
	collapsedHeight = 150,
}: InventoryProps) => {
	const openOffset = 44; // ios statusbar
	const collapsedOffset = Dimensions.get('window').height - collapsedHeight;

	const translateY = useRef(new Animated.Value(collapsedOffset)).current;
	translateY.collapsed = true;

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (_, gesture) => {
				translateY.setValue(
					(translateY.collapsed ? collapsedOffset : openOffset) + gesture.dy
				);
			},
			onPanResponderRelease: (_, gesture) => {
				let collapse = gesture.vy > 0; // swiping down
				if (gesture.vy === 0) {
					// tapped, no velocity
					collapse = !translateY.collapsed;
				}
				Animated.spring(translateY, {
					toValue: collapse ? collapsedOffset : openOffset,
					velocity: gesture.vy,
					speed: 20,
					useNativeDriver: true,
				}).start();
				translateY.collapsed = collapse;
			},
		})
	).current;

	return (
		<Animated.View
			style={{
				...styles.container,
				transform: [{ translateY }],
			}}
		>
			<InventoryHeader
				vendor={info[id]}
				height={collapsedHeight}
				{...panResponder.panHandlers}
			/>
			<FlatList
				contentContainerStyle={styles.list}
				data={items[id]}
				renderItem={({ item }) => (
					<Item name={item.name} price={item.price} imgSrc={item.imgSrc} />
				)}
				keyExtractor={(item) => item.id}
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
