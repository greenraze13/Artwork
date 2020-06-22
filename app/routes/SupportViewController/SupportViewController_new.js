import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import styles from './styles'
import Colors from '../../config/Colors';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import TextField from '../../component/TextField'
import SafeAreaView from '../../component/SafeAreaView';
import TopbarView from '../../component/TopbarView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fonts from '../../config/Fonts';
import Spinner from 'react-native-loading-spinner-overlay';
import HTML from 'react-native-render-html';

let SUPPORT = 0;
let FAQ = 1;

class SupportViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: SUPPORT,
            spinnerVisible: false,
            strFirstNameLastNameText: Utility.user.full_name,
            strEmailText: Utility.user.email,
            strHelpDescription: '',
            cmsTitle: '',
            cmsContent: '',
        };
    }

    componentDidMount() {
        this.getCMS();
    }

    getCMS() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.CMS, {
            'type': Utility.cmsType.FAQ,
        }, (response, error) => {
            if (error == null) {
                this.setState({ cmsTitle: response.title, cmsContent: response.content, spinnerVisible: false });
            } else {
                this.setState({ spinnerVisible: false });
                Utility.showToast(error.message);
            }
        });
    }

    btnSendSupportTapped() {
        if (this.isValidInputData() == true) {
            this.supportAPI()
        }
    }

    isValidInputData() {
        var isValidData = true
        if (this.state.strFirstNameLastNameText.trim().length == 0) {
            isValidData = false
            Utility.showToast(Utility.MESSAGES.please_enter_name)
        } else if (Utility.validateEmail(this.state.strEmailText) == false) {
            isValidData = false
            Utility.showToast(Utility.MESSAGES.please_enter_valid_email)
        } else if (this.state.strHelpDescription.trim().length == 0) {
            isValidData = false
            Utility.showToast(Utility.MESSAGES.please_enter_des)
        }
        return isValidData
    }

    supportAPI() {
        this.setState({ spinnerVisible: true })
        var reqestParam = {};
        reqestParam.user_id = Utility.user.user_id + ''
        reqestParam.name = this.state.strFirstNameLastNameText + ''
        reqestParam.email = this.state.strEmailText + ''
        reqestParam.description = this.state.strHelpDescription + ''
        WebClient.postRequest(Settings.URL.ADD_CONTACT_REQUEST, reqestParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                Utility.showToast(Utility.MESSAGES.thankyou_for_your_feedback)
                Utility.navigator.pop({
                    animated: true,
                });
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    leftBtnTaaped() {
        this.props.navigator.pop();
    }

    checkCurrentState(state) {
        return (this.state.currentState == state)
    }

    btnFaqClick() {
        this.setState({ currentState: FAQ });
    }

    btnSupportClick() {
        this.setState({ currentState: SUPPORT });
    }

    showFAQTapped = (cmsType) => {
        this.props.navigator.push({
            screen: 'Artwork.CMSViewController',
            title: undefined,
            animationType: 'push',
            animated: true,
            passProps: {
                type: cmsType,
            },
        });
    }
    
    render() {
        console.log(this.state.cmsContent);
        return (
            <SafeAreaView>
                {/*TOPBAR VIEW*/}
                <TopbarView
                    title={'SUPPORT'}
                    isTitleTappable={false}
                    isFirstLaunch={false}>
                </TopbarView>
                {/*Header View*/}
                <View style={styles.viewHeader}>
                    <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnSupportClick()} activeOpacity={0.6}>
                        <Text style={this.checkCurrentState(SUPPORT) ? styles.textSelected : styles.textUnSelected} >Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnFaqClick()} activeOpacity={0.6}>
                        <Text style={this.checkCurrentState(FAQ) ? styles.textSelected : styles.textUnSelected} >Faq</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewLine} />
                {
                    this.checkCurrentState(SUPPORT) ?
                        <KeyboardAwareScrollView
                            bounces={true}
                            automaticallyAdjustContentInsets={true}
                            extraScrollHeight={100}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.containerViewStyle}>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.supportText1}>Have a problem?</Text>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <Text style={styles.supportText2}>Be sure to check the </Text>
                                        <Text style={[styles.supportText2, { textDecorationLine: 'underline' }]} onPress={() => this.showFAQTapped(Utility.cmsType.FAQ)}>FAQ</Text>
                                        <Text style={styles.supportText2}> for a solution first!</Text>
                                    </View>
                                    <Text style={styles.supportText3}>Fill out the below and we'll do our best to get it sorted out</Text>
                                </View>
                                <View style={styles.applicationFormInnerContainer}>
                                    <View style={[styles.titleContainer, { marginRight: 10 }]}>
                                        <Text style={styles.titleStyle}>First & Last Name</Text>
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            selectionColor={Colors.blueType1}
                                            onChangeText={(strFirstNameLastNameText) => this.setState({ strFirstNameLastNameText })}
                                            value={this.state.strFirstNameLastNameText}
                                        />
                                    </View>
                                    <View style={[styles.titleContainer, { marginLeft: 10 }]}>
                                        <Text style={styles.titleStyle}>Email</Text>
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            selectionColor={Colors.blueType1}
                                            onChangeText={(strEmailText) => this.setState({ strEmailText })}
                                            value={this.state.strEmailText}
                                        />
                                    </View>
                                </View>
                                <View style={styles.artworkDescriptionStyle}>
                                    <Text style={styles.titleStyle}>How can we help?</Text>
                                    <TextField
                                        inputStyle={Utility.isPlatformAndroid ? styles.inputTextDescriptionAndroid : styles.inputTextDescription}
                                        autoCorrect={false}
                                        placeholder={""}
                                        multiline={true}
                                        selectionColor={Colors.blueType1}
                                        onChangeText={(strHelpDescription) => this.setState({ strHelpDescription })}
                                        value={this.state.strHelpDescription}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.btnSendSupportTapped()} activeOpacity={0.7}>
                                    <View style={styles.sendButtonView}>
                                        <Text style={{ color: 'white', fontFamily: Fonts.promptRegular }}>Send</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAwareScrollView>
                    :
                        <View style={{padding: 20, marginBottom: 150}}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <HTML html={this.state.cmsContent} />
                            </ScrollView>
                        </View>
                }
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        );
    }
}

export default SupportViewController