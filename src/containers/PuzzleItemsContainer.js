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
import '../style/index.scss';

const colorList =['#CD5C5C','#F08080','#FA8072','#E9967A','#3D9970','#FF4136','#0074D9'];
const PuzzleItemsContainer  = class extends React.Component{
    constructor(){
        super();
        this.state = {
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

    reselectSound = ()=>{
        const { props } = this;
        const { resetState } = props;
        resetState();
    }

    renderSuccessModal = ()=>{
        const { generateShuffledIds,state,reselectSound } = this;
        const { shuffledIds } = state;
        const shuffleSameSoundTrack = ()=>{
               this.setState({
                   shuffledIds: generateShuffledIds(shuffledIds.length),
                   soundTrackOrdered: false,
                   showAns: false
               })
        }
        const okText='Click to play this song again.'
        const cancelText = 'Play another song.'
        return <Modal visible={true} wrapClassName={'successModal'}
                      okText={ okText }
                      cancelText={ cancelText }
                      onOk={()=>shuffleSameSoundTrack()}
                      onCancel={()=>reselectSound()}
                >
                Grats! You got the song right!
               </Modal>
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
                            className='row'
                        >
                            { _.map(shuffledIds,(item,i)=>
                                <Draggable key={i} draggableId={`item-${i}`} index={i} style={{ width:'20%' }}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}
                                             {...provided.draggableProps}
                                             {...provided.dragHandleProps}
                                        >
                                            <Col span={24} key={i}>
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
        const { handlePlaOriginTrackPlay,props } = this;
        const { playingItemId } = this.state;
        const { songName } = props;
        const btn = <Button onClick={()=>handlePlaOriginTrackPlay(sound)} className='playOriginButton'>
                    { playingItemId ? 'Stop' :'Play Origin' }
                    </Button>
        return <div className='headerWrapper'>
                    <span className='songName'>{ songName }</span>
                    {btn}
               </div>;

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
        const { renderItems,handleInit,state,setIsPlaying,setShowAns,renderSel,props,renderOriginTrack ,renderSuccessModal,reselectSound} = this;
        const { playing,showAns,playingItemId,soundTrackOrdered } = state;
        const { audioSprite,sound } = props;
        const len = Object.keys(audioSprite).length;
        const originTrack = _.filter(audioSprite,(k,v)=>v==='origin');
        const spriteTracks = _.filter(audioSprite,(k,v)=>v!=='origin');
        return <div className='outerDiv'>
                <Button type='primary' className='reslectButton' onClick={()=>reselectSound()}>Reselect Sound</Button>
                <div className='innerDiv'>
                    { renderOriginTrack(sound) }
                    { soundTrackOrdered&&renderSuccessModal() }
                    { renderItems(spriteTracks,len,setIsPlaying,playing,setShowAns,showAns) }
                    { !!len&&<Button className='showAnsButton' onClick={()=>setShowAns(!showAns)}>Show Ans</Button> }
                </div>
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
