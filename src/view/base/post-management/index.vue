<template>
  <page>
    <search-card class="mb-xs"
                 :params="searchData" 
                 @search="search" 
                 @enter="search" 
                 :clears="clears">
      <div>
        <label-buttons class="inline" 
                       label="状态：" 
                       v-sf.status 
                       :buttons="buttons" 
                       @select="status_select"
                       :default-index="1">
        </label-buttons>
      </div>
      <label-item label="邮局：" class="mr-sm">
        <el-input v-model="searchData.post"></el-input>
      </label-item>
      <label-item label="邮箱号数：" class="mr-sm">
        <el-input v-model="searchData.email_count_st" style="width:100px"></el-input>
        <label>&nbsp;--&nbsp;</label>
        <el-input v-model="searchData.email_count_nd" style="width:100px"></el-input>
      </label-item>
      <label-item label="添加时间：" class="mr-sm">
        <el-date-picker v-model="searchData.create_time_st"
                        v-sf.date_b 
                        placeholder="请选择日期"                     
                        type="date"
                        class="inline date"
                        :picker-options="inputTimeStart"
        ></el-date-picker>
        <label>&nbsp;--&nbsp;</label>
        <el-date-picker v-model="searchData.create_time_nd"
                        v-sf.date_e
                        placeholder="请选择日期"
                        type="date"
                        class="inline date"
                        :picker-options="inputTimeEnd"
        ></el-date-picker>
      </label-item>
    </search-card>
    <el-button class="ml-sm mb-xs"
               size="mini"
               @click.native="add"
               type="primary">添加
    </el-button>
    <data-table :table-data="tableData"
                @get-form="get_form">
    </data-table>
    <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
    </el-pagination>
    <operation-dialog v-model="dialogVisible"
                      :view="isView"
                      :add="isAdd"
                      :title="title"
                      :form-data="formData"
                      :id="rowId"
                      :cannot-edit-post-office="cannotEditPostOffice"
                      @update-addition="update_addition"
                      @update-edittion="update_edition">
    </operation-dialog>
  </page>
</template>

<style lang="">
  
</style>

<script>
import {api_get_postoffice,api_get_single_postoffice} from '../../../api/post-management.js'

