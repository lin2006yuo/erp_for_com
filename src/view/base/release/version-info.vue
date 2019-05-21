<template>
    <el-dialog :visible.sync="show" class="version-info"
                 :title="`版本更新 (已读： ${readCount}，版本总数： ${allCount})`"
                 size="small">
        <label-panel v-if="versions.length > 0" v-for="version in versions"
                     :key="version.release_time"
        >
            <div slot="label" @click="look(version)">
                {{version.release_time | fmsdatetime}}
                <span v-if="version.read" class="btn">已读</span>
                <span v-else class="btn">未读</span>
                <span :class="{'text-color':version.type===1}">{{version.type|typeName}}</span>
            </div>
            <ul>
                <li v-for="item in split(version.items, 3)"
                    :key="item.desc"
                    class="inline"
                    style="width:33%"
                >
                    类型：
                    <el-tag size="mini" :type="item.type | type">
                        {{item.type | stypeName}}</el-tag>
                    <span>描述：{{item.desc}}</span>
                    <span>开发者：{{item.dev_authors}}</span>
                </li>
                <li class="inline"
                style="width:33%" v-if="version.items.length>3">...</li>
            </ul>
        </label-panel>
        <div class="not-version" v-else>
            没有找到版本信息
        </div>
        <div class="mb-lg"></div>
        <version-info-detail v-model="showDetail" :version="version"></version-info-detail>
    </el-dialog>
</template>
<style lang="stylus">
    .version-info{
        .text-color{
            color:red
        }
        .btn{
            padding:0 5px;
        }
        .not-version{
            display: inline-block;
            width: 100%;
            line-height:48px;
            height:48px;
            font-size:32px;
            color: #666;
            text-align: center;
        }
    }
</style>
<script>

    function versionLook(set){
        if(set){
            localStorage.setItem('version-look', JSON.stringify(set));
        }
        let look = localStorage.getItem('version-look');
        if(look){
            return JSON.parse(look);
        }else{
            return false;
        }
    }
    import mixin from './mixin';
    import {api_list} from '../../../api/release';
    import {mapGetters, mapActions} from 'vuex';
    export default{
        mixins:[mixin],
        data(){
            return{
                show:this.value,
                showDetail:false,
                version:{release_time:1502702862,title:'xfasdfa',items:[]},

            }
        },
        created(){
            //TODO 以后再打开它
            // this.$http(api_list, {review:true}).then(versions=>{
            //     this.load(versions);
            // })
        },
        filters:{
            typeName(val){
                switch (val){
                    case 1:
                        return '紧急重要';
                    case 2:
                        return '重要';
                    case 3:
                        return '紧急';
                    case 4:
                        return '不关紧要';
                }
            }
        },
        methods:{
            ...mapActions({load:'version/load'}),
            look(version){
                this.version = version;
                this.showDetail = true;
            },
            split(vals, count){
                return vals.split(1, count);
            }
        },

        computed:{
            ...mapGetters({versions:'version/versions'}),
            allCount(){
                return this.versions.length;
            },
            readCount(){
                return this.versions.filter(v=>v.read).length;
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
                if(val){
                    let look = versionLook();
                    if(look){

                    }
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelPanel:require('../../../components/label-panel.vue').default,
            versionInfoDetail:require('./version-info-detail.vue').default,
        }
    }
</script>
