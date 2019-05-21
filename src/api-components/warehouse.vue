<template>
    <label-item label="仓库：">
        <el-select v-if="type === 'select'" v-model="select" class="width-sm">
            <el-option
                    v-for="warehouse in warehouses"
                    :label="warehouse.label"
                    :value="warehouse.value"
                    :key="warehouse.value"
            ></el-option>
        </el-select>
        <div v-else class="warehouses">
            <el-button v-for="warehouse in warehouses"
                       :key="warehouse.label"
                       size="mini"
                       :type="warehouse.value === select ? 'primary' : ''"
                       @click.native="click(warehouse)"
            >{{warehouse.label}}</el-button>
        </div>
    </label-item>
</template>
<style lang="stylus">
    .warehouses{

    }
</style>
<script>
    import {api_warehouses, api_channels} from '../api/global';
    import {mapActions, mapGetters} from 'vuex';
    export default{
        name:'warehouse',
        data(){
            return{
                select:this.value,
            }
        },
        created(){
            this.init();
        },
        methods:{
            ...mapActions({
                load:'api/warehouses'
            }),
            click(warehouse){
                this.select = warehouse.value;
            },
            init(){
                const set = () =>{
                    if(this.auto && (!this.warehouses.find(row=>row.value === this.select))){
                        this.click(this.warehouses[0]);
                    }
                };
                if(!this.warehouses.length){
                    this.$http(api_warehouses).then(res=>{
                        if(this.hasAll){
                            res.unshift({label:'全部', value:''});
                        }
                        this.load(res);
                        set();
                    })
                }else{
                    set();
                }
            }
        },
        watch:{
            select(val){
                this.$emit('input', val);
                this.$emit('change', val);
            },
            value(val){
                this.select = val;
                this.$emit('compare');
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
                type:[Number,String]
            },
            auto:{
                type:Boolean,
                default(){
                    return true;
                }
            },
            hasAll:{
                type:Boolean,
                default(){
                    return true;
                }
            }
        },
        computed:{
            ...mapGetters({warehouses:'api/warehouses'})
        },
        components:{
            labelItem:require('../components/label-item.vue').default
        }
    }
</script>
