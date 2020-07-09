import React from 'react';
import _ from 'lodash';

import PuzzleItemsContainer from '../containers/PuzzleItemsContainer';
import {Select,Row,Button} from "antd/lib/index";
import helpers from "../helpers";
const songSrc = [
                    {
                        key:'easy',
                        value:'https://muscipuzzlesongs.s3.amazonaws.com/miss+you-34s.mp3',
                    },
                    {   key:'normal',
                        value:'https://muscipuzzlesongs.s3.amazonaws.com/for+alice-30.mp3',
                    }
                ];

const { Option } = Select;
const PuzzleContainerWrapper = class extends React.Component{
    constructor(){
        super();
        this.state = {
            isInited: false,
            songURL: songSrc[0].value,
            maxLen: songSrc[0].maxLen,
            sound:null,
            audioSprite:[],

        }
    }

    handleChangeSel = (songURL,v)=>{
        const { maxlen } = v;
        this.setState({
            songURL,
            maxLen:maxlen
        })
    }

    renderSel = ()=>{
        const { handleChangeSel } = this;
        return <Select style={{ width: '100px' }} onChange={handleChangeSel} defaultValue={songSrc[0].value}>
            {
                _.map(songSrc,({key,value,maxLen},i)=>{
                    return <Option value={value} key={i} maxlen={maxLen} >{key}</Option>
                })
            }
        </Select>
    }

    handleInit = async  (songURL)=>{
        const { init } = helpers;
        const { sound,audioSprite} = await init(songURL);
        this.setState({
            audioSprite,
            sound,
            started: true
        })
    }

    render(){
        const { handleInit,state,renderSel,handleSoundUpdate } = this;
        const { audioSprite,started,songURL,maxLen,sound } = state;
        return <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100vh'}}>
                    <Row style={{ marginTop: 10 }}>
                        { !started&&renderSel() }
                        { !started && <Button onClick={()=>handleInit(songURL,maxLen)}>Start Game</Button> }
                        { started&&<PuzzleItemsContainer audioSprite={audioSprite} sound={sound}
                                                         songURL={songURL} handleSoundUpdate={handleSoundUpdate}/> }
                    </Row>
               </div>
    }


}

export default PuzzleContainerWrapper;
