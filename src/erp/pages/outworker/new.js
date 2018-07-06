import React, { Component } from 'react'
import { message, Button } from 'antd'
import _ from 'lodash'
import { postData } from '@/erp/api'
import Dialog from '@/erp/container/Dialog'
import OutworkerTask from '@/erp/container/Outworker/Task'
import TaskListWeight from '@/erp/container/Outworker/TaskListWeight'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: _.uniqueId('owId_')
        }
    }
    save = () => {
        const formdata = this.crmform.getFieldsValue();
        let taskform;
        if (formdata) {
            if (formdata.CommonTaskId === 0) {
                Dialog({
                    content: <TaskListWeight data={formdata.ChildTasks} ref={form => { if (form) taskform = form; }} />,
                    width: 600,
                    handleOk: () => {
                        if (_.uniqBy(taskform.data, 'Weight').length < taskform.data.length) {
                            message.error('权重不允许重复！')
                            return false;
                        }
                        return true;
                    },
                    confirmLoading: false,
                    handleCancel() {
                    },
                    title: "修改权重"
                }).result.then(() => {
                    formdata.ChildTasks = taskform.data;
                    saveData();
                });
            } else {
                saveData();
            }
        } 
        // const view = this;
        function saveData() {
            _.each(formdata.ChildTasks, item => {
                item.CustomerId = formdata.Customer.Id
            });
            postData('maintask', {
                ...formdata,
                AreaCode: formdata.AreaCode,
                MainTaskName: formdata.MainTaskName,
                CustomerId: formdata.Customer.Id
            }).then(res => {
                if (res.status) {
                    message.info('保存成功！');
                    window.location.href = "#/main/outwork_manage"
                } 
            });
        }
    }
    render() {
        return (
            <div style={{width: '800px'}} key={this.state.key}>
                <OutworkerTask data={{}} wrappedComponentRef={crmform => { this.crmform = crmform }} />
                <div style={{textAlign: 'center'}}><Button type="primary" onClick={e => this.save()}>保存</Button></div>
            </div>
        );
    }
}

export default Main
