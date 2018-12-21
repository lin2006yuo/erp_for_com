/**
 * Created by wuchuguang on 17-5-10.
 */

let pageLink =  {
    data(){
        return {}
    },
    methods:{
        golink(){
            this.$open(this.link, this.param || {});
        }
    },
    props:{
        link:{
            required:true,
            type:String
        },
        param:{
            type:Object
        }
    },
    render(h){
        return <span class="operate" on-click={this.golink}>{this.$slots.default}</span>
    }
};
import Vue from 'vue';

Vue.component('page-link', pageLink);