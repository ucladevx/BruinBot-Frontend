import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'stretch',
	},
	logoContainer: {
		height: '40%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingBottom: 24,
	},
	formContainer: {
		height: '60%',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 24,
		paddingHorizontal: 24,
	},
	formButton: { width: '100%', borderRadius: 100, padding: 10 },
});

export { styles };
