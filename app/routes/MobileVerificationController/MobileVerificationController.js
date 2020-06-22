
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    Alert
} from 'react-native';
import INTButton from '../../component/INTButton'
import Colors from '../../config/Colors';
import TextField from '../../component/TextField'
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';

import styles, { brandColor } from './styles';
import CountryPicker from '../../libraries/CountryPicker/CountryPicker';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from './Form';

import countries from '../../libraries/CountryPicker/data/countries.json';

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

// your brand's theme primary color
import DeviceInfo from 'react-native-device-info';

const deviceCountry = DeviceInfo.getDeviceCountry();

const defaultState = {
    enterCode: false,
    spinnerVisible: false,
    country: {
        cca2: '',
        callingCode: '',
    },
    phone: '',
    verificationCode: '',
    otpReceived: '',
}

class MobileVerificationController extends Component {

    constructor(props) {
        console.log('props', props);
        super(props);
        const userCountry = countries[deviceCountry]
        console.log('userCountry->', userCountry);
        const state = { ...defaultState, phone: props.phone, country: { cca2: deviceCountry, callingCode: userCountry.callingCode } };
        this.state = state;
    }

    _getCode = () => {
        this.setState({ spinnerVisible: true });
        var paramRequest = {
            'country_code': `+${this.state.country.callingCode}`,
            'phone': this.state.phone,
        }
        WebClient.postRequest(Settings.URL.SEND_OTP, paramRequest, (response, error) => {
            this.setState({ spinnerVisible: false }, () => {
                setTimeout(() => {
                    if (error == null) {
                        this.setState({ enterCode: true, otpReceived: response.otp_code });
                        console.log('response->', response);
                    } else {
                        alert(error.message);
                    }
                }, 500);
            });

        });
    }

    _verifyCode = () => {
        const { onVerificationComplete } = this.props;
        if (this.state.verificationCode === this.state.otpReceived) {
            console.log('verified');
            const account = { countryCode: this.state.country.callingCode, number: this.state.phone };
            onVerificationComplete && onVerificationComplete(account);
            Utility.navigator.pop({
                animated: false,
            });
        }
    }

    _onChangeText = (val) => {
        if (this.state.enterCode) {
            this.setState({ verificationCode: val });
        } else {
            this.setState({ phone: val });
        }
    }

    _tryAgain = () => {
        this.refs.form.refs.textInput.focus();
        this.setState({ enterCode: false, phone: '', verificationCode: '' });
    }

    _getSubmitAction = () => {
        if (this.state.enterCode) {
            if (this.state.verificationCode.trim() == "") {
                Utility.showToast(Utility.MESSAGES.please_enter_otp);
                return;
            }
            this._verifyCode();
        } else {
            if (this.state.phone.trim() == "") {
                Utility.showToast(Utility.MESSAGES.please_enter_phone);
                return;
            } else if (this.state.phone.trim().length < 10 || this.state.phone.trim().length > 16) {
                Utility.showToast(Utility.MESSAGES.please_enter_valid_phone);
                return;
            }
            this._getCode();
        }
    }

    _changeCountry = (country) => {
        console.log('on change->', country);
        this.setState({ country: { ...country.country, callingCode: country.callingCode } });
        this.refs.form.refs.textInput.focus();
    }

    _renderFooter = () => {
        if (this.state.enterCode)
            return (
                <View style={{ paddingTop: 10 }}>
                    <Text style={styles.didntGetText}>
                        Didn't get OTP ?
                    <Text style={styles.wrongNumberText} onPress={this._getCode}>
                            {` RESEND OTP`}
                        </Text>
                    </Text>
                </View>
            );
        return (
            <View>
                <Text style={styles.disclaimerText}>By tapping "Continue" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        );

    }

    _renderCountryPicker = () => {
        if (!this.state.enterCode) {
            return (
                <CountryPicker
                    ref={'countryPicker'}
                    closeable
                    style={styles.countryPicker}
                    onChange={this._changeCountry}
                    cca2={this.state.country.cca2}
                    styles={countryPickerCustomStyles}
                    searchable={true}
                />
            );
        }
        return null;
    }

    _renderCallingCode = () => {
        if (!this.state.enterCode){
            return (
                <View style={styles.callingCodeView}>
                    <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
                </View>
            );
        }
    }

    _renderHeader = () => {
        if (this.state.enterCode) {
            return (
                <View style={{ paddingTop: 10 }}>
                    <Text style={styles.didntGetText}>
                        {`+${this.state.country.callingCode} ${this.state.phone}`}
                        <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
                            {` CHANGE`}
                        </Text>
                    </Text>
                </View>
            );
        }
        return null;
    }

    resetAndCancel = () => {
        this.props.navigator.pop();
    }

    render() {
        let headerText = this.state.enterCode ? `Enter OTP` : `Enter Phone Number`;
        let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
        let textStyle = {};

        return (
            <View style={styles.container}>
                <Text style={styles.header}>{headerText}</Text>
                {this._renderHeader()}
                <Form ref={'form'} style={styles.form}>
                    <View style={{ flexDirection: 'row', height:50, alignItems: 'center', justifyContent: 'center' }}>
                        {this._renderCountryPicker()}
                        <TextInput
                            ref={'textInput'}
                            name={this.state.enterCode ? 'code' : 'phoneNumber'}
                            type={'TextInput'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            value={this.state.enterCode ? this.state.verificationCode : this.state.phone}
                            onChangeText={this._onChangeText}
                            placeholder={this.state.enterCode ? 'Enter OTP' : 'Phone Number'}
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            style={[styles.textInput, textStyle]}
                            returnKeyType='go'
                            autoFocus
                            placeholderTextColor={brandColor}
                            selectionColor={brandColor}
                            maxLength={this.state.enterCode ? 6 : 20}
                            onSubmitEditing={this._getSubmitAction}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around' }}>
                        <INTButton buttonStyle={styles.btnVerify}
                            title={this.state.enterCode ? "Verify OTP" : "Continue"}
                            titleStyle={styles.titleVerify}
                            spaceBetweenIconAndTitle={0}
                            onPress={this._getSubmitAction} />
                        <INTButton buttonStyle={styles.abuseButtonStyle}
                            title='Cancel'
                            titleStyle={styles.abuseButtonTextStyle}
                            onPress={this.resetAndCancel}
                        />
                    </View>
                    {this._renderFooter()}
                </Form>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'One moment...'}
                    textStyle={{ color: '#fff' }}
                />
            </View>
        );
    }
}

export default MobileVerificationController;