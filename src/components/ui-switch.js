/**
 * Created by wuchuguang on 17-2-17.
 */

import Vue from 'vue';

export default {
    name:'ui-switch',
    extends:Vue.component('el-switch'),
    mounted(){
    },
    computed:{
        onText(){
            return this.textOn;
        },
        offText(){
            return this.textOff;
        }
    },
    props:{
        textOn:{
            type:String,
            default(){
                return 'ON';
            }
        },
        textOff:{
            type:String,
            default(){
                return 'OFF';
            }
        }
    }
};