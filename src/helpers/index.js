// import createjs from 'createjs';

import _ from 'lodash';
import { Queue} from 'buckets-js';
import createjs from 'createjs-module';

let { Sound } = createjs;

/*
const playMusic = (id)=>{
    Sound.removeAllSounds();
    let src = songSrc;
    // const audioSprite = shuffle(generateSprite(10000,4));
    // console.log(shuffle(audioSprite));
    let sounds = { src,id };
    Sound.registerPlugins([createjs.HTMLAudioPlugin]);
    Sound.registerSound(sounds);
    createjs.Sound.on("fileload", ()=>{
        Sound.play(id);
    });
}*/

const generateSprite = (maxLen,cut)=>{
    let audioSprite = [];
    let id = '0';
    let duration = Math.floor(maxLen/cut);
    let startTime = 0;
    for(let i=0;i<cut;i++){
        let endTime = startTime + duration < maxLen ? startTime + duration : maxLen;
        audioSprite.push({
            id,startTime,endTime,duration
        });
        startTime = endTime+1;
        id = parseInt(id)+1+'';
    }
    return audioSprite;
}
const fileUploadWrapper = ()=>{
    return new Promise(resolve =>{
        Sound.on("fileload", (e)=>{
            console.log('file has uploaded');
                resolve();
        })
    })
}
const init = async (src,maxLen)=>{
    console.log(src,maxLen)
    // let src = songSrc;
    const audioSprite = (generateSprite(maxLen,4));
    let sounds = [{ src, data: { audioSprite }} ];
    Sound.registerPlugins([createjs.HTMLAudioPlugin,createjs.WebAudioPlugin]);
    Sound.registerSounds(sounds);
    let tmpSound = null;
    let header = null;
    let myQueue = new Queue();
    await fileUploadWrapper();
    //     for(let i=0;i<audioSprite.length;i++){
    //         let cur = audioSprite[i];
    //         let { id } = cur;
    //         try{
    //             if(tmpSound!=null){
    //                 tmpSound.on('complete',()=>{
    //                     try{
    //                         if(myQueue.peek()){
    //                            myQueue.dequeue().play();
    //                         }
    //                     }catch(e){
    //                         console.log(e);
    //                     }
    //                 })
    //             }
    //             tmpSound = createjs.Sound.createInstance(id);
    //             if(i!='0'){
    //                 myQueue.enqueue(tmpSound);
    //             }
    //             if(i==0){
    //                 header = tmpSound;
    //             }
    //         }
    //         catch(e){
    //             console.log(e);
    //         }
    //     }
    //     header.play();
    // }, this);
    return audioSprite;
}


export default {
    // playMusic,
    // generateSprite,
    init
}
