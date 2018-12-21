/**
 * Created by wuchuguang on 16-11-2.
 */
import {url_publish_baseinfo,url_publish_updata_baseinfo,url_publish_status,url_get_goods_tort,
    api_server_img,url_server_img} from "../../../api/product-library"
import {url_amazon_add_product} from '../../../api/amazon-publish'

const goods_onsale=1;
const goods_offsale=2;
const goods_released=3;
const goods_sold_out=4;
const goods_out_stock=5;
const goods_half_sale=6;
export const operate_list= [
    {name:"查看",value:8,api:url_publish_baseinfo,
        status:[goods_onsale,goods_offsale,goods_released,goods_sold_out,goods_out_stock,goods_half_sale],
        action:function(data,option){
            this.editAble = false;
            this.lookVisable = true;
            this.$nextTick(()=>{
                // this.$refs.looks.editAble = true;
                this.$refs.looks.titleName = `查看SPU：${data.spu}  `;
            })
        }},
    {name:"编辑",value:9,api:url_publish_updata_baseinfo,
        status:[goods_onsale,goods_offsale,goods_released,goods_sold_out,goods_out_stock,goods_half_sale],
        action:function(data,option){
            this.editAble = true;
            this.lookVisable = true;
            this.$nextTick(()=>{
                // this.$refs.looks.editAble = false;
                this.$refs.looks.titleName = `编辑SPU：${data.spu}`;
            })
    }},
    {name:"在售",value:1,api:url_publish_status,
        status:[goods_released,goods_out_stock,goods_offsale,goods_half_sale],
        action:function(data,option){
            let old=data.status;
            this.change_single(data,old,option.value)
    }},
    {name:"停售",value:2,api:url_publish_status,
        status:[goods_onsale,goods_out_stock,goods_half_sale],
        action:function(data,option){
            let old=data.status
            this.change_single(data,old,option.value)
        }},
    {name:"卖完下架",value:4,api:url_publish_status,
        status:[goods_onsale,goods_released],
        action:function(data,option){
            let old=data.status
            this.change_single(data,old,option.value)
    }},
    // {name:"作废",value:5,api:url_publish_status,
    //     status:[goods_released],
    //     action:function(data,option){
    //         let old=data.status
    //         this.change_single(data,old,option.value)
    //     }},
    {name:"自动抓取图片",value:6,api:url_publish_status,
        status:[goods_onsale,goods_offsale,goods_sold_out,goods_out_stock,goods_half_sale],
        action:function(data,option){
            this.$http(api_server_img,{goods_id:data.id}).then(res=>{
                this.$message({type: "success", message: res.message || res})
            }).catch(code=>{
                this.$message({type: "error", message: code.message || code})
            })
        }},
    {name:'亚马逊预刊登',value:7,api:url_amazon_add_product,
        status:[goods_onsale,goods_offsale,goods_released,goods_sold_out,goods_out_stock,goods_half_sale],
        action:function(data,option) {
            this.amazon_publish(data);
        }
    },
    {name:'侵权下架',value:8,api:url_get_goods_tort,
        status:[goods_onsale,goods_offsale,goods_released,goods_sold_out,goods_out_stock,goods_half_sale],
        action:function(data,option) {
            this.get_goods_tort(data);
        }
    }
];

/*展开sku  操作状态*/
export const operate_list3 = [
    {name:"在售",value:1},
    {name:"停售",value:2},
    {name:"卖完下架",value:4},
    {name:"缺货",value:5},
];
export const date = function (val, params) {
    return val+'-first';
};

export const date1 = function (val, params) {
    return val+"-seconds";
}

