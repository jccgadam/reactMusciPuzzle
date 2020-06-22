import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import helpers from './helpers'
import PuzzleItemsContainer from './containers/PuzzleItemsContainer';

function App() {
  const { init } = helpers;
  // console.log(helpers);
  // init();
  //   console.log(init());
  return (
    <div className=''>
       <PuzzleItemsContainer/>
      {/*<Button onClick={()=>init()}>play</Button>*/}
    </div>
  );
}

export default App;
