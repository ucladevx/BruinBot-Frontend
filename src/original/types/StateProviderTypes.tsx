import { Dispatch } from 'react';
import { UserData } from './apiTypes';
import firebase from 'firebase';

interface SetUserAction {
	type: string;
	user: (FirebaseUser & UserData) | null;
}

interface SetEnterpriseAction {
	type: string;
	isEnterpriseMode: boolean;
}

// TODO: Put these types into another file
interface FirebaseUser {
	uid: string;
}

type Action = SetUserAction | SetEnterpriseAction;

interface State {
	firebase: typeof firebase;
	user: (FirebaseUser & UserData) | null;
	isEnterpriseMode: boolean;
}

interface StateAndDispatch {
	state: State;
	dispatch: Dispatch<Action>;
}

export { State, StateAndDispatch, Action, SetUserAction, SetEnterpriseAction };
