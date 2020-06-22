import { Card,Button,Row,Col,Select } from 'antd';
import PuzzleItemComponent from '../components/PuzzleItemComponent';
import React from 'react';
import helpers from "../helpers";
import _ from 'lodash';
import {Queue} from "buckets-js";
import createjs from 'createjs-module';
import 'antd/es/row/style/css.js';
import 'antd/es/col/style/css.js';
import 'antd/es/select/style/css';
import vconsole from 'vconsole';

let v = new vconsole();
const songSrc = [
                    {
                        key:'easy',
                        value:'https://muscipuzzlesongs.s3.amazonaws.com/miss+you-34s.mp3',
                        maxLen: 33*1000
                    },
                    {   key:'normal',
                        value:'https://muscipuzzlesongs.s3.amazonaws.com/for+alice-30.mp3',
                        maxLen: 30*1000
                    }
                ];
const { Option } = Select;
const PuzzleItemsContainer  = class extends React.Component{
    constructor(){
        super();
        this.state = {
            audioSprite:[],
            started: false,
            playing:false,
            audioQueue: null,
            showAns: false,
            songURL: songSrc[0].value,
            maxLen: songSrc[0].maxLen
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
        return     <Select style={{ width: 120 }} onChange={handleChangeSel} style={{ width: '100px' }} defaultValue={songSrc[0].value}>
                        {
                            _.map(songSrc,({key,value,maxLen},i)=>{
                                return <Option value={value} key={i} maxlen={maxLen} >{key}</Option>
                            })
                        }
                   </Select>

    }

    handleInit = async  (songURL,maxLen)=>{
        const { init } = helpers;
        const audioSprite = _.shuffle(await init(songURL,maxLen));
        this.setState({
            audioSprite,
            started: true
        })
    }

    parseItems = ()=>{
        const { state } = this;
        const { audioSprite } = state;
        let tmpSound = null;
        let header = null;
        let myQueue = new Queue();
        for(let i=0;i<audioSprite.length;i++){
            let cur = audioSprite[i];
            let { id } = cur;
            try{
                if(tmpSound!=null){
                    tmpSound.on('complete',()=>{
                        try{
                            if(myQueue.peek()){
                               myQueue.dequeue().play();
                            }
                        }catch(e){
                            console.log(e);
                        }
                    })
                }
                tmpSound = createjs.Sound.createInstance(id);
                if(i!='0'){
                    myQueue.enqueue(tmpSound);
                }
                if(i==0){
                    header = tmpSound;
                }
            }
            catch(e){
                console.log(e);
            }
        }
    };


    setIsPlaying = (playing)=>{
        this.setState({
            playing
        })
    }

    renderItems = (audioSprite,len,setIsPlaying,playing,setShowAns,showAns)=>{
        let span = Math.round(24/len);
        return <Row>
                { _.map(audioSprite,(item,i)=>
                    <Col spa={span} key={i}>
                        <PuzzleItemComponent id={item.id}
                                             key={i}
                                             title={i}
                                             puzzleItem={item}
                                             setIsPlaying={setIsPlaying}
                                             playing={playing}
                                             setShowAns={setShowAns}
                                             showAns={showAns}
                        />
                    </Col>)
                }
               </Row>
    }

    setShowAns = (showAns)=>{
        this.setState({
            showAns
        })
    }



    render(){
        const { renderItems,handleInit,state,setIsPlaying,setShowAns,renderSel } = this;
        const { audioSprite,playing,showAns,started,songURL,maxLen } = state;
        const len = audioSprite.length;

        return <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100vh'}}>
                { renderItems(audioSprite,len,setIsPlaying,playing,setShowAns,showAns) }
                <Row style={{ marginTop: 10 }}>
                    { !started&&renderSel() }
                    { !started && <Button onClick={()=>handleInit(songURL,maxLen)}>Start Game</Button> }
                    { !!len&&<Button onClick={()=>setShowAns(true)}>Show Ans</Button> }
                </Row>
        </div>
    }
}


export default PuzzleItemsContainer;
