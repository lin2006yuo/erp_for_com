<template>
    <div class="c-test">
        <!--<span v-autoload="downs"></span>-->
        <!--<button @click="c ? downs : down2">DOWNS</button>-->
        <!--<button @click="c = !c">DOWNS</button>-->
        <!--<div>-->
        <!--{{$t('message.hello')}}-->

        <!--</div>-->
        <!--<button @click="loadLang">LoadLang</button>-->
        <upload-img
                :images="images"
        :edit="true">

        </upload-img>
        <el-button type="primary" @click.native="test">test</el-button>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import uploadImg from '@/view/base/company-information/upload-img'
    import {api_get_channel,} from '@/api/company-info';
    export default {
        data() {
            return {
                images:[],
                arr:[]
            }
        },
        mounted() {
            Promise.all[this.init()]
        },
        methods: {
            init(){
                this.$http(api_get_channel).then(res=>{
                console.log(res,12213);
                      this.arr=res
                }).catch(({fail, error}) =>{
                   fail&&this.$message({type:'warning',message:fail});
                   error&&this.$message({type:'error', message:error});
                });
            },
            test(){
                console.log(this.images,'tetsllll');
            }
        },
        components: {
            uploadImg
        }
    }
</script>
