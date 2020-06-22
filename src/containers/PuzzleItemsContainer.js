import { Card,Button,Row,Col } from 'antd';
import PuzzleItemComponent from '../components/PuzzleItemComponent';
import React from 'react';
import helpers from "../helpers";
import _ from 'lodash';
import {Queue} from "buckets-js";
import createjs from 'createjs-module';
import 'antd/es/row/style/css.js';
import 'antd/es/col/style/css.js';

const PuzzleItemsContainer  = class extends React.Component{
    constructor(){
        super();
        this.state = {
            audioSprite:[],
            started: false,
            playing:false,
            audioQueue: null,
            showAns: false
        }
    }
    handleInit = async  ()=>{
        const { init } = helpers;
        const audioSprite = _.shuffle(await init());
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
        const { renderItems,handleInit,state,setIsPlaying,setShowAns } = this;
        const { audioSprite,playing,showAns,started } = state;
        const len = audioSprite.length;
        return <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100vh'}}>
                { renderItems(audioSprite,len,setIsPlaying,playing,setShowAns,showAns) }
                <Row style={{ marginTop: 10 }}>
                    { !started && <Button onClick={()=>handleInit()}>Start Game</Button> }
                    { !!len&&<Button onClick={()=>setShowAns(true)}>Show Ans</Button> }
                </Row>
        </div>
    }
}


export default PuzzleItemsContainer;
