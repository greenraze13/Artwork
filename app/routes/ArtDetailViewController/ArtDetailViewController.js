import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ListView,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  NativeModules,
  Share,
  ScrollView
} from 'react-native';
import styles from './styles'
import Utility from '../../config/Utility';
import Images from '../../config/Images';
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';
import Colors from '../../config/Colors';
import Spinner from 'react-native-loading-spinner-overlay';
import INTButton from '../../component/INTButton'
import WebClient from '../../config/WebClient';
import WebClientChat from '../../config/WebClientChat';
import { Settings } from '../../config/Settings';
import Fonts from '../../config/Fonts';
import ModalBox from 'react-native-modalbox';
import TagView from '../../component/TagView';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

var UtilityController = NativeModules.UtilityController;


const sports = [
  {
      label: 'Football',
      value: 'football',
  },
  {
      label: 'Baseball',
      value: 'baseball',
  },
  {
      label: 'Hockey',
      value: 'hockey',
  },
];

class ArtDetailViewController extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {
      firstTextInput: null,
      favSport0: null,
      favSport1: null,
      lastTextInput: null,
    };

    this.state = {
      spinnerVisible: false,
      artwork: undefined,
      artwork_id: this.props.artwork_id,
      from: this.props.from,
      // isMyArtwork: true,
      isAbuseDescriptionVisible: false,
      textAbuseDescription: '',
      arrTagsHorizontal: [],
      isFromHomeScreen: this.props.isFromHomeScreen == undefined ? false : this.props.isFromHomeScreen,
      isDataReceived: false,
      is_product_sold: 0,
      sizeModalVisible: false,
      messageModalVisible: false,
      sizeName: '',
      artwork_variants: [],
      price: 0,
      selected_variants_id: 0,
      favSport2: undefined,
      isFavorite: false,
      messageText: "",
      messageSentModalVisible: false
    }
  }

  componentDidMount() {
    this.setState({ spinnerVisible: true });
    setTimeout(() => {
      this.callArtworkDetailAPI()
    }, 900);
  }

  onCancelAbuseTapped() {
    this.setState({ isAbuseDescriptionVisible: false })
  }

  onSubmitAbuseTapped() {
    if (this.state.textAbuseDescription.trim().length > 0) {
      this.callReportArtworkAPI()
    } else {
      Utility.showToast(Utility.MESSAGES.please_enter_des)
    }
  }

  showAbuseView() {
    var sizeModelbox = <ModalBox
      coverScreen={false}
      backdropPressToClose={false}
      swipeToClose={false}
      backButtonClose={false}
      onClosed={() => this.setState({ isAbuseDescriptionVisible: false })}
      style={styles.modalContainer}
      isOpen={this.state.isAbuseDescriptionVisible}
      position='center'>
      <View style={styles.joinViewContainer}>
        <View style={styles.abuseInnerContainerView}>
          <TextInput
            style={Utility.isPlatformAndroid ? styles.joinTextInputAndroid : styles.joinTextInput}
            // style={ styles.joinTextInput}
            multiline={true}
            onChangeText={(textAbuseDescription) => this.setState({ textAbuseDescription })}
            value={this.state.textAbuseDescription}
            placeholder={"Please describe the problem here"}
            placeholderTextColor='lightgray'
          />
          <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
            <INTButton buttonStyle={styles.abuseButtonStyle}
              title='Cancel'
              titleStyle={styles.abuseButtonTextStyle}
              onPress={() => this.onCancelAbuseTapped()}
            />
            <INTButton buttonStyle={styles.abuseButtonStyle}
              title='Submit'
              titleStyle={styles.abuseButtonTextStyle}
              onPress={() => this.onSubmitAbuseTapped()}
            />
          </View>
        </View>
      </View>
    </ModalBox >
    return sizeModelbox;
  }

  //API
  addToCartAPI(navigateToCart) {
    this.setState({ spinnerVisible: true });
    WebClient.postRequest(Settings.URL.ADD_TO_CART_V2, {
      'user_id': Utility.getUserId(),
      'artwork_id': this.state.artwork != undefined ? this.state.artwork.artwork_id + '' : '',
      'quantity': 1 + '',// default 
      'cart_id': 0 + '',// 0 for new add 
      'unique_device_id': Utility.deviceId + '',
      'selected_variants_id': this.state.selected_variants_id,
    }, (response, error) => {
      this.setState({ spinnerVisible: false });
      if (error == null) {
        if(response.status == 1) {

          Utility.showToast(Utility.MESSAGES.added_to_cart);
          var tempArtwork = { ...this.state.artwork };
          tempArtwork.is_incart = 1;
          tempArtwork.cart_id = response.cart_id
          this.setState({ artwork: tempArtwork });

          if (navigateToCart == true) {
            Utility.push('CartViewController')
          }

        } else {
          Utility.showToast(response.message);
        }
      } else {
        Utility.showToast(error.message);
      }
    }, true);
  }

  callReportArtworkAPI() {
    this.setState({ spinnerVisible: true });
    WebClient.postRequest(Settings.URL.REPORT_ARTWORK, {
      'user_id': Utility.user.user_id + '',
      'artwork_id': this.state.artwork != undefined ? this.state.artwork.artwork_id + '' : '',
      'description': this.state.textAbuseDescription + ''
    }, (response, error) => {
      this.setState({ spinnerVisible: false });
      if (error == null) {
        Utility.showToast(Utility.MESSAGES.report_added)
        var tempArtwork = this.state.artwork
        tempArtwork.is_reported = 1
        this.setState({ isAbuseDescriptionVisible: false, artwork: tempArtwork })
      } else {
        Utility.showToast(error.message);
      }
    });
  }

  btnBuyNowTapped() {
    if (Utility.user == undefined) {
      Utility.showLoginAlert(() => {
        Utility.closeSideMenu();
        // Utility.resetTo('SigninController')
        Utility.push('SigninController', {
          isFromNotLogin: true,
          onNavigationCallBack: this.onNavigationCallBack.bind(this)
        })
      });
    } else {
      if (this.state.artwork != undefined) {
        if (this.state.artwork.is_incart == 1) {
          Utility.push('CartViewController')
        } else {
          this.addToCartAPI(true)
        }
      }
    }
  }


  onNavigationCallBack(params) {
    if (params.isSuccess == true) {
      this.callArtworkDetailAPI();
    }
  }

  btnAddToCartTapped() {
    // if (Utility.user == undefined) {
    //   Utility.showLoginAlert();
    // } else {
    if (this.state.artwork != undefined) {
      if (this.state.artwork.is_incart == 1 && this.state.artwork_variants.length == 1) {
        Utility.showToast(Utility.MESSAGES.already_in_cart);
      } else {
        this.addToCartAPI(false)
      }
    }
    // }
  }

  backBtnTaaped() {
    if (this.state.isFromHomeScreen == true) {
      this.props.childScreenCallback(this.state.artwork)
    }

    Utility.navigator.pop({
      animated: true,
    });
  }

  btnReportTapped() {
    if (Utility.user == undefined) {
      Utility.showLoginAlert();
    } else {
      if (this.state.artwork != undefined) {
        if (this.state.artwork.is_reported == 0) {
          this.setState({ isAbuseDescriptionVisible: true })
        }
      }
    }
  }

  btnFavoriteTapped(flag) {
    if (Utility.user == undefined) {
      Utility.showLoginAlert(() => {
          Utility.closeSideMenu();
          // Utility.resetTo('SigninController')
          Utility.push('SigninController', {
              isFromNotLogin: true,
              onNavigationCallBack: this.onNavigationCallBack.bind(this)
          })
      });
    } else {
      this.setState({ spinnerVisible: true });
      WebClient.postRequest(Settings.URL.SAVE_ARTWORK, {
        'user_id': Utility.getUserId(),
        'artwork_id': this.state.artwork != undefined ? this.state.artwork.artwork_id + '' : '',
        'artist_id': this.state.artwork.artist_id
      }, (response, error) => {
          this.setState({ spinnerVisible: false, ModalVisible: false });
          if (error == null) {
            this.setState({
              isFavorite: flag
            });
          } else {
              Utility.showToast(error.message);
          }
      });
    }
  }

  onShareTapped = async () => {
    let artwork = this.state.artwork;
    // console.log("=======", JSON.stringify(artwork));
    var shareContent = "Artwork name : " + artwork.title + "\n\n";
    shareContent = shareContent + "Artist name : " + artwork.full_name + "\n\n";
    if (artwork.artwork_photos) {
        if (artwork.artwork_photos.length > 0) {
            shareContent = shareContent + artwork.artwork_photos[0].image_path + "\n\n";
        }
    }
    // shareContent = shareContent + artwork.description;
    shareContent = shareContent + "App URL : http://onelink.to/6jw36a";
    UtilityController.shareRefLink(shareContent);
//     const msg = `
//       <html>
//         <head>
//         </head>
//         <body>
//           <h1>React Native | A framework for building native apps using React</h1>
//           <br />
//           <img src="${artwork.artwork_photos[0].image_path}" width="100" height="100" />
//         </body>
//       </html>`;
//     try {
//       const result = await Share.share({
//         message: msg
//       }, {
//         tintColor: 0x056ecf,
//         excludedActivityTypes: []
//       });
      
// console.log("+++++++++++", JSON.stringify(result));
//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           // shared with activity type of result.activityType
//         } else {
//           // shared
//         }
//       } else if (result.action === Share.dismissedAction) {
//         // dismissed
//       }
//     } catch (error) {
//       alert(error.message);
//     }
  }
  //API
  callArtworkDetailAPI() {
    this.setState({ spinnerVisible: true });
    var params = {
      'user_id': Utility.getUserId(),
      'artwork_id': this.state.artwork_id + '',
      'unique_device_id': Utility.deviceId + '',
    };
    WebClient.postRequest(Settings.URL.GET_ARTWORK_DETAIL_V2, params, (response, error) => {
      this.setState({ spinnerVisible: false });
      if (error == null) {
        if (response) {
// console.log(JSON.stringify(response));
          var l_sizeName = '';
          var l_price = 0;
          var l_artwork_variants = [{id: 0, name: response.size, price: response.price, isRepeatable: response.is_repeatable, quantity: response.quantity}, ...response.artwork_variants];
          
          if(l_artwork_variants.length > 0) {
            l_sizeName = l_artwork_variants[0].name;
            l_price = l_artwork_variants[0].price;
          } else {
            l_sizeName = response.size;
            l_price = response.price;
          }

          this.setState({
            artwork: response,
            is_product_sold: response.is_product_sold,
            arrTagsHorizontal: response.tags,
            isMyArtwork: (response.artist_id == Utility.getUserId),
            isDataReceived: true,
            sizeName: l_sizeName,
            artwork_variants: l_artwork_variants,
            price: l_price,
            isFavorite: response.is_saved,
          })
        }
      } else {
        Utility.showToast(error.message);
      }
    }, true);
  }
  artImageTapped(click_index) {
    if (this.state.artwork != undefined) {
      if (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 0) {
        Utility.push('ImageFullScreenViewController', { artwork_photos: this.state.artwork.artwork_photos, click_index: click_index })
      }
    }
  }
  renderItem(rowData) {
    var artImageItem = rowData.item;
    var click_index = rowData.index;
    var commentMedia = null;
    commentMedia = <View>
      <TouchableOpacity onPress={this.artImageTapped.bind(this, (click_index + 1))} activeOpacity={0.7}>
        {/* <ProgressiveImage
          style={styles.artImageView}
          placeholderStyle={styles.artPhotoPlaceHolderPhoto}
          uri={artImageItem.image_path}
          placeholderSource={Images.placeholderMediaImage}
          borderRadius={1} /> */}
        <CachedImage
          style={styles.artImageView}
          source={{
            uri: artImageItem.thumb_name
          }}
          fallbackSource={Images.placeholderMediaImage}
        />
      </TouchableOpacity>
    </View>

    return (<View style={{ marginBottom: 2 }}>
      {commentMedia}
    </View>
    );
  }

  onArtistProfileClick() {
    if (this.state.artwork != undefined) {
      Utility.push('ArtistDetailViewController', { artist_id: this.state.artwork.artist_id });
    }
  }

  onChatTapped() {
    // var reqParam = {
    //     isFromCommissionScreen: false,
    //     receiverId: this.state.artwork.artist_id,
    //     receiverName: this.state.artwork.full_name,
    //     isCustomJobChat: 0,
    //     artwork_id: this.state.artwork.artwork_id,
    //     commissionRequestId: 0,
    // }
    // Utility.push('MessageToArtistViewController', reqParam)
    this.setState({
      messageModalVisible: true,
      messageSentModalVisible: true
    })
  }

  onHandleSendMsg() {
    var dictParam = {};
    dictParam.user_id = Utility.user.user_id + '';
    dictParam.receiver_id = this.state.artwork.artist_id + '';
    dictParam.message = `This is a question for your post ${this.state.artwork.title}:
${this.state.messageText}`;
    dictParam.msg_type = 1 + '';
    dictParam.filename = '';
    dictParam.is_custom_job_chat =  1;
    dictParam.artwork_id = this.state.artwork.artwork_id + '';
    dictParam.commission_request_id = 0;

    if(this.state.messageText.trim() != "") {
      WebClientChat.postRequest(Settings.URL.ADD_MESSAGE_WITH_ARTIST, dictParam, (response, error) => {
        this.setState({ spinnerVisible: false });
        if (error == null) {
            if (response.status == 1) {
                this.setState({
                  messageModalVisible: false,
                  // messageSentModalVisible: true,
                  messageText: ""
                });
                Utility.showToast(Utility.MESSAGES.message_sent)
            }
        } else {
            Utility.showToast(error.message);
        }
      });
    } else {
      Utility.showToast(Utility.MESSAGES.please_enter_message)
    }
  }

  render() {
    const { onScroll = () => { } } = this.props;

    var messageModalbox = <ModalBox
        coverScreen={true}
        swipeToClose={true}
        backdropPressToClose={true}
        backButtonClose={true}
        onClosed={() => this.setState({ messageModalVisible: false })}
        style={styles.messageModalContainer}
        isOpen={this.state.messageModalVisible}
        position='center'>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.modalHeaderTextStyle]}>Ask the artist a question.</Text>
                {/* <TouchableOpacity onPress={() => this.setState({messageModalVisible: false})} activeOpacity={0.7}>
                    <Text style={styles.closeTextStyle} >Close</Text>
                </TouchableOpacity> */}
            </View>
            <View>
              <TextInput 
                defaultValue={this.state.messageText}
                onChangeText={(text) => {
                    this.setState({messageText: text})
                  }
                }
                multiline={true} 
                style={{width: "100%", height: 44, borderColor: Colors.grayBorderColor, borderWidth: 1,}} />
            </View>
            <View style={{ marginTop: 5, flex: 1, alignItems: 'center', paddingVertical: 10 }}>
              <INTButton buttonStyle={{ backgroundColor: Colors.blueType1, justifyContent: 'center' }}
                  title='Send'
                  titleStyle={{ color: 'white' }}
                  onPress={() => this.onHandleSendMsg()}
              />
            </View>
        </View>
        
    </ModalBox >

    var messageSentbox = <ModalBox
        coverScreen={true}
        swipeToClose={true}
        backdropPressToClose={true}
        backButtonClose={true}
        onClosed={() => this.setState({ messageSentModalVisible: false })}
        style={styles.messageSentModalContainer}
        isOpen={this.state.messageSentModalVisible}
        position='center'>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.modalHeaderTextStyle]}>Info</Text>
                <TouchableOpacity onPress={() => this.setState({messageSentModalVisible: false})} activeOpacity={0.7}>
                    <Text style={styles.closeTextStyle} >Close</Text>
                </TouchableOpacity>
            </View>
            <View>
              <Text>Your message has been sent to the artist. Check your message inbox for the response.</Text>
            </View>
        </View>

      </ModalBox >
   
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableOpacity 
          onPress={() => this.backBtnTaaped()} 
          activeOpacity={1}
        >
          <View
            style={{
              flexDirection: 'row', 
              height: STICKY_HEADER_HEIGHT, 
              backgroundColor: Colors.white,
              alignContent: 'center',
              alignItems: 'flex-end',
              marginBottom: 3
            }}
          >
            <View 
              style={{
                flexDirection: 'row', 
                width: '90%',
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <View>
                {/* <Image source={Images.topBarBackTransparentBlack} /> */}
                <Icon name="caret-left" size={30} color="#000" style={{paddingLeft: 5}} />
              </View>
              <View style={{width: "90%", justifyContent: 'center'}}>
                <Text 
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{
                    color: Colors.black,
                    fontSize: Utility.NormalizeFontSize(20),
                    marginLeft: 10,
                    alignContent: 'center',
                    textAlign: 'center',
                    fontFamily: Fonts.promptRegular
                  }}
                >
                  {this.state.artwork != undefined ? this.state.artwork.title : ""}
                </Text>
              </View>
            </View>
            <View style={parallaxStyles.fixedSectionReportButtonContainer}>
            {
              this.state.from == 'SOLD' ?
                null :
                <TouchableOpacity onPress={() => this.btnReportTapped()} activeOpacity={1}>
                  {/* <Image source={this.state.artwork != undefined ? (this.state.artwork.is_reported == 0 ? Images.reportFlagBlack : Images.reportFlagRed) : null} /> */}
                  <Icon style={{paddingRight: 5}} name="flag" size={20} color={this.state.artwork != undefined ? (this.state.artwork.is_reported == 0 ? "#000" : "#f00") : null} />
                </TouchableOpacity>
            }
            </View>
          </View>
        </TouchableOpacity>
        <View style={{borderTopColor: Colors.black, borderWidth: 0.5}}></View>
        <ScrollView>
          <TouchableOpacity onPress={this.artImageTapped.bind(this, 0)} activeOpacity={0.7}>
            <View style={{ width: Utility.screenWidth, height: PARALLAX_HEADER_HEIGHT }}>
              
              <View style={{zIndex: 1000, position: "absolute", alignSelf: "flex-end", marginTop: 10}}>
                <View style={{flexDirection: "row"}}>
                  {
                    (this.state.isFavorite == false) ?   
                      <TouchableOpacity onPress={() => this.btnFavoriteTapped(true)} activeOpacity={1}>
                        <Image source={Images.articleFavoriteNonSelectIcon} style={{marginRight: 10}} />
                      </TouchableOpacity>
                    :
                      <TouchableOpacity onPress={() => this.btnFavoriteTapped(false)} activeOpacity={1}>
                        <Image source={Images.articleFavoriteSelectIcon} style={{marginRight: 10}} />
                      </TouchableOpacity>
                  }
                  <TouchableOpacity onPress={() => this.onShareTapped()} activeOpacity={1}>
                    <Image source={Images.articleShareBlueIcon} style={{marginRight: 10}} />
                  </TouchableOpacity>
                </View>
              </View>

              <LinearGradient colors={['#85A2B7', '#b4c8d7', '#dae4eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{flex: 1}}>
                <ProgressiveImage
                  style={{
                    width: Utility.screenWidth,
                    height: PARALLAX_HEADER_HEIGHT
                  }}
                  // uri={this.state.artwork != undefined ? (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 0) ? (this.state.artwork.artwork_photos[0]).image_path : null : null}   // conmmented by Wang Jan/22/2019
                  uri={this.state.artwork != undefined ? (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 0) ? (this.state.artwork.artwork_photos[0]).midsize_name : null : null}
                  placeholderSource={Images.placeholderMediaImage}
                  onPress={this.artImageTapped.bind(this, 0)}
                  backgroundColor={'#696d23'}   // added by wang Jan/22/2019
                />
              </LinearGradient>
            </View>
          </TouchableOpacity>
          
          {this.state.artwork != undefined ?
            (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 1) ?
              <View style={{ height: 120, marginTop: 20, marginBottom: 10 }}>
                <FlatList //associated additional artwork horizontal list.
                  style={{ marginHorizontal: 10, }}
                  ItemSeparatorComponent={() => { return <View style={{ backgroundColor: 'transparent', width: 8, height: 80 }} /> }}
                  data={this.state.artwork != undefined ? (this.state.artwork.artwork_photos.length > 1 ? this.state.artwork.artwork_photos.filter((_, i) => i !== 0) : []) : []}
                  horizontal={true}
                  renderItem={this.renderItem.bind(this)}
                  keyExtractor={(item, index) => index + ''}
                  showsHorizontalScrollIndicator={false}
                />
              </View> :
              null :
            null}
          {this.state.isDataReceived ?
            <View style={this.state.artwork != undefined ? (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 1) ? styles.artDetail : [styles.artDetail, { marginTop: 20 }] : [styles.artDetail, { marginTop: 20 }]}>
              <View style={styles.artistProfile}>
                <View>
                  <TouchableOpacity onPress={() => this.onArtistProfileClick()} activeOpacity={0.9}>
                    <ProgressiveImage
                      style={styles.artistProfilePhoto}
                      placeholderStyle={styles.artistPlaceHolderPhoto}
                      uri={this.state.artwork != null ? (this.state.artwork.profile_pic_thumb != "" ? this.state.artwork.profile_pic_thumb : undefined) : undefined}
                      placeholderSource={Images.input_userphoto}
                      borderRadius={1} />
                  </TouchableOpacity>
                </View>
                <View style={styles.artistProfileNameView}>
                  {/* <Text style={styles.artNameTextStyle}>{this.state.artwork != undefined ? this.state.artwork.title : ""}</Text> */}
                  {
                    (this.state.artwork.businessname.trim() != "") ? 
                      <View style={styles.artistNameProfile}>
                        <Text style={[styles.artistNameTextStyle, {fontWeight: "bold"}]} ellipsizeMode={"tail"}>{this.state.artwork != undefined ? this.state.artwork.businessname.trim() : ""}</Text>
                      </View>
                    : null
                  }
                  {
                    // (this.state.artwork.full_name.length + this.state.artwork.preferred_medium.length < 25) ? 
                    //   <View style={styles.artistNameProfile}>
                    //     <Text style={styles.artistNameTextStyle}>{this.state.artwork != undefined ? this.state.artwork.full_name : ""}</Text>
                    //     <Text style={styles.artistArtworkStyleTextStyle}>{this.state.artwork != undefined ? this.state.artwork.preferred_medium : ""}</Text>
                    //   </View>
                    // : 
                      <React.Fragment>
                        <View style={styles.artistNameProfile}>
                          <View style={{flex:1}}>
                            <Text style={styles.artistNameTextStyle} ellipsizeMode={"tail"}>{this.state.artwork != undefined ? this.state.artwork.full_name : ""}</Text>
                          </View>
                          {
                            (Utility.user != undefined) ? 
                            <View style={{marginLeft: 0, marginTop: -5, flexDirection: "row-reverse"}}>
                              <INTButton buttonStyle={styles.btnChat}
                                icon={Images.chat}
                                title="Chat"
                                titleStyle={styles.titleChat}
                                spaceBetweenIconAndTitle={0}
                                onPress={() => this.onChatTapped()} />
                            </View>
                            : null
                          }
                        </View>
                        <View style={styles.artistNameProfile}>
                          <Text style={styles.artistArtworkStyleTextStyle}>{this.state.artwork != undefined ? this.state.artwork.preferred_medium : ""}</Text>
                        </View>
                      </React.Fragment>
                  }
                </View>
              </View>
              {/* {
                (this.state.artwork.full_name.length > 20) ? 
                  <View style={styles.artistNameProfile}>
                    <Text style={styles.artistNameTextStyle}>{this.state.artwork != undefined ? this.state.artwork.full_name : ""}</Text>
                    <Text style={styles.artistArtworkStyleTextStyle}>{this.state.artwork != undefined ? this.state.artwork.preferred_medium : ""}</Text>
                  </View>
                : null
              } */}
              <View style={{flexDirection: 'row'}}>
                <View style={{flex:1}}>
                  <View style={styles.artInfoDetail}>
                    <Text style={[styles.artInfoTextStyle, { flex: 1.2, alignSelf: 'center' }]}>Project Type:</Text>
                  </View>
                  <View style={styles.artInfoDetail}>
                    <Text style={styles.artInfoNestedTextStyle}>{this.state.artwork != undefined ? this.state.artwork.project_type : ""}</Text>
                  </View>                
                </View>
                <View style={{flex:1, paddingLeft:10}}>
                  {/* <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'center' }]}>Size: <Text style={styles.artInfoNestedTextStyle}>{this.state.artwork != undefined ? this.state.artwork.size : ""}</Text></Text> */}
                  {
                    this.state.artwork_variants.length <= 1 ?
                      <View>
                        <View style={styles.artInfoDetail}>
                          <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'center' }]}>Size: </Text>
                        </View>
                        <View>
                          <Text style={[styles.artInfoNestedTextStyle, {paddingTop: 8}]}> {this.state.sizeName} </Text>
                        </View>
                      </View>
                    : 
                    <View style={{flex: 1, paddingTop: 10}}>
                    <View style={{flex: 1}}>
                      <Text style={[styles.artInfoTextStyle, {paddingLeft: 5}]}>Size:</Text>
                    </View>
                    <View style={{flex:4, flexDirection: 'row'}}>
                      <Text style={[styles.artInfoNestedTextStyle, {flex: 1, borderWidth: 1, borderColor: Colors.blueType1, borderRadius: 6, padding: 3}]} onPress={() => this.sizeClick()}>
                        {this.state.sizeName}
                      </Text>
                      <View
                          style={{
                              backgroundColor: 'transparent',
                              borderTopWidth: 10,
                              borderTopColor: Colors.blueType1,
                              borderRightWidth: 10,
                              borderRightColor: 'transparent',
                              borderLeftWidth: 10,
                              borderLeftColor: 'transparent',
                              marginTop: 10,
                              marginLeft: -30,
                              width: 0,
                              height: 0,
                          }}
                        />
                    </View>
                  </View>
                  }
                </View>
              </View>
              {
                this.state.artwork != undefined ?
                  (this.state.artwork.is_delivery == 0 && this.state.artwork.is_shipping == 0 && this.state.artwork.is_pickup == 0) ?
                    null :
                    < Text style={[styles.artInfoTextStyle, { marginTop: 20, flex: 1, alignSelf: 'flex-start', fontFamily: Fonts.promptRegular, }]} > Delivery Options</Text>
                  : null
              }
              <View style={[styles.artInfoDetail, { alignSelf: 'center', marginTop: 4 }]}>
                {this.state.artwork != undefined ?
                  this.state.artwork.is_shipping == 1 ?
                    <View style={{ flex: 1, marginEnd: 2 }}>
                      <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Shipping</Text>
                      <Text style={[styles.artInfoNestedTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>{Utility.DOLLOR}{this.state.artwork != undefined ? Utility.parseFloat(this.state.artwork.shipping_cost) : ""}</Text>
                    </View>
                    : null : null
                }
                {this.state.artwork != undefined ?
                  this.state.artwork.is_delivery == 1 ?
                    <View style={{ flex: 1, marginEnd: 2 }}>
                      <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Delivery</Text>
                      <Text style={[styles.artInfoNestedTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>{Utility.DOLLOR}{this.state.artwork != undefined ? Utility.parseFloat(this.state.artwork.delivery_cost) : ""}</Text>
                    </View>
                    : null : null
                }
                {this.state.artwork != undefined ?
                  this.state.artwork.is_pickup == 1 ?
                    <View style={{ flex: 1, marginEnd: 2 }}>
                      <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Pickup</Text>
                      <Text style={[styles.artInfoNestedTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Free</Text>
                    </View>
                    : null : null
                }
              </View>
              {/* added by Wang - start */}
              {this.state.artwork != undefined ?
                  this.state.artwork.is_pickup == 1 ?
                    <View style={{ flex: 1, marginEnd: 2, marginLeft:5 }}>
                      <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Pickup Address</Text>
                      <Text style={[styles.artInfoNestedTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>{this.state.artwork.pickup_address}</Text>
                    </View>
                    : null : null
              }
              {/* added by Wang - end */}
              <Text style={[styles.artDescriptionTextStyle, { marginTop: 20 }]}>{this.state.artwork != undefined ? this.state.artwork.description : ""}</Text>

              {/* {As per clinet comment remove Tags} */}
              {/* <View style={styles.artTagsView}>
                <Text style={[styles.artInfoTextStyle, { marginTop: 5, marginBottom: 5 }]}>Tags</Text>
                <TagView
                  ref={(tagView) => (this._tagView = tagView)}
                  horizontal={true}
                  isEditable={false}
                  tags={this.state.arrTagsHorizontal}
                  tagTextStyle={styles.tagTextStyle}
                  tagContainerStyle={{ backgroundColor: Colors.grayType1, borderColor: Colors.blueType1, borderWidth: 0, fontSize: Utility.NormalizeFontSize(10), }}
                  maxHeight={120}
                  inputDefaultWidth={100}>
                </TagView>
              </View> */}
            </View>
            : null}
          <Spinner visible={this.state.spinnerVisible} />
        </ScrollView>
        {
          this.state.isDataReceived ?
            <View style={[styles.addToCartBuyNowView, { marginLeft: 10, marginRight: 5 }]}>
              {/* Button Add to Cart */}
              {this.state.from == 'CART' || this.state.from == 'SOLD' || this.state.is_product_sold == 1 ?
                null
                :
                // <INTButton buttonStyle={styles.btnAddToCart} title={(this.state.artwork != undefined && this.state.artwork.is_incart == 1) ? "Added to Cart" : " Add to Cart "}
                //   titleStyle={styles.textAddToCart}
                //   spaceBetweenIconAndTitle={0}
                //   onPress={() => this.btnAddToCartTapped()} />
                <INTButton buttonStyle={styles.btnAddToCart} title={" Add to Cart "}
                  titleStyle={styles.textAddToCart}
                  spaceBetweenIconAndTitle={0}
                  onPress={() => this.btnAddToCartTapped()} />
              }
              {/*Button Price*/}
              {this.state.is_product_sold == 1 ?
                <INTButton buttonStyle={[styles.btnPrice, { borderColor: Colors.transparent, }]}
                  title={"SOLD"}
                  titleStyle={styles.soldText}
                  spaceBetweenIconAndTitle={0} />
                :
                <INTButton buttonStyle={styles.btnPrice}
                  title={Utility.DOLLOR + (this.state.artwork != undefined ? Utility.parseFloat(this.state.price) + '' : "0")}
                  titleStyle={styles.textPrice}
                  spaceBetweenIconAndTitle={0} />
              }
              {/*Button Buy Now*/}
              {this.state.from == 'CART' || this.state.from == 'SOLD' || this.state.is_product_sold == 1 ?
                null
                :
                <INTButton buttonStyle={styles.btnAddToCart} title="  Buy Now  "
                  titleStyle={styles.textAddToCart}
                  spaceBetweenIconAndTitle={0}
                  onPress={() => this.btnBuyNowTapped()} />
              }
            </View>
            : null
        }
        {this.showAbuseView()}
        {this.sizeModal()}
        {/* {messageSentbox} */}
        {messageModalbox}
      </View >
    );
  }

  sizeModal() {
    // console.log("+++++++++++++++++++++++++" + JSON.stringify(this.state.artwork));
    
    var sizeModelbox = <ModalBox
        coverScreen={true}
        backdropPressToClose={false}
        swipeToClose={false}
        backButtonClose={true}
        onClosed={() => this.setState({ sizeModalVisible: false })}
        style={styles.sizeModalContainer}
        isOpen={this.state.sizeModalVisible}
        position='bottom'>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.modalHeaderTextStyle]}>Select Size</Text>
                <TouchableOpacity onPress={this.sizePopUpClose.bind(this)} activeOpacity={0.7}>
                    <Text style={styles.closeTextStyle} >Close</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                style={{ marginTop: 5 }}
                data={this.state.artwork_variants}
                keyExtractor={(item, index) => index + ''}
                renderItem={({ item, index }) =>
                    <View style={{ marginHorizontal: 8 }} >
                        <Text style={styles.modalTextStyle} onPress={this.sizeItemClick.bind(this, item)} >
                            {item.name}
                        </Text>
                        <View style={styles.viewBottom} />
                    </View>}
                numColumns={1}
            />
        </View>
    </ModalBox >
    return sizeModelbox;
  }

  sizeClick() {
    Utility.hideKeyboard();
    this.setState({ sizeModalVisible: true });
  }

  sizeItemClick(item) {
    this.setState({
        sizeName: item.name,
        price: item.price,
        sizeModalVisible: false,
        selected_variants_id: item.id,
    });
  }
  sizePopUpClose() {
      this.setState({ sizeModalVisible: false });
  }

}

// const PARALLAX_HEADER_HEIGHT = 220;
const PARALLAX_HEADER_HEIGHT = Utility.screenHeight * 0.6;
const STICKY_HEADER_HEIGHT = Utility.isPlatformAndroid ? 50 : 64;

const parallaxStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Utility.screenWidth,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: Utility.screenWidth,
    justifyContent: 'flex-end',
    marginEnd: 6,
  },
  stickySectionText: {
    color: 'white',
    fontSize: Utility.NormalizeFontSize(20),
    marginVertical: 6,
    marginLeft: 40,
    alignContent: 'flex-start',
    fontFamily: Fonts.promptRegular
  },
  fixedSection: {
    flex: 1,
    bottom: 10,
    left: 10,
    width: Utility.screenWidth - 20,
    flexDirection: 'row',
  },
  fixedSectionBackButtonContainer: {
    flex: 1,
    width: 20
  },
  fixedSectionReportButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 20,
    alignContent: 'center',
    alignItems: 'center',
    paddingBottom: 5
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 5
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: Utility.NormalizeFontSize(12),
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: Colors.blueType1,
      borderRadius: 4,
      color: Colors.blueType1,
      paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
      fontSize: Utility.NormalizeFontSize(12),
      paddingVertical: 6,
      paddingHorizontal: 10,
      // borderWidth: 0.5,
      // borderColor: 'red',
      // borderRadius: 4,
      color: Colors.blueType1,
      paddingRight: 30, // to ensure the text is never behind the icon
  },
});


export default ArtDetailViewController;