import { Card,Button,Row,Col,Select } from 'antd';
import PuzzleItemComponent from '../components/PuzzleItemComponent';
import React from 'react';
import helpers from "../helpers";
import _ from 'lodash';
import {Queue} from "buckets-js";
import 'antd/es/row/style/css.js';
import 'antd/es/col/style/css.js';
import 'antd/es/select/style/css';
import vconsole from 'vconsole';
import WaveSurfer from "wavesurfer.js";

// let v = new vconsole();
// const songSrc = [
//                     {
//                         key:'easy',
//                         value:'https://muscipuzzlesongs.s3.amazonaws.com/miss+you-34s.mp3',
//                         maxLen: 33*1000
//                     },
//                     {   key:'normal',
//                         value:'https://muscipuzzlesongs.s3.amazonaws.com/for+alice-30.mp3',
//                         maxLen: 30*1000
//                     }
//                 ];
// const { Option } = Select;
const PuzzleItemsContainer  = class extends React.Component{
    constructor(){
        super();
        this.state = {
            // sound:null,
            // audioSprite:[],
            started: false,
            playing:false,
            audioQueue: null,
            showAns: false,
            shuffledIds:[],
            playingItemId: null,

        }
        this.ref = null;

    }

    setPlayingItemId = (playingItemId)=>{
        this.setState({
            playingItemId
        })
    }
    // handleChangeSel = (songURL,v)=>{
    //     const { maxlen } = v;
    //     this.setState({
    //         songURL,
    //         maxLen:maxlen
    //     })
    // }

    // renderSel = ()=>{
    //     const { handleChangeSel } = this;
    //     return     <Select style={{ width: 120 }} onChange={handleChangeSel} style={{ width: '100px' }} defaultValue={songSrc[0].value}>
    //                     {
    //                         _.map(songSrc,({key,value,maxLen},i)=>{
    //                             return <Option value={value} key={i} maxlen={maxLen} >{key}</Option>
    //                         })
    //                     }
    //                </Select>
    //
    // }

    // handleInit = async  (songURL)=>{
    //     const { init } = helpers;
    //     const { sound,audioSprite} = await init(songURL);
    //     this.setState({
    //         audioSprite,
    //         sound,
    //         started: true
    //     })
    // }

    // componentDidMount(){
    //     let ref = this.ref;
    //     let wavesurfer = WaveSurfer.create({
    //         container: ref
    //     });
    //     this.setState({
    //         wavesurfer,
    //     })
    // }

    setIsPlaying = (playing)=>{
        this.setState({
            playing
        })
    }

    componentDidMount(){
        const { setIsPlaying,setPlayingItemId} = this;
        const { audioSprite,songURL,sound,handleSoundUpdate } = this.props;
        const len = Object.keys(audioSprite).length;
        let shuffledIds = this.generateShuffledIds(len);
        // handleSoundUpdate(setIsPlaying,setPlayingItemId,[false,null]);
        // wavesurfer.load(songURL);
        // wavesurfer.on('ready',()=>{
        //     wavesurfer.play();
        // });
        // wavesurfer.on('error',(e)=>{
        //     console.log(e);
        this.setState({
            shuffledIds
        })

    }

    generateShuffledIds = (length)=>{
        let arr = [];
        for (let i=0;i<length;i++) arr[i]=i;
        return _.shuffle(arr);
    }

    renderItems = (audioSprite,len,setIsPlaying,playing,setShowAns,showAns)=>{
        let span = Math.round(24/len);
        let { sound } = this.props;
        let { shuffledIds,playingItemId } = this.state;
        const { setPlayingItemId } = this;
        return <Row>
                { _.map(shuffledIds,(item,i)=>
                    <Col spa={span} key={i}>
                        <PuzzleItemComponent id={item}
                                             sprite={audioSprite[item]}
                                             sound={sound}
                                             key={i}
                                             title={i}
                                             puzzleItem={item}
                                             setIsPlaying={setIsPlaying}
                                             playing={playing}
                                             setShowAns={setShowAns}
                                             showAns={showAns}
                                             setPlayingItemId = { setPlayingItemId }
                                             playingItemId={playingItemId}

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

    renderWaveSurf = ()=>{
        const { audioSprite,songURL } = this.props;
        const { wavesurfer,playingItemId } = this.state;
        const audio =  audioSprite[playingItemId];
        // wavesurfer.load(songURL);
        // console.log(audio);
        // wavesurfer.on('ready',()=>{
        //     wavesurfer.setMute();
        //     wavesurfer.play(audio[0]/1000,audio[1]/1000);
        // })
    }


    render(){
        const { renderItems,handleInit,state,setIsPlaying,setShowAns,renderSel,props } = this;
        const { playing,showAns,playingItemId } = state;
        const { audioSprite } = props;
        const len = Object.keys(audioSprite).length;

        return <div>
                { renderItems(audioSprite,len,setIsPlaying,playing,setShowAns,showAns) }
                { !!len&&<Button onClick={()=>setShowAns(true)}>Show Ans</Button> }
               </div>

        // return <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100vh'}}>
        //         { renderItems(audioSprite,len,setIsPlaying,playing,setShowAns,showAns) }
        //         <Row style={{ marginTop: 10 }}>
        //             { !started&&renderSel() }
        //             { !started && <Button onClick={()=>handleInit(songURL,maxLen)}>Start Game</Button> }
        //             { !!len&&<Button onClick={()=>setShowAns(true)}>Show Ans</Button> }
        //         </Row>
        //         </div>
    }
}


export default PuzzleItemsContainer;
