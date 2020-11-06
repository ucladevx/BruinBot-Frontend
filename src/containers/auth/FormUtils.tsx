import { FirebaseError } from 'firebase';

// Handles error codes that may be returned from Firebase Auth calls
function handleAuthErrors(error: FirebaseError) {
	switch (error.code) {
		case 'auth/user-disabled':
			return {
				email: 'The user corresponding to the provided email has been disabled',
				password: '',
			};
		case 'auth/user-not-found':
			return {
				email: 'There is no user corresponding to the provided email',
				password: '',
			};
		case 'auth/wrong-password':
			return { email: '', password: 'The provided password is incorrect' };
		case 'auth/email-already-in-use':
			return { email: 'The provided email is already in use', password: '' };
		case 'auth/invalid-email':
			return { email: 'The provided email is invalid', password: '' };
		case 'auth/weak-password':
			return { email: '', password: 'The provided pasword is too weak' };
		default:
			throw 'Invalid Firebase Auth code!';
	}
}

export { handleAuthErrors };
