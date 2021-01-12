import { Dispatch } from 'react';
import { UserData } from './apiTypes';
import firebase from 'firebase';

interface SetUserAction {
	type: string;
	user: (FirebaseUser & UserData) | null;
}

// TODO: Put these types into another file
interface FirebaseUser {
	uid: string;
}

type Action = SetUserAction;

interface State {
	firebase: typeof firebase;
	user: (FirebaseUser & UserData) | null;
}

interface StateAndDispatch {
	state: State;
	dispatch: Dispatch<Action>;
}

export { State, StateAndDispatch, Action, SetUserAction };
