    <template>
        <div class="c-price-change.vue">
            <page-dialog title="SKU价格变动" v-model="show" size="small" :close-on-click-modal="false">
              <div style="height: auto;">
                <el-table :data="priceChangeData">
                  <el-table-column label="SUK" inline-template>
                    <span>{{row.sku}}</span>
                  </el-table-column>
                  <el-table-column prop="sku_name" label="名称" inline-template>
                    <span>{{row.sku_name}}</span>
                  </el-table-column>
                  <el-table-column prop="sku_name" label="上次报价（CNY）" inline-template>
                    <span>{{row.audited_price}}</span>
                  </el-table-column>
                  <el-table-column prop="sku_name" label="本次报价（CNY）" inline-template>
                    <span>{{row.purchase_price}}</span>
                  </el-table-column>
                </el-table>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="show=false">确定</el-button>
                <el-button size="mini" @click.native="show=false">取消</el-button>
              </div>
            </page-dialog>
        </div>
    </template>
    <style lang="stylus">

    </style>
    <script>
      import pageDialog from '../../../components/page-dialog.vue'
        export default{
            page:{
                devinfo:{
                    frontEnd:'黎宏珍',
                    backEnd:'杨伟权',
                    createTime:'2017-6-22',
                    updateTime:'2017-8-22'
                }
            },
            data(){
                return {
                  show: false
                }
            },
            watch:{
              value(val){
                this.show = val;
              },
              show(val){
                this.$emit('input',val);
              }
            },
            props:{
              value:{},
              priceChangeData:{
                required:true,
                type:Array
              }
            },
            components:{
              pageDialog
            }
        }
    </script>

