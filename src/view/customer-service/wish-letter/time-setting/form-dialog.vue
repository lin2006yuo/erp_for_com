<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form ref="form"  label-width="80px">
                <el-form-item label="回复级别：">
                    <span>{{row.replyLevel}}</span>
                </el-form-item>
                <el-form-item label="优先级：">
                    <span>{{row.priority}}</span>
                </el-form-item>
                <el-form-item label="时间：">
                    <el-input class="time" v-model="row.time" type="number"></el-input>小时 (仅支持输入小于等于48小时)
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="row.remarks"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false, sava()">确 定</el-button>
            </span>
        </el-dialog>
    </div>    
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
        handleClose(done) {
	        this.dialogVisible = false
        },
        sava () {
            
        }
    },
    watch: {
        value (val) {
            this.dialogVisible = val
        },
        dialogVisible (val) {
            this.$emit('input', val)
        }
    },
    props: {
        value: {},
	    row: {},
	    title: {
		    type: String
	    }
    }
  };
</script>
<style>
 .time {
	 width: 10%;
	 display: inline-block;
 }
</style>

