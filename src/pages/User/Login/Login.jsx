import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Form, Input, Checkbox, Button } from 'antd';

import './Login.css';

const { Item: FormItem } = Form;

export default Form.create()(
  class Login extends Component {
    back = () => {
      const {
        history: { goBack }
      } = this.props;
      goBack();
    };

    render() {
      const {
        form: { getFieldDecorator }
      } = this.props;
      return (
        <div className="user-content user-form-content">
          <Row className="login-back" onClick={this.back}>
            返回上一级
          </Row>
          <div className="user-form">
            <Form style={{ width: 300 }}>
              <FormItem>
                {getFieldDecorator('account', {
                  rules: [{ required: true, message: '账号是必需的' }]
                })(<Input placeholder="邮箱/账号" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请输入密码好吗？' },
                    { max: 18, message: '最多18字符' },
                    {
                      min: 6,
                      message: '至少6个字符'
                    }
                  ]
                })(<Input type="password" placeholder="密码" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true
                })(<Checkbox>记住我</Checkbox>)}
                <Button type="primary" size="large" style={{ width: '100%' }}>
                  登录
                </Button>
                <Row type="flex" justify="space-between">
                  <span>
                    没有账号？<Link to="/register">去注册</Link>
                  </span>
                  <Link to="forget-password">忘了密码？</Link>
                </Row>
              </FormItem>
            </Form>
          </div>
        </div>
      );
    }
  }
);
