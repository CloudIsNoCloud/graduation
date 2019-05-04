import React, { Component } from 'react';
import { Row, Button, BackTop } from 'antd';
import _ from 'lodash';

import './Official.css';
import OfficialData from '../OfficialData';
import VideoList from '../../../components/VideoList/VideoList';

export default class Official extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoList: OfficialData,
      hasMore: true
    };
  }

  showMore = () => {
    const { videoList } = this.state;
    this.setState({
      videoList: [...videoList, ...OfficialData],
      hasMore: videoList.length < 30
    });
  };

  render() {
    const { videoList, hasMore } = this.state;
    const hasData = !_.isEmpty(videoList);
    return (
      <div>
        <Row className="section">
          <div className="section-content">
            <Row>
              <VideoList videoList={videoList} />
            </Row>
            {hasData ? (
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
            ) : null}
          </div>
        </Row>
        <BackTop visibilityHeight={0}>
          <div className="ant-back-top-inner">UP</div>
        </BackTop>
      </div>
    );
  }
}
