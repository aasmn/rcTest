import React from 'react'
import Dialog from '@/erp/container/Dialog'
import Prompt from '@/erp/component/Prompt'
import AddRemark from '@/erp/container/Contract/AddRemark'
import { message } from 'antd'
import { putData } from '@/erp/api'
import store from '@/erp/store'
import $ from 'jquery'
import _ from 'lodash'

export const mark = (data)=>{ //标记，取消标记 data：公司信息
    if(!data.RemarkSignId){
        let markform
        return Dialog({
            content: <AddRemark wrappedComponentRef={crmform =>{markform = crmform}}/>,
            width: 540,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    let form_data = markform.getFieldsValue() || '';
                    const state = store.getState();
                    if(form_data){
                        form_data.CustomerId = data.Id;
                        if (form_data.Remark && !(/(\{.*\})$/.test(_.trim(form_data.Remark)))) {
                            form_data.Remark = form_data.Remark + '{' + state.common.user.RealName + '}';
                        }
                        putData("companySign", form_data).then(res=>{
                            if(res.status){
                                resolve()
                            }else{
                                reject()
                            }
                        },()=>reject())
                    }else{
                        reject()
                    }
                });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "标记-"+ data.CompanyName
        }).result;

    }else{
        return putData('cancelcompanysign?customerId='+ data.Id)
    }
}
export const hangUp = (row)=>{  //挂起
    if(row.RemarkSuspendId){
        return new Promise((resolve, reject) => {
            const post = {
                CompanyId: row.Id,
                SubsidiaryId: row.SubsidiaryId,
                Description: ''
            };
            putData('order/expire/suspendcancel', post).then(res=> {
              if(res.status) {
                message.info('操作成功！');
                resolve();
              }else{
                reject();
              }
            });
        });
    }else{
        return new Promise((resolve, reject) => {
            Prompt({
                title: '挂起原因',
                handleOk: (res)=>{
                    putData('order/expire/suspend',{
                        CompanyId: row.Id,
                        Description: res
                    }).then(res=>{
                        if(res.status){
                            message.info('挂起成功！');
                            resolve();
                        }else{
                            reject();
                        }
                    });
                    return true;
                }
            });
        });
    }
    
}
export const downLoad= (url,filename)=>{
    let loading1 = message.loading('数据准备中...', 0);
    let loading2;
    var page_url = url;
    var req = new XMLHttpRequest();
    // if (window.sessionStorage.getItem('token')) {
    //     req.setRequestHeader('Authorize', window.sessionStorage.getItem('token')); 
    // }else{
    //     window.sessionStorage.clear();
    //     window.location.replace('#/login');
    //     window.location.reload();
    // }
    

    req.open("GET", page_url, true);
    //监听进度事件
    req.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
            if(loading1){
                loading1();
                loading1 = null;
            }
            if(!loading2){
                loading2 = message.loading('数据下载中 0%', 0);
            }else{
                var percentComplete = Math.round(evt.loaded*100 / evt.total);
                $('.ant-message-loading span').text('数据下载中..' + percentComplete + '%.')
            }
        }
    }, false);

    req.responseType = "blob";
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            if(loading2){
                loading2();
                loading2 = null;
            }
            if (loading1) {
                loading1();
                loading1 = null;
            }
           if (typeof window.chrome !== 'undefined') {
                // Chrome version
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(req.response);
                link.download = filename;
                link.click();
            } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE version
                var blob = new Blob([req.response], { type: 'application/force-download' });
                window.navigator.msSaveBlob(blob, filename);
            } else {
                // Firefox version
                var file = new File([req.response], filename, { type: 'application/force-download' });
                window.open(URL.createObjectURL(file));
            }
        }
    };
    req.send();
}