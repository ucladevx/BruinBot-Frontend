import firebase, { User } from 'firebase';
import { Dispatch } from 'react';

interface SetUserAction {
	type: string;
	user: User | null;
}

interface State {
	firebase: typeof firebase;
	user: User | null;
}
interface StateAndDispatch {
	state: State;
	dispatch: Dispatch<SetUserAction>;
}

export { State, StateAndDispatch, SetUserAction };
