import React, {PropTypes, Component} from 'react';

import {greatPlaceStyle} from './marker-style.js';

export default class MyMarker extends React.Component {
  static propTypes = {
    text: PropTypes.string
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
       <div style={greatPlaceStyle}>
          {this.props.text}
       </div>
    );
  }
}