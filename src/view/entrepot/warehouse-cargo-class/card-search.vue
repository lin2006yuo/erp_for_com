    <template>
        <div class="c-card-search">
            <label-item label="请选择仓库：" class="mb-xs mt-sm">
                <el-select v-model="searchData.warehouse_id" class="inline width-sm" @change="select_warehouse">
                    <el-option
                        :key="item.value"
                        v-for="item in warehouses"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <search-card @search="search" @enter="search" @init-params="clear" :params="paramsData" :clears="clears">
                <label-item label="货位类型编码：" class="inline">
                    <el-input v-sf.code v-model="paramsData.code" placeholder="请输入货位类型编码..." class="inline enter-result"></el-input>
                </label-item>
                <label-item label="类型名称：" class="inline ml-sm">
                    <el-input v-sf.name v-model="paramsData.name" placeholder="请输入类型名称..." class="inline enter-result"></el-input>
                </label-item>
                <label-item label="状态：" class="inline ml-sm mr-sm">
                    <el-select v-sf.status v-model="paramsData.status" class="width-xs">
                        <el-option
                            :key="item.status"
                            v-for="item in statusList"
                            :label="item.name"
                            :value="item.status">
                        </el-option>
                    </el-select>
                </label-item>
            </search-card>
        </div>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_warehous_lists} from '../../../api/entrepot-picking';
        export default{
            data(){
                return{
                    paramsData:{
                        code:'',
                        name:'',
                        status:'',
                    },
                    clears:{
                        status:'',
                    },
                    isCleared: false,
                    warehouses:[],
                    statusList:[
                        {name:"全部",status:''},
                        {name:"启用",status:1},
                        {name:"停用",status:0},
                    ],
                }
            },
            created(){
                this.warehouses_init();
            },
            methods:{
                clear() {
                    this.isCleared = true;
                },
                select_warehouse(val){
                    this.searchData.warehouse_id = val;
                    this.search();
                },
                search(){
                    Object.keys(this.paramsData).forEach(key => {
                        if(typeof this.paramsData[key] === 'string') {
                            this.paramsData[key] = this.paramsData[key].trim();
                        }
                    });
                    if(this.isCleared) {
                        this.searchData.page = 1;
                        this.searchData.pageSize = 50;
                        this.isCleared = false;
                    }
                    Object.assign(this.searchData,this.paramsData);
                    this.$emit('search',this.searchData);
                },
                warehouses_init() {
                    this.$http(api_warehous_lists).then(res => {
                        this.warehouses = res.map((item) => {
                            return {label: item.name, value: item.id};
                        });
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })
                },
            },
            props:{
                searchData:{},
            },
            components:{
                labelItem:require('../../../components/label-item.vue').default,
                searchCard:require('../../../components/search-card.vue').default,
                labelButtons:require('../../../components/label-buttons.vue').default,
            }
        }
    </script>

