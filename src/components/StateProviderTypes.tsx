import firebase, { User } from 'firebase';
import { Dispatch } from 'react';

interface SetUserAction {
	type: string;
	user: User | null;
}

// Add more fields later
interface Bot {
	_id: string;
}

interface SetBotAction {
	type: string;
	bot: Bot | null;
}

type Action = SetUserAction | SetBotAction;

interface State {
	firebase: typeof firebase;
	user: User | null;
	bot: Bot | null;
}
interface StateAndDispatch {
	state: State;
	dispatch: Dispatch<Action>;
}

export { State, StateAndDispatch, Action, SetUserAction, SetBotAction };
