import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Settings from '../../config/Settings';
import WebClient from '../../config/WebClient';
import Fonts from '../../config/Fonts';
import TopbarView from '../../component/TopbarView';
import SafeAreaView from '../../component/SafeAreaView';
import Spinner from 'react-native-loading-spinner-overlay';
import { List, ListItem } from 'react-native-elements';

class VariantsController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      data: [],
      variants: this.props.variants,
    }

    console.log(JSON.stringify(this.props.variants));
    
  }

  componentDidMount() {
    // console.log("+++++++++++ VariantsController::compoentDidMount is called!!!");
    
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    this.setState({ data: [{'name': 'Size', 'screen': 'AddSizeController'}, {'name': 'Material', 'screen': 'AddMaterialController'}] });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "96%",
          backgroundColor: "#CED0CE",
          marginLeft: "0%"
        }}
      />
    );
  };

  btnBackTapped() {
    Utility.navigator.pop({
      animated: true,
    });
  }

  onChangeSize(value) {
    this.setState({variants: value});
    this.props.onAddVariantsCallBack(value);
  }

  // onChangeMaterial(value) {
  //   this.setState({variants: value});
  //   this.props.onAddMaterialCallBack(value);
  // }

  moveScreen(item) {
    console.log('push!', item.screen);
    Utility.push(item.screen,{
      variants: this.state.variants,
      onAddVariantsCallBack: this.onChangeSize.bind(this),
      // onAddMaterialCallBack: this.onChangeMaterial.bind(this),
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.topViewStyle}>
          <TouchableOpacity onPress={this.btnBackTapped.bind(this)} activeOpacity={0.7}>
            <View style={styles.titleView}>
              <Image source={Images.topBarBackBlue} />
              <Text style={styles.titleTextStyle}>Add DIFFERENT OPTIONS</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.moveScreen(item)}>
                  <ListItem
                    title={item.name}
                    containerStyle={{ borderBottomWidth: 0 }}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.email}
              ItemSeparatorComponent={this.renderSeparator}
              refreshing={this.state.refreshing}
            />
            <View
              style={{
                height: 1,
                width: "96%",
                backgroundColor: "#CED0CE",
                marginLeft: "0%"
              }}
            />
          </List>
        </View>
        <Text>{this.props.size}</Text>
      </SafeAreaView>
    );
  }
}
export default VariantsController
