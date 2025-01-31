import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Image, TextInput, ScrollView, FlatList, } from 'react-native';
import styles from './styles';
import Images from '../../config/Images';
import Colors from '../../config/Colors';
import TextField from '../../component/TextField'
import SafeAreaView from '../../component/SafeAreaView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import INTButton from '../../component/INTButton'
import User from '../../models/User';
import Utility from '../../config/Utility';
import Fonts from '../../config/Fonts';
import ProgressiveImage from '../../component/ProgressiveImage';
import Spinner from 'react-native-loading-spinner-overlay';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import ModalBox from 'react-native-modalbox';
import RNGooglePlaces from 'react-native-google-places';
import RNAccountKit, { Color, StatusBarStyle } from 'react-native-facebook-account-kit'
var ImagePicker = require('react-native-image-picker');
import { RNS3 } from 'react-native-aws3';
// var RNFS = require('react-native-fs');
import RNFetchBlob from 'react-native-fetch-blob'


const stateList = [
    {code: "AL", name: "Alabama"},
    {code: "AK", name: "Alaska"},
    {code: "AZ", name: "Arizona"},
    {code: "AR", name: "Arkansas"},
    {code: "CA", name: "California"},
    {code: "CO", name: "Colorado"},
    {code: "CT", name: "Connecticut"},
    {code: "DE", name: "Delaware"},
    {code: "FL", name: "Florida"},
    {code: "GA", name: "Georgia"},
    {code: "HI", name: "Hawaii"},
    {code: "ID", name: "Idaho"},
    {code: "IL", name: "Illinois"},
    {code: "IN", name: "Indiana"},
    {code: "IA", name: "Iowa"},
    {code: "KS", name: "Kansas"},
    {code: "KY", name: "Kentucky"},
    {code: "LA", name: "Louisiana"},
    {code: "ME", name: "Maine"},
    {code: "MD", name: "Maryland"},
    {code: "MA", name: "Massachusetts"},
    {code: "MI", name: "Michigan"},
    {code: "MN", name: "Minnesota"},
    {code: "MS", name: "Mississippi"},
    {code: "MO", name: "Missouri"},
    {code: "MT", name: "Montana"},
    {code: "NE", name: "Nebraska"},
    {code: "NV", name: "Nevada"},
    {code: "NH", name: "New Hampshire"},
    {code: "NJ", name: "New Jersey"},
    {code: "NM", name: "New Mexico"},
    {code: "NY", name: "New York"},
    {code: "NC", name: "North Carolina"},
    {code: "ND", name: "North Dakota"},
    {code: "OH", name: "Ohio"},
    {code: "OK", name: "Oklahoma"},
    {code: "OR", name: "Oregon"},
    {code: "PA", name: "Pennsylvania"},
    {code: "RI", name: "Rhode Island"},
    {code: "SC", name: "South Carolina"},
    {code: "SD", name: "South Dakota"},
    {code: "TN", name: "Tennessee"},
    {code: "TX", name: "Texas"},
    {code: "UT", name: "Utah"},
    {code: "VT", name: "Vermont"},
    {code: "VA", name: "Virginia"},
    {code: "WA", name: "Washington"},
    {code: "WV", name: "West Virginia"},
    {code: "WI", name: "Wisconsin"},
    {code: "WY", name: "Wyoming"}
];

class EditProfileViewController extends Component {
    constructor(props) {
        super(props);
        // console.log(JSON.stringify(Utility.user));
        this.state = {
            arrStateList: stateList,
            email: Utility.user != undefined ? Utility.user.email : "",
            phone: Utility.user != undefined ? Utility.user.phone : "",
            city: Utility.user != undefined ? Utility.user.city : "",
            state: Utility.user != undefined ? Utility.user.state : "",
            state_code: "",
            zipcode: Utility.user != undefined ? Utility.user.zipcode : "",
            country_code: Utility.user != undefined ? Utility.user.country_code : "",
            user_id: Utility.user != undefined ? Utility.user.user_id : "",
            full_name: Utility.user != undefined ? Utility.user.full_name : "",
            profile_pic: Utility.user != undefined ? Utility.user.profile_pic : "",
            address: Utility.user != undefined ? Utility.user.address : "",
            latitude: Utility.user != undefined ? Utility.user.latitude : 0,
            longitude: Utility.user != undefined ? Utility.user.longitude : 0,
            user_type: Utility.user != undefined ? Utility.user.user_type : "",
            photoIDUrl: undefined,
            profilePhoto: "",
            photoIDUrlCover: undefined,
            profileCoverPhoto: "",
            spinnerVisible: false,
            hasCameraPermission: undefined,
            hasWritePermission: undefined,
            hasLocationAccessPermission: undefined,
            arrArtWorkStyleList: [],
            stateModalVisible: false
        };
    }

