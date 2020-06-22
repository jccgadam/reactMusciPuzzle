import React from 'react';
import helpers from '../helpers'
import { Button,Card } from 'antd';
import createjs from 'createjs-module';
import 'antd/es/card/style/index.css';
import 'antd/es/button/style/index.css';
import 'antd/es/cascader/style/index.css';
const { Sound } = createjs;

const PuzzleItemComponent = class extends React.Component{
    constructor(){
        super();
    }

    createSoundItem = (id,setIsPlaying)=>{
        let soundInstance = Sound.createInstance(id);
        soundInstance.on('complete',()=>{
            setIsPlaying(false);
        })
        return soundInstance;
    }

    render(){
        const { props,createSoundItem } = this;
        const { id,puzzleItem,setIsPlaying,playing } = props;
        const soundItem = createSoundItem(id,setIsPlaying);
        const play = ()=>{
            setIsPlaying(true);
            soundItem.play();
        }
        return <Card title={id+''}><button onClick={()=>play()} style={{ width: 300 }} disabled={playing}>play</button></Card>
    }
}

export  default  PuzzleItemComponent;
