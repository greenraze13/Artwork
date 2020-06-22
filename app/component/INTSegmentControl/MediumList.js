// Copyright (C) 2018 INTUZ. 

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
// ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
// THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import Colors from '../../config/Colors';
import Utility from '../../config/Utility';
import { Color } from 'react-native-facebook-account-kit';

const SegmentIconPosition = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom'
}

const SegmentWidthStyle = {
  Fixed: 'fixed',
  Dynamic: 'dynamic'
}

const SelectionStyle = {
  Box: 'box',
  Stripe: 'stripe'
}

export default class MediumList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrSegment: this.props.arrSegment == undefined ? [] : this.props.arrSegment,
      // isClickable: this.props.isClickable == undefined ? true : this.props.isClickable,
      // selectedIndex: this.props.selectedIndex > this.props.arrSegment.length ? (this.props.arrSegment.length - 1) : (this.props.selectedIndex || 0),
      isShowMediumList: this.props.isShowMediumList,
      selectedMediumIndex: this.props.selectedMediumIndex
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.arrSegment != undefined) {
      this.setState({ 
        arrSegment: nextProps.arrSegment, 
        isShowMediumList: nextProps.isShowMediumList,
        selectedMediumIndex: nextProps.selectedMediumIndex
      })
    }
  }

  componentDidMount() {
  }

  // static defaultProps = {
  //   segmentWidthStyle: SegmentWidthStyle.dynamic, // fixed | dynamic 
  //   segmentWidth: 100, // Will use when segment width style is fixed
  //   segmentIconPosition: SegmentIconPosition.Left,
  //   spaceBetweenIconAndTitle: 10,
  //   spaceBetweenSegment: 5,
  //   segmentStyle: {}, // Optional
  //   isTextOnlySegment: true,
  //   selectionStyle: SelectionStyle.Box,
  //   selectedSegmentStyle: {},
  //   //selectedSegmentColor:'#ffffff40',
  //   selectedSegmentBorderColor: '',

  //   stripeColor: 'white', // seperator color which display selected indicator
  //   stripHeight: 3
  // };

  segmentItemDidSelect(segmentObj, index) {
    this.setState({ selectedIndex: index })
    if (this.props.onSelectionDidChange != undefined) {
      var segmentObj = this.state.arrSegment[index]
      var segmentID = ''
      if (typeof (segmentObj) != 'string') {
        segmentID = segmentObj[this.props.ItemIDKey]
      }
      this.props.onSelectionDidChange(segmentObj, index);
    }
  }

  renderSegmentItem(rowData) {
    var segmentObj = rowData.item;
    var rowIndex = rowData.index;

    return (
        <TouchableOpacity 
            onPress={() => this.segmentItemDidSelect(segmentObj, rowIndex)} 
            activeOpacity={0.95}
            style={{
                paddingVertical: 12,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                flex: 0.5,
                flexDirection: 'column'
            }}
        >
          <Text
              style={{
                  fontWeight: (this.state.selectedMediumIndex == rowIndex)? "bold" : null,
                  textDecorationLine: (this.state.selectedMediumIndex == rowIndex)? 'underline' : 'none',
                  fontSize: (this.state.selectedMediumIndex == rowIndex)? 16 : 14,
                  color: (this.state.selectedMediumIndex == rowIndex)? Colors.black : Colors.grayTextColor
              }}
          >
              {segmentObj.name}
          </Text>
        </TouchableOpacity>
    )
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          position: 'absolute',
          backgroundColor: Colors.white,
          display: (this.state.isShowMediumList) ? "flex" : "none",
          width: Utility.screenWidth,
          // height: (Platform.OS === 'ios') ? Utility.screenHeight - 110 : Utility.screenHeight - 100,
          height: Utility.screenHeight,
          left: 0,
          // top: (Platform.OS === 'ios') ? 110 : 100,
          top: 0
        }}
      >
        <View 
          style={{
            alignItems: 'flex-end',
            // flex: 0.15,
            flexDirection: 'column',
            paddingHorizontal: 10,
            paddingVertical: 20,
            justifyContent: 'flex-end'
          }}
        >
          <Icon name="times" size={24} color={"#000"} onPress={() => this.props.onShowMediumList(false)}></Icon>
        </View>
        <View 
          style={{
              alignItems: 'center', 
              alignSelf: 'center',
              flex: 1,
              flexDirection: 'row',
              paddingVertical: 30
          }}
        >
          <FlatList
              ref={(_listView) => { this.listView = _listView }}
              data={this.state.arrSegment}
              renderItem={this.renderSegmentItem.bind(this)}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              extraData={this.state}
              style={{width: '100%'}}
              numColumns={2}
              bounces={false}
          />
        </View>
      </View>
    );
  }
}
