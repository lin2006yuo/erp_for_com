<template>
    <div class="c-ui-progress mb-sm inline">
        <span class="c-name" style="width:120px;">{{selfNum}}<span v-if="percent">%</span></span>
        <el-progress :percentage="sizeNum" style="width:120px;" :show-text="showText"></el-progress>
    </div>
</template>
<style lang="stylus">
    .c-ui-progress{
        text-align: center;
        .c-name{
            display:block;
            text-align:center;
        }
    }
</style>
<script>

	export default{
		data(){
			return {}
		},
        methods:{

        },
        computed:{
            sizeNum(){
            	if(!this.selfNum){
            		return 0;
                }
                if(!this.maxNum){
                    return 0;
                }
                return (this.selfNum/this.maxNum)*100
            },
        },
        props:{
			maxNum:{
                required: true,
                type: Number,
            },
            selfNum:{
                required: true,
                type: Number,
            },
            showText:{
            	required: true,
                default(){
            		return true;
                }
            },
            percent:{
                default(){
                    return false;
                }
            }
        },
		components: {}
	}
</script>