export default {
  data(){
    return {
      buttons: [
        { label: "全部", value: "" },
        { label: "已启用", value: 0 },
        { label: "已停用", value: 1 }
      ],
      searchData:{
        status:'1',
        post:'',
        email_count_st:'',
        email_count_nd:'',
        create_time_st:'',
        create_time_nd:'',
        page:1,
        pageSize:50
      },
      symList:[
        {label:'>',value:'>'},
        {label:'≥',value:'>='}
      ],
      clears:{
        email_count_condition:'>='
      },
      tableData:[],
      formData:{},
      total:50,
      currentRow:{},
      title:'',
      rowId:'',
      cannotEditPostOffice:false,
      isView:false,
      dialogVisible:false,
      isAdd:false,
      inputTimeStart:{
        disabledDate:(date)=>{
          if(this.searchData.create_time_nd){
            return date.getTime()>this.searchData.create_time_nd;
          }
          else{return false;}
        }
      },
      inputTimeEnd:{
        disabledDate:(date)=>{
          if(this.searchData.create_time_st){
            return date.getTime()<this.searchData.create_time_st;
          }
          else{return false;}
        }
      }
    };
  },
  mounted(){
    this.init();
  },
  refresh(){
    this.init();
  },
  methods:{
    init(){
      this.searchData.create_time_st=this.searchData.create_time_st?datef('YYYY-MM-dd',new Date(this.searchData.create_time_st).getTime()/1000)+'':'';
      this.searchData.create_time_nd=this.searchData.create_time_nd?datef('YYYY-MM-dd',new Date(this.searchData.create_time_nd).getTime()/1000)+'':'';
      //获取邮局数据列表
      this.$http(api_get_postoffice,this.searchData)
        .then(res=>{
          // console.log("获取列表数据:",res);
          this.total=res.count;
          //将status字段转换成Boolean
          this.tableData=res.list.map(item=>{
            Object.keys(item).forEach(key=>{
              if(key==='status'){
                item[key]=!!item[key];
              }
            });
            return item;
          });
          // this.tableData=res.list;
        })
        .catch(error=>{
          this.$message({type:'error',message:error||error.message})
        })
    },
    search(){
      if(this.validate()){this.init();}
    },
    validate(){
      // console.log("开始验证:",this.searchData);
        let min=this.searchData.email_count_st;
        let max=this.searchData.email_count_nd;
      let num=/^[0-9]*$/;
      let isValid=false;
      if(min){
          if(!num.test(min)){
              this.$message({type:'warning',message:'邮箱号数必须为自然数！'});
          }
      }
      else if(max){
          if(!num.test(max)){
              this.$message({type:'warning',message:'邮箱号数必须为自然数！'});
          }
      }
      if(min && max){
          if(!num.test(min) || !num.test(max)){
              this.$message({type:'warning',message:'邮箱号数必须为自然数！'});
          }
          else if((min-0)>(max-0)){
              this.$message({type:'warning',message:'邮箱号数左边的值不得大于右边！'});
          }
          else{isValid=true;}
      }
      else {isValid = true;}
      return isValid;
      // if(!(num.test(min)&&num.test(max))){
      //   this.$message({type:'warning',message:'邮箱号数必须为自然数！'});
      //     isValid = false;
      // }
      // else if(min && max &&(max-0)<(min-0)){
      //   this.$message({type:'warning',message:'邮箱号数左边的值不得大于右边！'});
      //   isValid = false;
      // }

    },
    status_select(val){
      // console.log("val:",val);
      switch(val){
        case 0:
          this.searchData.status='';
          break;
        case 1:
          this.searchData.status=1;
          break;
        case 2:
          this.searchData.status=0
      }  
    },
    handle_size_change(val){  //改变每页显示数目
      // console.log("显示数目:",val);
      this.searchData.pageSize=val;
      this.init();
    },
    handle_current_change(val){ //改变当前页
      this.searchData.page=val;
      this.init();
    },
    clear(){},
    view(row){  //查看对话框    
      this.title=`查看邮局：${row.post}信息`;
      this.isAdd=false;
      this.isView=true;
      this.rowId=parseInt(row.id);
      this.dialogVisible=true;
    },    
    edit(row){  //编辑对话框
      this.cannotEditPostOffice = row.email_count > 0;  //邮箱号数大于0不能编辑邮局
      this.currentRow=row;//缓存当前行
      this.title=`编辑邮局：${row.post}信息`; 
      this.isView=false;
      this.isAdd=false;
      this.rowId=parseInt(row.id);
      this.dialogVisible=true;
    },
    add(){  //添加对话框
      this.title="添加邮局";
      this.isAdd=true;
      this.isView=false;
      this.dialogVisible=true;
      this.formData.status=true;
    },
    get_form(para){   //获取对话框表格数据 
      this.$http(api_get_single_postoffice,para.row.id)
        .then(res=>{
          this.formData=res;
          this.formData.status=!!this.formData.status;
          
          switch(para.type){
            case 'view':
              this.view(para.row);
              break;
            case 'edit':
              this.edit(para.row);
              break;
          }
        })
    },
    update_addition(){  
      this.init();
    },
    update_edition(data){  //将编辑数据同步到列表
      Object.keys(data).forEach(key=>{
        this.currentRow[key]=data[key];
      });
      //处理status字段，Number转Boolean
      this.currentRow.status=this.currentRow.status===0?false:true;
    }
  },
  components:{
    searchCard:require('@/components/search-card').default,
    dataTable:require('./data-table').default,
    labelButtons:require('@/components/label-buttons.vue').default,
    labelItem:require('@/components/label-item.vue').default,
    operationDialog:require('./operation-dialog.vue').default
  }
}
</script>
