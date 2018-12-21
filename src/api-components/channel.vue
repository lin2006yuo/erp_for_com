<template>
    <label-item label="平台：">
        <el-select v-if="type === 'select'" v-model="select">
            <el-option
                    v-for="channel in channels"
                    :label="channel.label"
                    :value="channel.value"
                    :key="channel.value"
            ></el-option>
        </el-select>
        <div v-else class="channels">
            <el-button v-for="channel in channels"
                       size="mini"
                       :key="channel.value"
                    :type="channel.value === select ? 'primary' : ''"
                       @click.native="click(channel)"
            >{{channel.label}}</el-button>
        </div>
    </label-item>
</template>
<style lang="stylus">
    .channels{

    }
</style>
<script>

    import {api_channels} from '../api/global';
    import {mapActions, mapGetters} from 'vuex';
    export default{
        data(){
            return{
                select:this.value,
            }
        },
        mounted(){
            if(!this.channels.length){
                this.$http(api_channels).then(res=>{
                    this.load(res);
                })
            }
        },
        methods:{
            ...mapActions({
                load:'channels'
            }),
            click(channel){
                this.select = channel.value;
            }
        },
        watch:{
            select(val){
                this.$emit('input', val);
                this.$emit('change', val);
            },
            value(val){
                this.select = val;
            }
        },
        props:{
            type:{
                type:String,
                default(){
                    return 'select'
                }
            },
            value:{
                type:Number
            },
        },
        computed:{
            ...mapGetters(['channels'])
        },
        components:{
            labelItem:require('../components/label-item.vue').default
        }
    }
</script>