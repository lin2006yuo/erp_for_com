    <template>
        <div class="c-add-edit">
            <page-dialog v-model="show" :title="titleName" size="full" :close-on-click-modal="false">
              <div class="tabs-content">
                  <div class="tabs-content-pane card">
                      <el-tabs type="card" ref="tabs"  v-model="activeName">
                          <el-tab-pane key="base_info" name="base_info"class="roll-height">
                            <span slot="label"><i class="el-icon-date"></i> 基本信息</span>
                            <base-info :base-info="baseInfo" @address-add="address_add" @base-add="base_add" :mark-id="markId" @update-data="update_data"></base-info>
                          </el-tab-pane>
                          <el-tab-pane key="address_management"
                                       name="address_management"
                                       :disabled="addressAdd"
                                       class="roll-height">
                            <span slot="label" :class="[addressAdd ? 'disabled':'']" title="请先保存"><i class="el-icon-edit"></i> 地址管理</span>
                            <address-management :address-management="addressManagement" :address-id="addressId" :buyers-id="buyersId"></address-management>
                          </el-tab-pane>
                      </el-tabs>
                  </div>
              </div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="mini" @click.native="show = false">关闭</el-button>
                </div>
            </page-dialog>
        </div>
    </template>
    <style lang="stylus">

    </style>
    <script>
        export default{
            page:{
                devinfo:{
                    frontEnd:'黎宏珍',
                    backEnd:'张文宇',
                    createTime:'2017-8-5',
                    updateTime:'2017-8-22'
                }
            },
            data(){
                return{
                    show:false,
                    addressAdd:true,
                    activeName:'base_info',
                    baseInfo:[],
                    addressManagement:[],
                    buyersId:''
                }
            },
            methods:{
                address_add(val){
                    this.addressAdd = false;
                    this.buyersId = val;
                    console.log("55",this.buyersId);
                },
                update_data(id){
                    this.$emit("update-data",id);
                },
                base_add(val){
                    this.$emit("base-add",val);
                }
            },
            watch: {
                value(val){
                    this.show = val;
                },
                show(val){
                    this.$emit("input",val)
                },
                'markId'(val){
                	console.log("markId",val);
                    if(val===1){
                        this.addressAdd = false;
                    }else if(val===0){
                        this.addressAdd = true;
                    }
                }
            },
            computed:{
            },
            props:{
                value:{},
                titleName:{},
                markId:{},
                addressId:{}
            },
            components:{
                pageDialog:require("../../../components/page-dialog.vue").default,
                baseInfo:require("./base-info.vue").default,
                addressManagement:require("./address-management.vue").default,
            }
        }
    </script>

