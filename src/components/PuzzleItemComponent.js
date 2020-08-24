import React from 'react';
import helpers from '../helpers'
import { Button,Card } from 'antd';
import 'antd/es/card/style/index.css';
import 'antd/es/button/style/index.css';
import 'antd/es/cascader/style/css.js';
import WaveSurfer from 'wavesurfer.js';

const PuzzleItemComponent = class extends React.Component{
    constructor(){
        super();
        // this.ref = null;

    }

    createSoundItem = (id,setIsPlaying)=>{

    }



    renderButton = (sound,id,playing,setIsPlaying,setPlayingItemId)=>{
       const play = ()=>{
            setIsPlaying(true);
            setPlayingItemId(id);
            let soundId = sound.play('key'+id);
            sound.on('end',()=>{
                setIsPlaying(false);
                setPlayingItemId(null);
            }, soundId);

       };

       const stop = ()=>{
           sound.stop();
           setIsPlaying(false);
           setPlayingItemId(null);
       };


       return <Button onClick={()=> { playing ? stop() : play() } }>{ !playing ? 'play': 'stop' }</Button>

    }

    render(){
        const { props,createSoundItem,renderButton } = this;
        const { id,setIsPlaying,playing,title,showAns,sound,setPlayingItemId,backgroundColor } = props;

        return <Card title={title+''} extra={showAns&&<div>Seq: {id}</div>} headStyle={{ backgroundColor }} className='soundItem'>
                { renderButton( sound,id,playing,setIsPlaying,setPlayingItemId )}
               </Card>
    }
}

export  default  PuzzleItemComponent;
