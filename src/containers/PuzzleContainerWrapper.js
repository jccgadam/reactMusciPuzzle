import React from 'react';
import _ from 'lodash';
import { ReactS3Client,S3ClientObj,ListObjects } from '../config/index';
import PuzzleItemsContainer from '../containers/PuzzleItemsContainer';
import {Select,Row,Button} from "antd/lib/index";
import helpers from "../helpers";
import { message } from 'antd';
// const songSrc = [
//                     {
//                         key:'easy',
//                         value:'https://muscipuzzlesongs.s3.amazonaws.com/miss+you-34s.mp3',
//                         songName:'Miss You'
//                     },
//                     {   key:'normal',
//                         value:'https://muscipuzzlesongs.s3.amazonaws.com/for+alice-30.mp3',
//                         songName: 'For Alice'
//                     },
//                     {
//                         key:'normal2',
//                         value:'https://muscipuzzlesongs.s3.amazonaws.com/lost_love_35s.mp3',
//                         songName:'Lost Love'
//                     }
//                 ];

const { Option } = Select;
const initState = {
        started: false,
        songURL: '',
        maxLen:'',
        songName:'',
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
    componentDidMount() {
        // S3ClientObj
        const command =  new ListObjects({ Bucket:'muscipuzzlesongs'});
        S3ClientObj.send(command).then(response=>{
            const { Contents } = response;
            this.setState({
                songSrc:_.map(Contents,s=>({
                    key:s.Key,
                    value:`https://muscipuzzlesongs.s3.amazonaws.com/${s.Key}`,
                    songName:s.Key
                }))
            })
        });
        // const { Contents } = response;
        // this.setState({
        //     songSrc:_.map(Contents,s=>({
        //         key:s.Key,
        //         value:`https://muscipuzzlesongs.s3.amazonaws.com/${s.Key}`,
        //         songName:s.Key
        //     }))
        // })
    }

    renderSel = ()=>{
        const { handleChangeSel } = this;
        const { songSrc=[{value:''}] } = this.state;
        return <Select style={{ width: '200px' }} onChange={handleChangeSel}>
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
            started: true,

        })
    }
    onFileChange = (event)=>{
        this.setState({
            file:event.target.files[0]
        })
    }

    upload = ()=>{
        const { file } = this.state;
        ReactS3Client.uploadFile(file,file.name)
            .then(res=>message.info(`${file.name} is uploaded!`))
            .catch(error=>console.log(error))
    }

    render(){
        const { handleInit,state,renderSel,handleSoundUpdate,resetState,renderCutSel } = this;
        const { audioSprite,started,songURL,maxLen,sound,songName,cut } = state;
        return <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100vh'}}>
                    <Row style={{ marginTop: 10 }}  style={{ flexDirection:'column' }}>
                        <div>
                            { !started&&renderSel() }
                            { !started&&renderCutSel() }
                            { !started && <Button onClick={()=>handleInit(songURL,cut)} disabled={ !songURL }>Start Game</Button> }
                            { started&&<PuzzleItemsContainer audioSprite={audioSprite} sound={sound}
                                                             resetState={resetState}
                                                             songName={songName}
                                                             songURL={songURL} handleSoundUpdate={handleSoundUpdate}/> }
                        </div>
                        { !started &&
                            <div style={{ marginTop: 300 }}>
                                <input type="file" accept='.mp3' onChange={this.onFileChange}/>
                                <button onClick={this.upload}>Upload</button>
                            </div>
                        }
                    </Row>

               </div>
    }
}

export default PuzzleContainerWrapper;
