import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Breadcrumb, Avatar, Button, Divider } from 'antd';

import './Read.css';
import { ContentTypeDictionary } from '../../../config.js';
import ArticleInfo from './ArticleInfo';
import CommentList from '../../../components/CommentList/CommentList';

const { Item: BreadcrumbItem } = Breadcrumb;

export default class Read extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleInfo: ArticleInfo
    };
  }

  changeArticleLike = () => {
    const { articleInfo } = this.state;
    if (articleInfo.liked) {
      articleInfo.like -= 1;
    } else {
      articleInfo.like += 1;
    }
    articleInfo.liked = !articleInfo.liked;
    this.setState({
      articleInfo
    });
  };

  render() {
    const {
      match: {
        params: { articleId }
      }
    } = this.props;
    const {
      articleInfo: {
        avatar,
        username,
        time,
        contentType,
        articleTitle,
        articleCover,
        articleContent,
        like,
        liked,
        comments
      }
    } = this.state;
    return (
      <div>
        <Row className="section">
          <div className="section-content read-article-content">
            <Breadcrumb className="read-breadcrumb">
              <BreadcrumbItem>
                <Link to="/index/article">测评文章</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                {ContentTypeDictionary[contentType]}
              </BreadcrumbItem>
              <BreadcrumbItem>文章</BreadcrumbItem>
            </Breadcrumb>
            <Row className="read-title">{articleTitle}</Row>
            <Row className="read-info" type="flex" align="middle">
              <span>
                <Avatar src={avatar} icon="user" style={{ marginRight: 8 }} />
                <span>{username}</span>
              </span>
              <span>点赞({like})</span>
              <span>评论({comments})</span>
              <span>{time}</span>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <img
                src={articleCover}
                alt="articleCover"
                style={{ width: '100%' }}
              />
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <div
                className="braft-output-content"
                dangerouslySetInnerHTML={{
                  __html: articleContent
                }}
              />
            </Row>
            <Row type="flex" justify="center" style={{ marginBottom: 32 }}>
              <Button
                type="primary"
                size="large"
                onClick={this.changeArticleLike}
                style={{ padding: '0 40px' }}
              >
                {liked ? '已赞' : '点赞'}
                <Divider type="vertical" />
                {like}
              </Button>
            </Row>
          </div>
        </Row>
        <Row className="section play-comment-content">
          <div className="section-content ">
            <Row className="play-editor-content">
              <CommentList contentId={articleId} />
            </Row>
          </div>
        </Row>
      </div>
    );
  }
}
