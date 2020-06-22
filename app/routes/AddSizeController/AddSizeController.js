import React, { Component } from 'react';
import {
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
import SafeAreaView from '../../component/SafeAreaView';
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements';
import TextField from '../../component/TextField';

class AddSizeController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      data: this.props.variants.size,
      text: '',
    }
  }

  componentDidMount() {

  }

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
    // Utility.push("VariantsController");
  }

  addSize() {
    // console.log(this.state.text);
    var s = this.state.text;
    if(s.trim() !=="") {
      // this.props.add(s);
      var res = [{'name': s}];
      this.setState( { data: [...this.state.data, ...res] } );
      this.setState( { text: '' } );
      this.props.onAddVariantsCallBack({size: [...this.state.data, ...res], material: this.props.variants.material});
    }
  }

  delete(item, index) {
    this.props.onAddVariantsCallBack({size: this.state.data.filter(data =>
      data.name !== item.name
    ), material: this.props.variants.material});

    this.setState({data: this.state.data.filter(data =>
      data.name !== item.name
    )});
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.topViewStyle}>
          <TouchableOpacity onPress={this.btnBackTapped.bind(this)} activeOpacity={0.7}>
            <View style={styles.titleView}>
              <Image source={Images.topBarBackBlue} />
              <Text style={styles.titleTextStyle}>Add Size</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.applicationFormInnerContainer}>
          <View style={{flex: 1}}>
            <TextField
              inputStyle={styles.inputText}
              autoCorrect={false}
              placeholder={""}
              selectionColor={Colors.blueType1}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />
          </View>
          <View>
            <Icon
              name='add'
              onPress={() => this.addSize()}
            />
          </View>
        </View>
        <View>
          <View style={{paddingBottom: 10}}>
            <FlatList
              data={this.state.data}
              renderItem={({ item, index }) => (
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex:1, paddingTop:12, paddingBottom:10}}>
                    <Text>
                    {item.name}
                    </Text>
                  </View>
                  <View style={{paddingTop:12, paddingBottom:10}}>
                    <Icon
                      name='delete'
                      onPress={() => this.delete(item, index)}
                    />
                  </View>
                </View>
              )}
              keyExtractor={item => item.email}
              ItemSeparatorComponent={this.renderSeparator}
              refreshing={this.state.refreshing}
            />
          </View>
          {/* <View
            style={{
              height: 1,
              width: "96%",
              backgroundColor: "#CED0CE",
              marginLeft: "0%",
            }}
          /> */}
        </View>
      </SafeAreaView>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     sizes: state.sizeReducer.sizes
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     add: (name) => {
//       dispatch(addSize(name))
//     }
//   }
// }


// const a = connect(mapStateToProps, mapDispatchToProps)(AddSizeController)
// export default a
export default AddSizeController
