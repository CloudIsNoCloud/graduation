import React, { Component } from 'react';
import { Row, Button, BackTop } from 'antd';

import './Talent.css';
import TalentData from '../TalentData';
import VideoCardList from '../../../components/VideoCardList/VideoCardList';

export default class Talent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoList: TalentData,
      hasMore: true
    };
  }

  showMore = () => {
    const { videoList } = this.state;
    this.setState({
      videoList: [...videoList, ...TalentData],
      hasMore: videoList.length < 30
    });
  };

  render() {
    const { videoList, hasMore } = this.state;
    return (
      <div>
        <Row className="section video-list-content">
          <Row className="section-content">
            <Row>
              <VideoCardList videoList={videoList} />
            </Row>
            <Row type="flex" justify="center">
              {hasMore ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={this.showMore}
                  style={{ padding: '0 40px' }}
                >
                  显示更多
                </Button>
              ) : (
                <span>没有更多了ε=ε=ε=(~￣▽￣)~</span>
              )}
            </Row>
          </Row>
        </Row>
        <BackTop visibilityHeight={0}>
          <div className="ant-back-top-inner">UP</div>
        </BackTop>
      </div>
    );
  }
}
