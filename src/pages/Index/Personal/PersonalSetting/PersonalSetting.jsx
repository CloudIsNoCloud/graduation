import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Layout,
  Menu,
  Form,
  Input,
  Radio,
  Cascader,
  DatePicker,
  Button,
  Icon,
  Avatar,
  Modal,
  Upload,
  Divider,
  message
} from 'antd';
import Cropper from 'react-cropper';
import moment from 'moment';
import _ from 'lodash';

import './PersonalSetting.css';
import options from './cascader-address-options';
import testAvatar from '../../../../assets/test-avatar.jpg';

const { Content, Sider } = Layout;
const { Item: MenuItem } = Menu;
const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Group: RadioGroup } = Radio;
const { confirm } = Modal;

const fileTypes = ['image/jpeg', 'image/png'];

export default Form.create()(
  class PersonalSetting extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userInfo: {
          avatar: testAvatar,
          username: 'testName',
          introduction: '个人介绍',
          sex: '1',
          hometown: '11,1101,110101'
        },
        // changeAvatar changeInfo changePassword
        pageState: 'changeAvatar',
        modalVisible: false,
        tempImage: ''
      };
    }

    selectMenuItem = ({ selectedKeys }) => {
      this.setState({
        pageState: selectedKeys[0]
      });
    };

    openModal = () => {
      this.setState({
        modalVisible: true
      });
    };

    closeModal = () => {
      const { tempImage } = this.state;
      if (tempImage) {
        const that = this;
        confirm({
          title: '上传的头像还未进行更新，确定取消吗？',
          centered: true,
          onOk() {
            that.setState({
              tempImage: '',
              modalVisible: false
            });
          }
        });
      } else {
        this.setState({
          tempImage: '',
          modalVisible: false
        });
      }
    };

    uploadAvatar = file => {
      const { size, type } = file;
      if (size > 2 * 1024 * 1024) {
        message.error('选择的图片过大，请重新选择');
        return false;
      }
      if (!_.includes(fileTypes, type)) {
        message.error('选择了错误的文件类型，请重新选择');
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.setState({ tempImage: reader.result });
      };
      return false;
    };

    updateAvatar = () => {
      const { userInfo } = this.state;
      // 裁切后直接上传服务器用
      // this.refs.cropper.getCroppedCanvas().toBlob(blob => {
      // });
      this.setState({
        userInfo: {
          ...userInfo,
          avatar: this.refs.cropper.getCroppedCanvas().toDataURL()
        },
        tempImage: '',
        modalVisible: false
      });
    };

    comparePassword = (rule, value, callback) => {
      const {
        form: { getFieldValue }
      } = this.props;
      if (value && value !== getFieldValue('newPassword')) {
        callback('确认的密码与设置的密码不一致');
      }
      callback();
    };

    choosePage = pageState => {
      const {
        form: { getFieldDecorator }
      } = this.props;
      const {
        userInfo: { avatar, username, introduction, sex, hometown },
        modalVisible,
        tempImage
      } = this.state;
      const switchMap = new Map([
        [
          'changeAvatar',
          <div className="ps-avatar-content">
            <Avatar
              src={avatar}
              size={200}
              icon="user"
              style={{ marginBottom: 16 }}
            />
            <span style={{ marginBottom: 16 }}>当前头像</span>
            <Button onClick={this.openModal}>修改头像</Button>
            <Modal
              visible={modalVisible}
              closable={false}
              centered
              destroyOnClose
              keyboard={false}
              maskClosable={false}
              okButtonProps={{ disabled: !tempImage }}
              okText="更新头像"
              onCancel={this.closeModal}
              onOk={this.updateAvatar}
            >
              <Row type="flex" justify="center">
                {tempImage ? (
                  <div className="ps-upload-content">
                    <Cropper
                      className="ps-cropper"
                      src={tempImage}
                      ref="cropper"
                      viewMode={2}
                      background={false}
                      movable={false}
                      zoomable={false}
                      guides={false}
                      toggleDragModeOnDblclick={false}
                      autoCropArea={1}
                      aspectRatio={1}
                      minCropBoxWidth={50}
                      preview=".ps-avatar-preview"
                    />
                    <Divider />
                    <div className="ps-avatar-preview" />
                    <div style={{ marginBottom: 16 }}>效果预览</div>
                    <Upload
                      accept={fileTypes.join()}
                      showUploadList={false}
                      beforeUpload={this.uploadAvatar}
                    >
                      <Button>重新选择一张图片</Button>
                    </Upload>
                  </div>
                ) : (
                  <div className="ps-upload-content">
                    <Upload
                      className="ps-avatar-uploader"
                      accept={fileTypes.join()}
                      listType="picture-card"
                      showUploadList={false}
                      beforeUpload={this.uploadAvatar}
                    >
                      <Icon type="plus" />
                    </Upload>
                    <div>请选择图片上传：支持JPG、PNG格式，需小于5M</div>
                  </div>
                )}
              </Row>
            </Modal>
          </div>
        ],
        [
          'changeInfo',
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ width: 400 }}
          >
            <FormItem label="昵称">
              {getFieldDecorator('nickname', {
                rules: [{ required: true, message: '昵称是必需的' }],
                initialValue: username
              })(<Input />)}
            </FormItem>
            <FormItem label="性别">
              {getFieldDecorator('sex', {
                initialValue: sex
              })(
                <RadioGroup>
                  <Radio value="1">男</Radio>
                  <Radio value="2">女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="简介">
              {getFieldDecorator('introduction', {
                initialValue: introduction
              })(<TextArea />)}
            </FormItem>
            <FormItem label="家乡">
              {getFieldDecorator('hometown', {
                initialValue: hometown.split(',')
              })(<Cascader options={options} placeholder="点击选择" />)}
            </FormItem>
            <FormItem label="生日">
              {getFieldDecorator('birthday')(
                <DatePicker
                  disabledDate={currentDate =>
                    currentDate > moment().endOf('day')
                  }
                  placeholder="点击选择"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem wrapperCol={{ offset: 6 }}>
              <Button type="primary" size="large" style={{ width: '100%' }}>
                修改
              </Button>
            </FormItem>
          </Form>
        ],
        [
          'changePassword',
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ width: 400 }}
          >
            <FormItem label="当前密码">
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '当前密码是必需的' },
                  {
                    pattern: /^[a-zA-Z0-9~!@#$%^&*-_=+]{6,18}$/,
                    message: '密码为字母、数字及一些符号的组合,6到18个字符'
                  }
                ]
              })(<Input type="password" />)}
            </FormItem>
            <FormItem label="新密码">
              {getFieldDecorator('newPassword', {
                rules: [
                  { required: true, message: '新密码是必需的' },
                  {
                    pattern: /^[a-zA-Z0-9~!@#$%^&*-_=+]{6,18}$/,
                    message: '密码为字母、数字及一些符号的组合,6到18个字符'
                  }
                ]
              })(<Input type="password" />)}
            </FormItem>
            <FormItem label="确认密码">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  { required: true, message: '确认密码是必需的' },
                  {
                    pattern: /^[a-zA-Z0-9~!@#$%^&*-_=+]{6,18}$/,
                    message: '密码为字母、数字及一些符号的组合,6到18个字符'
                  },
                  { validator: this.comparePassword }
                ]
              })(<Input type="password" />)}
            </FormItem>
            <FormItem wrapperCol={{ offset: 6 }}>
              <Button type="primary" size="large" style={{ width: '100%' }}>
                修改
              </Button>
            </FormItem>
          </Form>
        ]
      ]);
      return switchMap.get(pageState);
    };

    render() {
      const { pageState } = this.state;
      return (
        <Row className="section">
          <div className="section-content">
            <Row style={{ marginBottom: 24 }}>
              <Link to="/index/personal">
                <Icon type="left" />
                返回个人中心
              </Link>
            </Row>
            <Layout className="ps-content">
              <Sider width={200} style={{ background: '#ffffff' }}>
                <Menu
                  selectedKeys={[pageState]}
                  onSelect={this.selectMenuItem}
                  style={{ height: '100%' }}
                >
                  <MenuItem key="changeAvatar">修改头像</MenuItem>
                  <MenuItem key="changeInfo">修改资料</MenuItem>
                  <MenuItem key="changePassword">修改密码</MenuItem>
                </Menu>
              </Sider>
              <Content style={{ minHeight: 480 }}>
                <Row type="flex" justify="center">
                  {this.choosePage(pageState)}
                </Row>
              </Content>
            </Layout>
          </div>
        </Row>
      );
    }
  }
);