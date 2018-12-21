/**
 * Created by RondaFul on 2016/10/26.
 */

export const phone = /^1\d{10}$/;//---手机号
export const tel = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;//---手机号和座机号
export const zip = /^[1-9][0-9]{5}$/;//--------邮编
export const name = /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*/;//--中文名字
export const title = /\b[^\Wa-z0-9_][^\WA-Z0-9_]*\b/;//----首字母为大写
// export const plus = /^[0-9].*$/;//----正数
export const plus = /^\d+(\.\d+)?$/;
// 验证数字 空格 -
export const extraReg = /^[0-9 -]+$/;
//是否包含中文
export const chinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
//验证电话号或传真
export const telPhone = /^0\d{2,3}-?\d{7,8}$/;
//验证邮箱
// export const email = /^([a-zA-Z0-9]+[-|\_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
export const email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[a-zA-Z]{1,20}$/i;
//验证QQ
export const qq = /^[1-9][0-9]{4,11}$/;
//非负整数
export const integer = /^[0-9]+$/;
//判断网址
export const url = /([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
export const twoFloat = /^\d+(\.\d{1,2})?$/;
//匹配所有 html标签
export const html = /<[^>]+>/g;
//匹配所有 img标签
export const img = /<img[^>]*>/gi;
export const english = /^[A-Za-z]+$/;
//验证电话号码
export const allPhone = /^(?:\(?[0\+]?\d{1,3}\)?)[\s-]?(?:0|\d{1,4})[\s-]?(?:(?:13\d{9})|(?:\d{7,8}))$/;
export const isExcel  = /\.(?!(xlsx$|xls$))/;