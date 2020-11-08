import firebase from 'firebase';
import React, { useEffect, useReducer } from 'react';
import { SetUserAction, State, StateAndDispatch } from './StateProviderTypes';

const firebaseConfig = {
  apiKey: 'AIzaSyAcnkdEHyVz37TMFt7tj-_6KnOL3f7l9Bw',
  authDomain: 'bruinbot-8d68e.firebaseapp.com',
  databaseURL: 'https://bruinbot-8d68e.firebaseio.com',
  projectId: 'bruinbot-8d68e',
  storageBucket: 'bruinbot-8d68e.appspot.com',
  messagingSenderId: '925978645479',
  appId: '1:925978645479:web:5aa6b096d01bf1d4596342'
};
firebase.initializeApp(firebaseConfig);

const initialState: State = { firebase, user: null };
const Ctx = React.createContext<StateAndDispatch>(undefined!);

const StateProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(
    (state: State, action: SetUserAction): State => {
      // write actions here
      if (action.type === 'SET_USER') {
        return {
          ...state,
          user: action.user
        };
      }
      return state;
    },
    initialState
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      dispatch({ type: 'SET_USER', user });
    });
  }, []);
  return (
    <Ctx.Provider value={{ state, dispatch }}>{props.children}</Ctx.Provider>
  );
};

export { Ctx, StateProvider };
