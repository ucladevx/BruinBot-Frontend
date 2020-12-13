import firebase from 'firebase';
import { Dispatch } from 'react';
import { UserData } from './apiTypes';

interface SetUserAction {
	type: string;
	user: (FirebaseUser & UserData) | null;
}

// TODO: Put these types into another file
interface FirebaseUser {
	uid: string;
}

// TODO: Add more fields later, or consolidate this
interface Bot {
	_id: string;
}

interface SetBotAction {
	type: string;
	bot: Bot;
}

type Action = SetUserAction | SetBotAction;

interface State {
	firebase: typeof firebase;
	user: (FirebaseUser & UserData) | null;
	bot: Bot | null;
}

interface StateAndDispatch {
	state: State;
	dispatch: Dispatch<Action>;
}

export { State, StateAndDispatch, Action, SetUserAction, SetBotAction };
