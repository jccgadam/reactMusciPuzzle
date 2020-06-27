import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import helpers from './helpers'
import PuzzleContainerWrapper from './containers/PuzzleContainerWrapper';

function App() {
  const { init } = helpers;
  // console.log(helpers);
  // init();
  //   console.log(init());
  return (
    <div className=''>
       <PuzzleContainerWrapper/>
      {/*<Button onClick={()=>init()}>play</Button>*/}
    </div>
  );
}

export default App;
