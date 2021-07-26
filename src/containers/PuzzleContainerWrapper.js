import React from 'react';
import _ from 'lodash';

import PuzzleItemsContainer from '../containers/PuzzleItemsContainer';
import {Select,Row,Button} from "antd/lib/index";
import helpers from "../helpers";
const songSrc = [
                    {
                        key:'easy',
                        value:'https://muscipuzzlesongs.s3.amazonaws.com/miss+you-34s.mp3',
                        songName:'Miss You'
                    },
                    {   key:'normal',
                        value:'https://muscipuzzlesongs.s3.amazonaws.com/for+alice-30.mp3',
                        songName: 'For Alice'
                    },
                    {
                        key:'normal2',
                        value:'https://muscipuzzlesongs.s3.amazonaws.com/lost_love_35s.mp3',
                        songName:'Lost Love'
                    }
                ];

const { Option } = Select;
const initState = {
        started: false,
        songURL: songSrc[0].value,
        maxLen: songSrc[0].maxLen,
        songName:songSrc[0].songName,
        sound:null,
        cut:4,
        audioSprite:[],
}
const PuzzleContainerWrapper = class extends React.Component{
    constructor(props){
        super(props);
        this.state = initState;
    }
    resetState = ()=>{
        this.setState(initState);
    }
    handleChangeSel = (songURL,v)=>{
        const { maxlen,songname } = v;
        this.setState({
            songURL,
            maxLen: maxlen,
            songName: songname
        })
    }
    handleCutSel = (cut)=>{
        this.setState({
            cut
        })
    }
    renderSel = ()=>{
        const { handleChangeSel } = this;
        return <Select style={{ width: '100px' }} onChange={handleChangeSel} defaultValue={songSrc[0].value}>
            {
                _.map(songSrc,({key,value,maxLen,songName},i)=>{
                    return <Option value={value} key={i} maxlen={maxLen} songname={songName}>{key}</Option>
                })
            }
        </Select>
    }

    renderCutSel = ()=>{
        const { handleCutSel } = this;
        return <Select style={{ width: '100px' }} onChange={handleCutSel} defaultValue={4}>
            {
                _.map([4,5,6,7],value=>{
                    return <Option value={value}>{value}</Option>
                })
            }
        </Select>
    }

    handleInit = async  (songURL,cut)=>{
        const { init } = helpers;
        const { sound,audioSprite} = await init(songURL,cut);
        this.setState({
            audioSprite,
            sound,
            started: true
        })
    }

    render(){
        const { handleInit,state,renderSel,handleSoundUpdate,resetState,renderCutSel } = this;
        const { audioSprite,started,songURL,maxLen,sound,songName,cut } = state;
        return <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100vh'}}>
                    {/*{ started&&<Button type='primary' onClick={()=>resetState()}>Reselect Sound</Button>}*/}
                    <Row style={{ marginTop: 10 }}>
                        { !started&&renderSel() }
                        { !started&&renderCutSel() }
                        { !started && <Button onClick={()=>handleInit(songURL,cut)}>Start Game</Button> }
                        { started&&<PuzzleItemsContainer audioSprite={audioSprite} sound={sound}
                                                         resetState={resetState}
                                                         songName={songName}
                                                         songURL={songURL} handleSoundUpdate={handleSoundUpdate}/> }
                    </Row>
               </div>
    }
}

export default PuzzleContainerWrapper;
