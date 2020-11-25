import React, { useState } from 'react';
import { TouchableOpacity, Dimensions, StyleSheet, View, Text, Alert } from 'react-native';
import { ItemProps, InventoryProps } from "../types/inventoryTypes"
import Ham from '../assets/greenHam.jpg';
import Crane from '../assets/crane.png';
import Inventory from "../components/InventoryView";

const AddItem = () => {
	return (
    <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style = {styles.header}>Add an Item</Text>
    </View>  
	);
};

const styles = StyleSheet.create({
    header:{
        top: 44, 
        fontSize: 40,
        fontWeight: "bold"
    }
});


export default AddItem;