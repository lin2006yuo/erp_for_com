/**
 * Created by RondaFul on 2016/11/2.
 */
import {
    url_joom_list_enable,
    url_joom_list_disable,
    url_joom_listing_logs,
    api_joom_listing_logs,
} from '../../../../api/publish-joom';
import {api_joom_edit, url_joom_edit} from '../../../../api/publish-joom-info'
const sales=1;
const sold=2;

export const operateList = [
    {
        label: "编辑", value: "1", api: url_joom_edit, action: function (row) {
        this.$http(api_joom_edit, row.id, 'edit').then(res => {
            let params = {
                goods_id:row.goods_id,
                isEdit: true,
                item: res,
                // title: `编辑`
            };
            // this.$open(`/publish/joom/getData/${row.goods_id}`, params)
            this.$open(`/publish/joom/getData`, params)
        });
    },status:[sales, sold],
    },
    {
        label: "复制", value: "2", api: url_joom_edit, action: function (row) {
        let status = 'copy';
        this.$http(api_joom_edit, row.id, 'copy').then(res => {
            let params = {
                goods_id:row.goods_id,
                isCopy: true,
                item: res,
                // title: `复制`
            };
            // this.$open(`/publish/joom/getData/${row.goods_id}`, params)
            this.$open(`/publish/joom/getData`, params)
        });
    },status:[sales],
    },
    {
        label: "上架", value: "3", api: url_joom_list_enable, action: function (row) {
        this.operate_online(row);
    },status:[sold],
    },
    {
        label: "下架", value: "4", api: url_joom_list_disable, action: function (row) {
        this.operate_offline(row);
    },status:[sales],
    },
    {
        label: "操作日志", value: "5", api: url_joom_listing_logs, action: function (row) {
        this.productId = row.product_id;
        this.logVisable = true;
        // let data = {
        //     product_id:row.product_id,
        //     page:1,
        //     pageSize:20,
        // };
        // this.$http(api_joom_listing_logs,data).then(res => {
        //     console.log(res,'res123');
        // }).catch( code =>{
        //     this.$message({type:"error", message: code.message || code});
        // });
    },status:[sales],
    }];

