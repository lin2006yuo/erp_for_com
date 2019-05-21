<template>
    <el-row>
        <el-col :span="6" class='p-city'>
            <el-select v-model="provinceSelect"  placeholder="请选择省" >
                <el-option v-for="option in provinceOptions"
                           :label="option.name"
                           :value="option.id"
                           :key="option.id"
                >
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="6" class='p-city'>
            <el-select v-model="citySelect"  placeholder="请选择市" >
                <el-option v-for="option in cityOptions"
                           :key="option.id"
                           :label="option.name"
                           :value="option.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="6" class='p-city'>
            <el-select v-model="countySelect"  placeholder="请选择区/县">
                <el-option v-for="option in countyOptions"
                           :key="option.id"
                           :label="option.name"
                           :value="option.id">
                </el-option>
            </el-select>
        </el-col>
    </el-row>

</template>
<style lang="stylus">
    .p-city{
        margin-right: 10px;
    }
</style>
<script>

    export default{
        data(){
            return{
                provinceSelect:'',
                citySelect:'',
                countySelect:''
            }
        },

        methods:{
            get_options(childs){
                let ret = [];
                for(let i in childs){
                    if(childs.hasOwnProperty(i)){
                        ret.push(childs[i])
                    }
                }
                return ret;
            }
        },

        computed:{
            provinceOptions(){
                return this.get_options(this.datas);
            },
            province(){
                return this.datas[this.provinceSelect];
            },
            cityOptions(){
                if(this.province){
                    return this.get_options(this.province._child);
                }else{
                    return []
                }
            },
            city(){
                if(this.province){
                    return this.province._child[this.citySelect];
                }
            },
            countyOptions(){
                if(this.city){
                    return this.get_options(this.city._child);
                }else{
                    return [];
                }
            }
        },
        watch:{
            provinceSelect(val){
                this.citySelect = '';
            },
            citySelect(val){
                this.countySelect = '';
            },
            countySelect(val){
                let address = `${this.provinceSelect}-${this.citySelect}-${this.countySelect}`;
                this.$emit('input', address);
            },
            value(val){
                console.log(val);
                let pcc = val.split('-');
                this.provinceSelect = parseInt(pcc[0]);
                this.citySelect = parseInt(pcc[1]);
                this.countySelect= parseInt(pcc[2]);
            }
        },
        props:{
            datas:{},
            disabled:{},
            value:{}
        },
        components:{

        }
    }
</script>