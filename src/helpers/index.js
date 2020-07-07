
import _ from 'lodash';
import { Queue} from 'buckets-js';
import { Howl, Howler } from 'howler';

const generateSprite = (maxLen,cut)=>{
    let audioSprite = {};
    let id = '0';
    let duration = Math.floor(maxLen/cut);
    let startTime = 0;
    for(let i=0;i<cut;i++){
        let endTime = startTime + duration < maxLen ? startTime + duration : maxLen;
        duration = Math.min(duration,(endTime-startTime).toFixed(1));
        audioSprite['key'+id] = [
           startTime,duration
        ];
        startTime = endTime+1;
        id = parseInt(id)+1+'';
    }
    return audioSprite;
}
const loadSrcWrapper = (src,sprite=[])=>{
    return new Promise((resolve,reject) => {
        let sound = new Howl({ src: [src] ,preload:true, sprite,
            onload:(e)=>{
                resolve(sound);
            },
            onloaderror:(id,error)=>{
               reject(error)
            }
        });
    })
}


const playSoundByString = (str,sound)=>{
    if(str.length>1){
        sound._onend[0] = playSoundByString(str.substring(1,str.length),sound);
    } else {
        // sound._onend[0] = function(){};
    }
    if(str.length>0){
        sound.play('key'+str.substring(0,1));
        return 'key'+str.substring(0,1);
    }
};
const init = async (src)=>{
    let preloadSound = null;
    let sound = null;
    let sprite = null;
    try{
        preloadSound = await loadSrcWrapper(src);
        let maxLen = preloadSound.duration();
        sprite = (generateSprite(maxLen*1000,4));
        sound = await loadSrcWrapper(src,sprite);
    }catch (e){
        console.log(e);
    }
    // sound.sprite = audioSprite;
    // console.log(audioSprite);
    // await fileUploadWrapper();
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
    return {
        audioSprite:sprite,
        sound
    };
}


export default {
    init,
    playSoundByString
}
