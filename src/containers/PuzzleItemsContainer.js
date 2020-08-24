import { Card,Button,Row,Col,Select,message,notification,Modal } from 'antd';
import PuzzleItemComponent from '../components/PuzzleItemComponent';
import React from 'react';
import helpers from "../helpers";
import _ from 'lodash';
import {Queue} from "buckets-js";
import 'antd/es/row/style/css.js';
import 'antd/es/col/style/css.js';
import 'antd/es/notification/style/css';
import 'antd/es/select/style/css';
import 'antd/es/message/style/css';
import 'antd/es/modal/style/css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../style/index.css';
import { Howl, Howler } from 'howler';
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
const colorList =['#CD5C5C','#F08080','#FA8072','#E9967A'];
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
            originPlaying: false,
            soundTrackOrdered:false

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
        let shuffledIds = this.generateShuffledIds(len-1);
        this.setState({
            shuffledIds
        })

    }

    generateShuffledIds = (length)=>{
        let arr = [];
        for (let i=0;i<length;i++) arr[i]=i;
        return _.shuffle(arr);
    }

    renderSuccessModal = ()=>{
        const { generateShuffledIds,state } = this;
        const { shuffledIds } = state;
        const shuffleSameSoundTrack = ()=>{
               this.setState({
                   shuffledIds: generateShuffledIds(shuffledIds.length),
                   soundTrackOrdered: false,
                   showAns: false
               })
        }
        return <Modal visible={true} wrapClassName={'successModal'} onOk={()=>shuffleSameSoundTrack()}></Modal>
    }
    onDragEnd = (res)=>{
        const startIndex = res.source.index;
        const endIndex = res.destination.index;
        const list = this.state.shuffledIds;
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        const soundTrackOrdered =  (helpers.isSorted(result));
        if(soundTrackOrdered) {
           this.setState({
               soundTrackOrdered
           })
        }
        this.setState({
            shuffledIds: result
        })
    }

    renderItems = (audioSprite,len,setIsPlaying,playing,setShowAns,showAns)=>{
        let span = Math.round(24/len);
        let { sound } = this.props;
        let { shuffledIds,playingItemId } = this.state;
        const { setPlayingItemId } = this;
        return <DragDropContext onDragEnd={ this.onDragEnd }>
                <Droppable droppableId="droppable" direction="horizontal" id='dropable' >
                {
                    (provided, snapshot) => {
                       return <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            { _.map(shuffledIds,(item,i)=>
                                <Draggable key={i} draggableId={`item-${i}`} index={i}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}
                                             {...provided.draggableProps}
                                             {...provided.dragHandleProps}
                                        >
                                            <Col spa={span} key={i}>
                                                <PuzzleItemComponent id={item}
                                                                     sprite={audioSprite[item]}
                                                                     sound={sound}
                                                                     key={i}
                                                                     backgroundColor={colorList[item]}
                                                                     title={i}
                                                                     puzzleItem={item}
                                                                     setIsPlaying={setIsPlaying}
                                                                     playing={playing}
                                                                     setShowAns={setShowAns}
                                                                     showAns={showAns}
                                                                     setPlayingItemId={setPlayingItemId}
                                                                     playingItemId={playingItemId}

                                                />
                                            </Col>
                                        </div>
                                    )}
                                </Draggable>
                            )
                            }
                           {provided.placeholder}
                       </div>
                }
                }
                </Droppable>
            </DragDropContext>
    }

    setShowAns = (showAns)=>{
        this.setState({
            showAns
        })
    }

    renderOriginTrack=(sound)=>{
        const { handlePlaOriginTrackPlay } = this;
        const { playingItemId } = this.state;
        return <Card title={'Origin Sound Track'}>
                <Button onClick={()=>handlePlaOriginTrackPlay(sound)}>{ playingItemId ? 'Stop' :'Play' }</Button>
               </Card>
    }

    handlePlaOriginTrackPlay=(sound)=>{
        const { playingItemId,playing } = this.state;
        if(playingItemId!=null) {
            sound.stop();
            this.setState({
                playingItemId: null,
                playing: false
            })
        }else{
            sound.play('origin');
            this.setState({
                playingItemId: 'origin',
                playing: true,
            })
        }

    }
    render(){
        const { renderItems,handleInit,state,setIsPlaying,setShowAns,renderSel,props,renderOriginTrack ,renderSuccessModal} = this;
        const { playing,showAns,playingItemId,soundTrackOrdered } = state;
        const { audioSprite,sound } = props;
        const len = Object.keys(audioSprite).length;
        const originTrack = _.filter(audioSprite,(k,v)=>v==='origin');
        const spriteTracks = _.filter(audioSprite,(k,v)=>v!=='origin');
        return <div>
                { renderOriginTrack(sound) }
                { soundTrackOrdered&&renderSuccessModal() }
                { renderItems(spriteTracks,len,setIsPlaying,playing,setShowAns,showAns) }
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
