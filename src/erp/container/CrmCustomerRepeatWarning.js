import React from 'react'
import { Table } from 'antd'
class Main extends React.Component {

    handleSubmit= (e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.onSubmit(values);
          }
        });
    }
    render () {

        const columns = [{
            title: '公司名称',
            dataIndex: 'CompanyName',
          }, {
              title: '联系电话',
              dataIndex: 'Mobile',
          }, {
              title: '销售',
              dataIndex: 'RealName',
          }]
        return (
        <div>
          <h1>您输入的客户手机号在系统中有重复记录如下：</h1>
          <Table columns={columns} 
              rowKey={record => record.Id}
              dataSource={this.props.data} 
              pagination={false}
              size="middle"
              bordered={true}
          />
          <p>
            <pre style={{color:'red'}}>
      请确认以上重复手机号码记录中的公司和您当前录入的公司是否相同。<br/>
<br/>
      比如：<br/>
        北京爱康鼎科技有限公司和北京爱康鼎科技有限责任公司 <br/>
        这种情况应该认为是相同公司。<br/>
        疑似重复，无法确认的情况，请及时与其他销售同事沟通确认！<br/>
        如果确认相同，说明已经有其他销售同事正在负责对接客户了。应该取消本次录入，否则会造成撞单问题。<br/>
        如果确认不同，点击确认保存本次录入。<br/>
<br/>
      注意：撞单问题发生的处理办法，按公司销售部门规章制度执行。<br/>
            </pre>
          </p>
        </div>
        )
    }
}


export default Main;
