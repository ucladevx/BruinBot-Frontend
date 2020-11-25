import React, { useState } from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, View, Text, Alert } from 'react-native';
import { ItemProps, InventoryProps } from "../types/inventoryTypes"
import Ham from '../assets/greenHam.jpg';
import Crane from '../assets/crane.png';
import Inventory from "../components/InventoryView";

const screenWidth = Dimensions.get('window').width;

interface InventoryModificationProps {
    navigation: any;
    botId: string;
}
const InventoryModification = ({
    navigation,
    botId
} : InventoryModificationProps) => {
    //GET PROPER PROPS

    const botInfo: InventoryProps['info'] = {};
    const botItems: InventoryProps['items'] = {};
    
    const item: ItemProps[]= [
        {
            _id: "1",
            name: "Ham 1",
            price: 10,
            imgSrc: Ham
        },
        {
            _id: "2",
            name: "Ham 2",
            price: 15,
            imgSrc: Ham
        },
        {
            _id: "3",
            name: "Ham 3",
            price: 20,
            imgSrc: Ham
        },
        {
            _id: "4",
            name: "Ham 4",
            price: 10,
            imgSrc: Ham
        },
        {
            _id: "5",
            name: "Ham 5",
            price: 15,
            imgSrc: Ham
        },
        {
            _id: "6",
            name: "Ham 6",
            price: 20,
            imgSrc: Ham
        }
    ];

    botInfo["123"] = {
        name: "bot 1",
        inventorySize: 10,
        distance: 0,
        itemsSold: 0,
        imgSrc: Crane
    };
    botItems["123"] = item;
    
    const [infor, setInfor] = useState(botInfo);
	const [items, setItems] = useState(botItems);
    
    //setInfo(botInfo);
    //setInventories(botItems);

	return (
        <>
		<View style={{ flex:1}}>
			<Inventory id="123" info={infor} items={items} />
			<TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate('AddItem')
            }}>
					<Text style={styles.buttonText}>Add Item</Text>
				</TouchableOpacity>
		</View>
        </>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: 'red',
		borderRadius: 30,
		height: 50,
		textAlign: 'center',
		justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: screenWidth * 0.5,
        position: 'absolute',
        bottom: 10
	},
	buttonText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 20,
	},
});


export default InventoryModification;