    componentDidMount() {
        if (Utility.getAWSData == undefined) {
            Utility.getAWS();
        }
        Utility._checkCameraPermission().then((hasCameraPermission) => {
            this.setState({ hasCameraPermission });
            if (!hasCameraPermission) return;
            else {
                Utility._checkWriteStoragePermission().then((hasWritePermission) => {
                    this.setState({ hasWritePermission });
                    if (!hasWritePermission) return;
                });
            }
        });
        this.getArtistStyle();
    }
    //API
    getArtistStyle() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
            'type': 'preferred_medium',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.length > 0) {
                    this.setState({ arrArtWorkStyleList: response })
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    btnSelectImageTapped(isCoverPhoto) {
        if (this.state.hasCameraPermission && this.state.hasWritePermission) {
            ImagePicker.showImagePicker({
                title: 'Select Photo',
                //customButtons: [ { name: 'fb', title: 'Choose Photo from Facebook' } ],
                storageOptions: {
                    skipBackup: true,
                    path: 'images'
                }
            }, (response) => {
                console.log('Response = ', response);
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    let source = {
                        uri: response.uri
                    };
                    console.log("uri >>>>> " + response.uri);
                    if (isCoverPhoto) {
                        this.setState({ photoIDUrlCover: response.uri, serverBannerImage: "" });
                    } else {
                        this.setState({ photoIDUrl: response.uri });
                    }

                }
            });
        } else {
            if (!hasCameraPermission) {
                Utility._checkCameraPermission().then((hasCameraPermission) => {
                    this.setState({ hasCameraPermission });
                    if (!hasCameraPermission) return;
                    else {
                        Utility._checkWriteStoragePermission().then((hasWritePermission) => {
                            this.setState({ hasWritePermission });
                            if (!hasWritePermission) return;
                        });
                    }
                });
            } else if (!hasWritePermission) {
                Utility._checkWriteStoragePermission().then((hasWritePermission) => {
                    this.setState({ hasWritePermission });
                    if (!hasWritePermission) return;
                });
            }
        }
    }

    leftBtnTaaped() {
        Utility.navigator.pop({
            animated: true,
            //animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }
    saveProfileTapped() {
        Utility.hideKeyboard();
        if (this.state.full_name.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_your_name)
        } else if (this.state.latitude == 0 || this.state.longitude == 0) {
            Utility.showToast(Utility.MESSAGES.please_enter_proper_address)
        } else if (Utility.user != undefined && Utility.user.phone != this.state.phone) {
            this.checkPhoneExist();
        } else if(this.state.state.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_state)
        } else if (this.state.city.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_city)
        } else if (this.state.zipcode.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_zipcode)
        } else {
            this.validateAndSendRequest();
        }
    }

    stateClick() {
        this.setState({ stateModalVisible: true });
    }

    stateItemClick(item) {
        this.setState({ state: item.name });
        this.setState({ state_code: item.code });
        this.setState({ stateModalVisible: false });
    }

    popUpClose() {
        this.setState({ stateModalVisible: false });
    }

    uploadImage(isCoverPhoto) {
        // var sourcePath = ''
        // if (Utility.isPlateformAndroid == true) {
        //     sourcePath = this.state.photoIDUrl
        // } else {
        //     sourcePath = this.state.photoIDUrl.replace('file://', '')
        // }
        // var destinationPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + 'aaaaaa.jpg'
        // console.log("destinationPath: ", destinationPath)
        // console.log("sourcePath: ", this.state.photoIDUrl)
        // RNFetchBlob.fs.cp(sourcePath, destinationPath).then(() => {
        //     console.log("destinationPath LAST : ", destinationPath)
        //     console.log("sourcePath: LAST ", this.state.destinationPath)
        // }).catch((error) => {
        //     console.log('Error in Copy', error)
        // })
        if (Utility.getAWSData == undefined) {
            return;
        }
        var photo = {
            uri: isCoverPhoto ? this.state.photoIDUrlCover : this.state.photoIDUrl,
            type: 'image/*',
            name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
        };

        const options = {
            keyPrefix: isCoverPhoto ? (Utility.getAWSData.folder_feedpic + '/') : (Utility.getAWSData.folder_profile + '/'),
            bucket: "locart",
            region: Utility.getAWSData.region,
            accessKey: Utility.getAWSData.access_key,
            secretKey: Utility.getAWSData.secret_key,
            successActionStatus: 201
        }

        this.setState({ spinnerVisible: true });
        RNS3.put(photo, options).then(response => {
            this.setState({ spinnerVisible: false });
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
            else {
                console.log('UPLOAD RESPONSE', response.body);
                if (isCoverPhoto) {
                    this.setState({ profileCoverPhoto: photo.name });
                    this.saveProfile();
                } else {
                    this.setState({ profilePhoto: photo.name });
                    if (this.state.photoIDUrlCover != undefined) {
                        this.uploadImage(true)
                    } else {
                        this.saveProfile();
                    }
                }
            }
            /**
             * {
             *   postResponse: {
             *     bucket: "your-bucket",
             *     etag : "9f620878e06d28774406017480a59fd4",
             *     key: "uploads/image.png",
             *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
             *   }
             * }
             */
        });
        // WebClient.uploadMedia(Settings.URL.MEDIA_UPLOAD, {
        //     'type': isCoverPhoto ? 'artwork_images' : 'profile_pic',
        //     'media_file': photo,
        // }, (response, error) => {
        //     //this.setState({ spinnerVisible: false });
        //     if (error == null) {
        //         console.log(response)
        //         if (isCoverPhoto) {
        //             this.setState({ profileCoverPhoto: response.filename });
        //             this.saveProfile();
        //         } else {
        //             this.setState({ profilePhoto: response.filename });
        //             if (this.state.photoIDUrlCover != undefined) {
        //                 this.uploadImage(true)
        //             } else {
        //                 this.saveProfile();
        //             }
        //         }
        //     } else {
        //         Utility.showToast(error.message);
        //         this.setState({ spinnerVisible: false });
        //         //Utility.showAlert('Error', error.message);
        //     }
        // });
    }
    checkPhoneExist() {
        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.user.user_id,
            // 'email': this.state.email,
            'phone': this.state.phone + ''
        };
        console.log('PARAMS', params);
        WebClient.postRequest(Settings.URL.CHECK_PHONE, params, (response, error) => {
            console.log('response', response);
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.openMobileVerificationView()
            } else {
                Utility.showToast(error.message);
                //Utility.showAlert('Error', error.message);
            }
        });
    }
    openMobileVerificationView(){
        this.props.navigator.push({
            screen: 'Artwork.MobileVerificationController',
            animationType: 'push',
            animated: false,
            passProps: {
                phone:this.state.phone,
                onVerificationComplete: this.onVerificationComplete,
            },
        });
    }

    onVerificationComplete = (account) => {
        console.log('account->', account);
        this.setState({
            country_code: '+' + account.countryCode,
            phone: account.number
        }, () => {
            this.validateAndSendRequest();
        });
    }
    
    openMobileVerificationView1() {
        console.log("isSocial :", this.state.isSocialLogin)
        console.log("Phone : " + this.state.phone, this.state.country_code)
        // Settings.configureMobileVerificationView("9904081622","01")
        Settings.configureMobileVerificationView(this.state.phone, this.state.country_code);
        // Shows the Facebook Account Kit view for login via SMS
        RNAccountKit.loginWithPhone().then((token) => {
            if (!token) {
                console.log('Login cancelled')
            } else {
                console.log(`Logged with phone. Token: ${token}`)
                RNAccountKit.getCurrentAccount().then((account) => {
                    this.setState({
                        country_code: '+' + account.phoneNumber.countryCode,
                        phone: account.phoneNumber.number
                    });
                    this.validateAndSendRequest();
                }).catch((error) => {
                    console.error(error);
                }).done();
            }
        })
    }
    validateAndSendRequest() {
        if (this.state.photoIDUrl != null && this.state.photoIDUrl != undefined) {
            this.uploadImage(false)
        } else if (this.state.photoIDUrlCover != null && this.state.photoIDUrlCover != undefined) {
            this.uploadImage(true)
        } else {
            this.saveProfile();
        }
    }
    saveProfile() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.EDIT_PROFILE, {
            'user_id': this.state.user_id,
            'full_name': this.state.full_name,
            'address': this.state.address,
            'email': this.state.email,
            'state': this.state.state,
            'city': this.state.city,
            'zipcode': this.state.zipcode,
            'country_code': this.state.country_code,
            'phone': this.state.phone,
            'latitude': this.state.latitude,
            'longitude': this.state.longitude,
            'bio': this.state.bio,
            'preferred_medium_id': this.state.preferred_medium_id,
            'profile_pic': this.state.profilePhoto,
            'profile_banner_photo': this.state.profileCoverPhoto,
            'deviant_url': this.state.deviant_url,
            'artstation_url': this.state.artstation_url,
            'personal_site_url': this.state.personal_site_url,
            'instgram_url': this.state.instgram_url,
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.user_id) {
                    Utility.showToast(Utility.MESSAGES.profile_updated_success);
                    User.save(response);
                    Utility.user = new User(response);
                    Utility.resetTo('HomeViewController')
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }
    openLocationSelectionScreen() {
        Utility.hideKeyboard();
        Utility._checkLocationPermission().then((hasLocationAccessPermission) => {
            this.setState({ hasLocationAccessPermission });
            if (!hasLocationAccessPermission) return;
            else {
                if (this.state.hasLocationAccessPermission) {
                    // RNGooglePlaces.openPlacePickerModal({
                    //     latitude: this.state.latitude != 0 ? this.state.latitude : 0.0,
                    //     longitude: this.state.longitude != 0 ? this.state.longitude : 0.0,
                    //     radius: 10
                    // })
                    // .then((place) => {
                    //     console.log("PLACE>>> ", place);
                    //     this.setState({ address: place.name });
                    //     this.setState({ latitude: place.latitude });
                    //     this.setState({ longitude: place.longitude });
                    // })
                    // .catch(error => console.log(error.message));  // error is a Javascript Error object
                    RNGooglePlaces.openAutocompleteModal({
                        country: 'US'
                    })
                    .then((place) => {
                        // console.log("PLACE>>> ", place);
                        // alert(place.name + ", " + place.address + ", " + place.location.latitude + ", " + place.location.longitude);
                        this.setState({ address: place.name });
                        this.setState({ latitude: place.location.latitude });
                        this.setState({ longitude: place.location.longitude });
                    })
                    .catch(error => console.log(error.message));  // error is a Javascript Error object
                } else {
                    console.log('Permission not granted')
                }
            }
        });
    }

    render() {
        var stateModelbox = <ModalBox
            coverScreen={false}
            swipeToClose={false}
            backdropPressToClose={false}
            swipeToClose={false}
            backButtonClose={true}
            onClosed={() => this.setState({ stateModalVisible: false })}
            style={styles.modalContainer}
            isOpen={this.state.stateModalVisible}
            position='bottom'>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[styles.prefferedMediumHeaderTextStyle]}>Select State</Text>
                    <TouchableOpacity onPress={this.popUpClose.bind(this)} activeOpacity={0.7}>
                        <Text style={styles.closeTextStyle} >Close</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{ marginTop: 5 }}
                    data={this.state.arrStateList}
                    keyExtractor={(item, index) => index + ''}
                    renderItem={({ item, index }) =>
                        <View style={{ marginHorizontal: 8 }} >
                            <Text style={styles.prefferedMediumTextStyle} onPress={this.stateItemClick.bind(this, item)} >
                                {item.name}
                            </Text>
                            <View style={styles.viewBottom} />
                        </View>}
                    numColumns={1}
                />
            </View>
        </ModalBox >

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackGreen} />
                            <Text style={styles.titleTextStyle}>EDIT PROFILE</Text>
                        </TouchableOpacity>

                        <View style={styles.profilePicView}>
                            <TouchableOpacity style={styles.profilePicEditView} onPress={() => this.btnSelectImageTapped(false)} activeOpacity={0.7}>
                                <ProgressiveImage
                                    style={styles.profileImage}
                                    placeholderStyle={styles.placeHolderPhotoStyle}
                                    uri={(this.state.photoIDUrl != undefined) ?
                                        this.state.photoIDUrl : Utility.user != undefined ? Utility.user.profile_pic : undefined}
                                    placeholderSource={Images.input_userphoto}
                                    borderRadius={1} />
                                <Text style={styles.editTextStyle}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <KeyboardAwareScrollView style={{ marginTop: 15 }}
                        extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.textFieldViewContainer}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.textStyle}>Name</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    autoCorrect
                                    maxLength={255}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(full_name) => this.setState({ full_name })}
                                    value={this.state.full_name}
                                />
                            </View>
                        </View>
                        <View style={styles.textFieldViewContainer}>
                            <View style={styles.emailContainer}>
                                <Text style={styles.textStyle}>Email</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    keyboardType={'email-address'}
                                    autoCorrect={false}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    // editable={false}
                                    onChangeText={(email) => this.setState({ email })}
                                    value={this.state.email}
                                    maxLength={255}
                                    autoCapitalize={'none'}
                                />
                            </View>
                            <View style={styles.phoneContainer}>
                                <Text style={styles.textStyle}>Phone</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    autoCorrect={false}
                                    keyboardType={'phone-pad'}
                                    placeholder={""}
                                    autoCapitalize={'none'}
                                    selectionColor={Colors.blueType1}
                                    // editable={false}
                                    onChangeText={(phone) => this.setState({ phone })}
                                    value={this.state.phone}
                                />
                            </View>
                        </View>
                        <View style={styles.locationAndArtworkStyleContainer}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.textStyle}>Address</Text>
                                {
                                    (this.state.latitude == 0 || this.state.longitude == 0) ?
                                        <TextField
                                            inputStyle={styles.inputText}
                                            placeholderTextColor={Colors.grayTextColor}
                                            borderColor={'transparent'}
                                            autoCorrect
                                            placeholder={""}
                                            selectionColor={Colors.blueType1}
                                            // onChangeText={(address) => this.setState({ address })}
                                            // value={this.state.address}
                                            rightIcon={Images.addressIcon}
                                            onRightIconAction={() => this.openLocationSelectionScreen()}
                                            onPress={() => (this.state.latitude == 0 || this.state.longitude == 0) ? this.openLocationSelectionScreen() : null}
                                        //editable={(this.state.latitude == 0 || this.state.longitude == 0) ? false : true}
                                        />
                                        :
                                        <TextField
                                            inputStyle={styles.inputText}
                                            placeholderTextColor={Colors.grayTextColor}
                                            borderColor={'transparent'}
                                            autoCorrect={false}
                                            placeholder={""}
                                            selectionColor={Colors.blueType1}
                                            onChangeText={(address) => this.setState({ address })}
                                            value={this.state.address}
                                            rightIcon={Images.addressIcon}
                                            onRightIconAction={() => this.openLocationSelectionScreen()}
                                        // onPress={() => (this.state.latitude == 0 || this.state.longitude == 0) ? this.openLocationSelectionScreen() : null}
                                        //editable={(this.state.latitude == 0 || this.state.longitude == 0) ? false : true}
                                        />
                                }

                            </View>
                        </View>
                        <View style={styles.textFieldViewContainer}>
                            <View style={styles.emailContainer}>
                                <Text style={styles.textStyle}>City</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    keyboardType={'email-address'}
                                    autoCorrect
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    // editable={false}
                                    onChangeText={(city) => this.setState({ city })}
                                    value={this.state.city}
                                    maxLength={255}
                                    autoCapitalize={'none'}
                                />
                            </View>
                            <View style={styles.phoneContainer}>
                                <Text style={styles.textStyle}>Zip Code</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    autoCorrect={false}
                                    keyboardType={'phone-pad'}
                                    placeholder={""}
                                    autoCapitalize={'none'}
                                    selectionColor={Colors.blueType1}
                                    // editable={false}
                                    onChangeText={(zipcode) => this.setState({ zipcode })}
                                    value={this.state.zipcode}
                                />
                            </View>
                        </View>
                        <View style={styles.textFieldViewContainer}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.textStyle}>State</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    autoCorrect={false}
                                    maxLength={255}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    value={this.state.state}
                                    onPress={() => this.stateClick()}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={{ marginVertical: 15, justifyContent: 'center', alignItems: 'center' }} onPress={() => Utility.push("ChangePasswordController")}>
                            <Text style={styles.textChangepassword}>Change Password</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: 10, flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <INTButton buttonStyle={{ paddingHorizontal: 20, backgroundColor: Colors.themeColor, justifyContent: 'center' }}
                                title='Save Profile'
                                titleStyle={styles.buttonTitleStyle}
                                onPress={() => this.saveProfileTapped()}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                {stateModelbox}
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default EditProfileViewController