import { FirebaseError } from 'firebase';
import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Ctx } from '../components/StateProvider';


// TODO: Don't use `any`
const BlankScreen = (props: any) => {
	const {state} = useContext(Ctx);
	return (
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			<Text>User is logged in as: {state.user?.email}</Text>
			<Button
				title="Log out"
				buttonStyle={{ width: 128 }}
				containerStyle={{ marginBottom: 16 }}
				onPress={() => {
					state.firebase.auth().signOut().catch(function (_error: FirebaseError) {
						// TODO: Handle error codes
						console.log(_error.message);
					});
					props.navigation.navigate('Login');
				}}
			/>
		</View>
		
	);
};

export default BlankScreen;