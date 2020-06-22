import { Card,Button } from 'antd';
import PuzzleItemComponent from '../components/PuzzleItemComponent';
import React from 'react';
import helpers from "../helpers";
import _ from 'lodash';

const PuzzleItemsContainer  = class extends React.Component{
    constructor(){
        super();
        this.state = {
            audioSprite:[]
        }
    }
    handleInit = ()=>{
        const { init } = helpers;
        const audioSprite = init();
        this.setState({
            audioSprite
        })
    }
    renderItems = ()=>{
        const { state } = this;
        const { audioSprite } = state;
        return _.map(audioSprite,i=><PuzzleItemComponent/>);
    }
    render(){
        const { renderItems,handleInit } = this;
        return <div>
            { renderItems() }
            <Button onClick={()=>handleInit}>Init</Button>
        </div>
    }
}


export default PuzzleItemsContainer;
