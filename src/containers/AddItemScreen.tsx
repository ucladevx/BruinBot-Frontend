import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, Dimensions, StyleSheet, View, Text, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import {Camera, PermissionResponse } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Input, Image } from 'react-native-elements';

const screenWidth = Dimensions.get('window').width;

interface AddItemProps {
    navigation: any;
    botId: string;
}

const AddItem = ({
    navigation,
    botId
} : AddItemProps) => {
    const[nameErrorMessage, setNameErrorMessage] = useState("");
    const[costErrorMessage, setCostErrorMessage] = useState("");
    const[quantityErrorMessage, setQuantityErrorMessage] = useState("");


    const[hasPermission, setHasPermission] = useState<boolean | null>(null);
    const[type, setType] = useState(Camera.Constants.Type.back);
    const[camera, setCamera] = useState<Camera|null>(null);
    const[photo, setPhoto] = useState<string | null>(null);
    const[itemName, setItemName] = useState("");
    const[cost, setCost] = useState(0);
    const[quantity, setQuantity] = useState(1);



    const takePhoto = async () => {
        if (camera) {
            const pic = await camera.takePictureAsync({skipProcessing:true});
            setPhoto(pic.uri);
        }
    };

    const pickImage = async () => {
        const pic = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (pic.cancelled){
            setPhoto(null);
        } else {
            setPhoto(pic.uri);
        }
    };
    useEffect(() => {
        (async () => {
          const response: PermissionResponse = await Camera.requestPermissionsAsync();
          setHasPermission(response.status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return (
			<Text> Requesting permission </Text>
        );      
    }
    if (hasPermission === false) {
        return <Text> No access to camera </Text>;
    }

    const submitItem = async () => {
        if (photo === null){
            Alert.alert("Please submit a photo!")
        } else if (itemName == "" || cost === 0 || quantity === 0) {
            Alert.alert("Please fill out all inputs before submitting")
        } else if (nameErrorMessage !== "" ||  quantityErrorMessage !== "" || costErrorMessage !== "") {
            Alert.alert("Please fix errors before submitting")
        } else {
            //DO REQUEST
            Alert.alert("Added Item succesfully");
            navigation.navigate('InventoryModification');
        }
    }

	return (
    <>
    <View style={{ flex: 1}}>
    <FontAwesome name="arrow-left" style={
                    { color: "black", 
                    fontSize: 30,
                    position: 'absolute',
                    top: 40,
                    left: 15,
                }} onPress={()=>{
                    navigation.navigate('InventoryModification')
                }}/>
        <Text style = {styles.header}> Add an Item </Text>
        <View style = {styles.cameraContainer}>
            { (photo === null) ? (
            <>
            <Camera style={styles.camera} type={type} 
            ref={ref =>{
                setCamera(ref);
            }}/>
            <Ionicons name="ios-photos" style={{ 
                color: "#fff", 
                fontSize: 50,
                backgroundColor: 'transparent',
                position: 'absolute',
                bottom: 5,
                left: screenWidth * .11
            }} onPress={()=>{
                pickImage();
            }}/>
            <FontAwesome name="circle" style={{ 
                color: "#fff", 
                fontSize: 50,
                backgroundColor: 'transparent',
                position: 'absolute',
                bottom: 5
            }} onPress={()=>{
                takePhoto();
            }}/>
            </>
            ) : ( 
            <>
                <Image style={styles.camera} source={{uri: photo}}
                PlaceholderContent={<ActivityIndicator />}
                ></Image>
                <FontAwesome name="times" style={
                    { color: "#fff", 
                    fontSize: 40,
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 5,
                    right: screenWidth * .09
                }} onPress={()=>{
                    setPhoto(null);
                }}/>
            </>
            )
            }
        </View>
        <View style={{flex:9, width: screenWidth * .8, alignSelf:'center'}}>
            <View style={styles.inputBlock}><Input 
                                            placeholder="Item Name" 
                                            onChangeText={value => setItemName(value)}
                                            errorMessage={nameErrorMessage}/></View>
            <View style={styles.inputBlock}><Input 
                                            placeholder="Cost"  
                                            onChangeText={value => {
                                                const regex : RegExp = /^\d+(?:\.?\d{0,2})$/;
                                                if (regex.test(value)){
                                                    setCost(Number(value));
                                                    setCostErrorMessage("");
                                                } else {
                                                    setCostErrorMessage("Enter a Valid Cost");
                                                }
                                            }}
                                            keyboardType="number-pad"
                                            errorMessage={costErrorMessage}
                                            ></Input></View>
            <View style={styles.inputBlock}><Input 
                                            placeholder="Quantity"
                                            onChangeText={value => {
                                                if (Number.isInteger(+value)){
                                                    setQuantity(+value);
                                                    setQuantityErrorMessage("");
                                                } else {
                                                    setQuantityErrorMessage("Enter a Valid Quantity");
                                                }
                                            }}
                                            keyboardType="numeric"
                                            errorMessage={quantityErrorMessage}></Input></View>
            <View style={styles.inputBlock}>
                <TouchableOpacity style={styles.button}  onPress={()=>submitItem()}>
                    <Text style={styles.buttonText}> Add Item</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    </>
	);
};

const styles = StyleSheet.create({
    header:{
        top: 45, 
        fontSize: 40,
        fontWeight: "bold",
        flex:3,
        alignSelf: 'center'
    },
    cameraContainer:{
        flex: 13,
        alignItems: 'center',
        marginVertical: 15
    },
    inputBlock:{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    input:{
        borderColor: 'gray', 
        borderWidth: 1,
        width: screenWidth * .85,
        padding: 3
    },
    button: {
		backgroundColor: '#3399ff',
		borderRadius: 30,
		height: 50,
		textAlign: 'center',
		justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: screenWidth * 0.5,
	},
	buttonText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 20,
    },
    camera:{
        width: screenWidth * .85,
        alignSelf: 'center',
        flex: 1,
    },
});


export default AddItem;