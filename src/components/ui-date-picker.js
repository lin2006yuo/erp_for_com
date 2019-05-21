/**
 * Created by wuchuguang on 17-1-18.
 */

import Vue from 'vue';

export default {
    name:'ui-date-picker',
    extends:Vue.component('ElDatePicker'),
    computed:{
        visualValue:{
            get(){
                let visual = this.$options.mixins[0].computed.visualValue;
                if(this.format){
                    switch (typeof this.format){
                        case 'function':
                            return this.format.call(this, this.internalValue);
                        default:
                            return visual.get.call(this);
                    }
                }else{
                    return visual.get.call(this);
                }
            },
            set(val){
                let visual = this.$options.mixins[0].computed.visualValue;
                if(this.format){
                    switch (typeof this.format){
                        case 'function':
                            return this.format.call(this, val);
                        default:
                            return visual.set.call(this, val);
                    }
                }else{
                    return visual.set.call(this, val);
                }
            }
        }
    },
    watch:{
        type(val){
            this.$options.created.forEach(created=>{
                created.call(this);
            });
        }
    },
    props:{
        format:{
            required:false,
            type:[String, Function]
        },
        type:{
            required:true,
            type:String,
            default(){
                return 'date'
            }
        }
    }
};