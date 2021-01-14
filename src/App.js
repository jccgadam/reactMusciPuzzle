import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import helpers from './helpers'
import PuzzleContainerWrapper from './containers/PuzzleContainerWrapper';
import Firebase, { FirebaseContext } from './components/Firebase';

function App() {
  const { init } = helpers;
  // console.log(helpers);
  // init();
  //   console.log(init());
  return (
    <div className=''>
        <FirebaseContext.Provider value={new Firebase()}>
            <PuzzleContainerWrapper/>
        </FirebaseContext.Provider>
    </div>
  );
}

export default App;
