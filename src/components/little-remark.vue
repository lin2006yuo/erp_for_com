<template>
    <div class="c-little-remark remark-box2" :style="userDefined">
        <label class="remark-header">{{label}}</label>
        <el-form class="remark-body">
            <el-form-item>
                <el-input type="textarea" v-model="note" :maxlength="maxlength" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
            </el-form-item>
        </el-form>
        <div class="fixed-button">
            <div class="fr">
                <button class="small-button submit" type="button" @click="submit(note)">提交</button>
                <button class="small-button cancel" type="button" @click="cancel(note)">取消</button>
            </div>
        </div>
    </div>
</template>
<style lang="stylus">
    .remark-box2{
        overflow-y: auto;
        border:1px solid #ddd;
        border-radius: 5px;
        background: #fff;
        z-index:999;
        .remark-header{
            position: absolute;
            top:0;
            left:0;
            right:5px;
            height:25px;
            padding-top:5px;
            padding-left:10px;
            background-color: #fff;
        }
        .remark-body{
            position: absolute;
            top:30px;
            left:0;
            right:0;
            bottom:30px;
            padding:0 5px;
            overflow-y:auto;
        }
        .fixed-button{
            position: absolute;
            left:0;
            right:5px;
            height:25px;
            bottom:0;
            padding-bottom:5px;
            background-color: #fff;
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                note:"",
            }
        },
        computed:{
            userDefined(val){
                return {
                    position:"absolute",
                    top:this.top||"0px",
                    right:this.right||"0px",
                    width:this.width || "190px",
                    height:this.height || "160px",
                }
            }
        },
        methods:{
            remark_body(){

            },
            submit(val){
                this.$emit("submit",val);
            },
            cancel(){
                this.note = '';
                this.$emit("cancel");
            }
        },
        props:{
            top:{   
                type:String,
            },
            right:{
                type:String,
            },
            width:{
                type:String
            },
            height:{
                type:String
            },
            label:{
                type:String,
            },
            maxlength:{
                type:Number
            }
        },
        components: {

        }
    }
</script>
