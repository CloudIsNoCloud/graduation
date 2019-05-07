import React, { Component } from 'react';
import { Row, Button, message, Empty, Pagination, Avatar, Divider } from 'antd';
import BraftEditor from 'braft-editor';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import './CommentList.css';
import CommentListData from './CommentListData';

const controls = ['bold', 'italic', 'blockquote', 'emoji'];

export default class CommentList extends Component {
  static propTypes = {
    contentId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState(),
      commentList: [],
      // 保存被引用者的id用于请求
      cited: '',
      currentPage: 1
    };
  }

  componentWillMount() {
    this.setState({
      commentList: CommentListData
    });
  }

  changeEditor = editorState => {
    this.setState({
      editorState
    });
  };

  submitComment = () => {
    const { editorState, commentList } = this.state;
    if (editorState.isEmpty()) {
      message.error('请输入评论的内容 (～￣(OO)￣)ブ');
    } else {
      message.success('评论成功 d=====(￣▽￣*)b');
      this.setState({
        editorState: BraftEditor.createEditorState(),
        commentList: [
          {
            userId: 'testUserId12',
            avatar: '',
            username: 'testName',
            time: moment().format('YYYY-MM-DD HH:mm'),
            commentContent: editorState.toHTML(),
            like: 0,
            liked: false
          },
          ...commentList
        ]
      });
    }
  };

  changeCommentLike = index => () => {
    const { commentList, currentPage } = this.state;
    const selectComment = commentList[(currentPage - 1) * 10 + index];
    if (selectComment.liked) {
      selectComment.like -= 1;
    } else {
      selectComment.like += 1;
    }
    selectComment.liked = !selectComment.liked;
    commentList[(currentPage - 1) * 10 + index] = { ...selectComment };
    this.setState({
      commentList
    });
  };

  replyComment = index => () => {
    const { commentList, currentPage } = this.state;
    const selectComment = commentList[(currentPage - 1) * 10 + index];
    this.refs.commentEditor.requestFocus();
    this.setState({
      editorState: BraftEditor.createEditorState(
        `<blockquote><p>引用@${selectComment.username}:</p><p>${
          selectComment.commentContent
        }</p></blockquote><p></p>`
      )
    });
  };

  changePage = page => {
    this.setState({
      currentPage: page
    });
  };

  render() {
    const { editorState, commentList, currentPage } = this.state;
    const hasData = !_.isEmpty(commentList);
    const dataLength = commentList.length;
    const needPagination = dataLength > 10;
    return (
      <div>
        <Row className="comment-editor-content">
          <BraftEditor
            className="comment-editor"
            ref="commentEditor"
            value={editorState}
            controls={controls}
            placeholder="编辑评论内容"
            onChange={this.changeEditor}
          />
          <Row type="flex" justify="end">
            <Button
              type="primary"
              size="large"
              onClick={this.submitComment}
              style={{ padding: '0 40px' }}
            >
              评论
            </Button>
          </Row>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          {hasData ? (
            commentList
              .filter(
                (value, index) =>
                  (currentPage - 1) * 10 <= index &&
                  index <= currentPage * 10 - 1
              )
              .map((value, index) => (
                <Row
                  className="comment-item"
                  key={'comment' + index}
                  type="flex"
                >
                  <Avatar
                    src={value.avatar}
                    size={48}
                    icon="user"
                    style={{ marginRight: 24 }}
                  />
                  <div className="comment-item-right">
                    <Row className="comment-item-info">{`${value.username} | ${
                      value.time
                    }`}</Row>
                    <Row>
                      <div
                        className="braft-output-content"
                        dangerouslySetInnerHTML={{
                          __html: value.commentContent
                        }}
                      />
                    </Row>
                    <Row
                      className="comment-item-action"
                      type="flex"
                      justify="end"
                      align="middle"
                    >
                      <span
                        onClick={this.changeCommentLike(index)}
                        style={{ color: value.liked ? '#ed1c24' : '' }}
                      >
                        {value.liked ? '已赞' : '点赞'}({value.like})
                      </span>
                      <Divider type="vertical" />
                      <span onClick={this.replyComment(index)}>回复</span>
                    </Row>
                  </div>
                </Row>
              ))
          ) : (
            <Empty
              description="还没有评论，快来抢沙发吧 ┑(￣Д ￣)┍"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Row>
        {needPagination ? (
          <Row type="flex" justify="center">
            <Pagination
              pageSize={10}
              total={dataLength}
              onChange={this.changePage}
            />
          </Row>
        ) : null}
      </div>
    );
  }
}