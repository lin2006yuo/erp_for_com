/**
 * Created by wuchuguang on 16-11-17.
 */

export default {
    props:{
        row:{},
        col:{},
        span:{
            required:true,
            type:Number
        }
    },
    render(h){
        return (
            <el-col class="gen-page-col" span={this.span} nativeOn-click={()=>{this.$emit('click',this.row,this.col)}}>{
                this.$slots.default
            }</el-col>
        )
    }
};
