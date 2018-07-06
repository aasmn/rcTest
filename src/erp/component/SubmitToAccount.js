import React from 'react'
import { Collapse, Checkbox, Input } from 'antd'
import _ from 'lodash'

import { connect } from 'react-redux'
import { getMainTask, getSubTask } from '@/erp/store/actions'
import PartSelect from '@/erp/component/PartSelect'
import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
import RIf from '@/erp/component/RIF'
const Panel = Collapse.Panel;
class Main extends React.Component {
    constructor(props) {
        super(props);
        const taskSelected = props.outworkData ? _.map(props.outworkData.ChildTasks, t => t.TaskId): [];
        this.state = {
            partTax: {
                select1: props.partTax>0? 1: 0,
                select2: props.partTax >0? props.partTax : 1
            },
            taskSelected: taskSelected,
            hasOutwork: props.outworkData === undefined ? false : !!props.outworkData,
            areaCode: props.areaCode || (props.outworkData && props.outworkData.AreaCode),
            Remark: props.Remark || (props.outworkData && props.outworkData.Remark)
        }
        this.props.getMainTask()
        this.props.getSubTask()
        this.props.popView(this)
    }
    onTaskChange = (v)=>{
        this.setState({ taskSelected:v})
    }
    getOutWorkData= ()=>{
        if(this.state.hasOutwork){
            return {
                AreaCode: this.state.areaCode,
                ChildTasks: _.filter(_.filter(this.props.sub_task, { Status: 1, BusinessType: 4 }),item=>{
                    return this.state.taskSelected.indexOf(item.Id)>-1
                }),
                CommonTaskId:0,
                MainTaskName: "其他",
                Remark: this.state.Remark
            }
        }else{
            return null;
        }
    }
    render() {
        let subGroups = _.filter(this.props.sub_task, { Status: 1, BusinessType: 4 });
        return (
            <div>
                <div className={(this.props.editable === 1 || this.props.editable === 3) ? '' : 'disabled-mask'} style={{ opacity: 1 }}>
                    <PartSelect onlyPart={this.props.editable===3} value={this.state.partTax} onChange={e=>{this.setState({partTax:e})}}/>
                </div>
                <RIf if={this.state.partTax.select1 == 1}> 
                    <div className={(this.props.editable === 1 || this.props.editable === 2)? '' : 'disabled-mask'} style={{ opacity: 1 }}>
                        <div>添加外勤任务</div>
                        <div style={{ margin: '12px 0', fontSize: '14px' }}><Checkbox checked={this.state.hasOutwork} onClick={e => { this.setState({ hasOutwork: e.target.checked})}}> 特殊任务</Checkbox></div>
                        <div style={{ margin: '0 12px' }}>
                            <Checkbox.Group onChange={this.onTaskChange} value={this.state.taskSelected}>
                                {subGroups.map((item, index) => (<Checkbox value={item.Id} key={item.Id} disabled={!this.state.hasOutwork}> {item.TaskName}</Checkbox>))}
                            </Checkbox.Group>
                        </div>
                        <div className="form-row">
                            <label>选择区域</label>
                            <AreaSelect value={this.state.areaCode} onChange={e=>this.setState({areaCode:e})}/>
                        </div>
                        <div className="form-row">
                            <label>外勤备注</label>
                            <Input.TextArea value={this.state.Remark} onChange={e=>{this.setState({Remark:e.target.value})}}></Input.TextArea>
                        </div>
                    </div>
                </RIf>
            </div>
        );
    }
}

const mapStateToProps = ({ common }) => {
    return {
        main_tasks: common.main_tasks,
        sub_task: common.sub_task
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getMainTask: payload => {
            dispatch(getMainTask())
        },
        getSubTask: payload => {
            dispatch(getSubTask())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
