<template>
    <page-dialog v-model="show" :title="title" size="small" class="version-info-detail">
        <label for="">发布明细：</label>
        <ul>
            <li v-for="item in version.items" :key="item.desc">
                <span class="type">类型：{{item.type | stypeName}}：</span>
                <span class="desc">描述：{{item.desc}}</span>
                <span>
                    开发者：<span :class="{'dev-authors':item.dev_authors}">{{item.dev_authors}}</span>
                </span>
                <span class="at-roles" v-if="item.at_roles.length">
                    @角色：
                    <span v-for="role in at_roles(item.at_roles)"
                          :key="role.id" :class="role.hightlight ? 'hightlight' : ''">
                        {{role.name}}
                    </span>
                </span>
            </li>
        </ul>
        <div slot="footer">
            <el-button @click.native="read" type="primary" size="mini" :disabled="version.read">已读</el-button>
            <el-button @click.native="show=false;" size="mini">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .version-info-detail{
        li{
            border-bottom:1px solid #c2beac;
            line-height:40px;
            height:32px;
            font-size:20px;
            margin-left: 16px;
            padding-left:16px;
            .type{

            }
            .desc{

            }
            .at-roles{
                margin-left:5px;
                span{
                    padding:2px;
                    &.hightlight{
                        color: #f00;
                    }
                }
            }
            .dev-authors{
                border:1px solid #1b6d85;
                border-radius:2px;
                padding: 0 5px;
                &:hover{
                    background-color:#F0F0FF;
                }
            }
        }
    }
</style>
<script>

    import datef from 'datef'
    import mixin from './mixin';
    import {mapGetters,mapActions} from 'vuex';
    import {api_read} from '../../../api/release';
    export default{
        mixins:[mixin],
        data(){
            return{
                show:this.value,
            }
        },
        methods:{
            ...mapActions({readVersion:'version/readVersion'}),
            read(){
                this.$http(api_read, this.version.id).then(res=>{
                    this.$message(res.message);
                    this.version.read = true;
                    this.readVersion(this.version.id);
                })
            },
            at_roles(roles){
                return roles.map(role => {
                    role.hightlight = this.roles.indexOf(role.id)>=0;
                    return role;
                })
            }
        },
        computed:{
            ...mapGetters({roles:'permission/roles'}),
            title(){
                const time = datef('YYYY-MM-dd HH:mm:ss', parseInt(this.version.release_time) * 1000)
                return `版本信息：${time} - ${this.version.title}`;
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            version:{

            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
