import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
} from 'react-native';

import styles from './styles'

import SafeAreaView from '../../component/SafeAreaView';
import TopbarView from '../../component/TopbarView';

import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


class PolicyViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            thirdPartyList: [
                { name: 'Google Play Services' },
                { name: 'Apple App Store' },
                { name: 'Stripe, Inc' },
            ],
            serviceProviderList: [
                { name: 'To facilitate our Service;' },
                { name: 'To provide the Service on our behalf;' },
                { name: 'To perform Service-related services; or' },
                { name: 'To assist us in analyzing how our Service is used.' },
            ]
        };
    }

    getFlatListOf(array) {
        return (<FlatList
            style={{ alignSelf: 'center' }}
            data={array}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />)
    }
    
    renderItem(rowData) {
        var item = rowData.item
        var index = rowData.index
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.paraTxtItemDot}>{'\u2022 '}</Text>
                <Text style={styles.paraTxtItem}>{item.name}</Text>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView>
                <TopbarView
                    title={'Privacy Policy'}
                    isTitleTappable={false}
                    isFirstLaunch={false}>
                </TopbarView>
                <KeyboardAwareScrollView
                    bounces={true}
                    automaticallyAdjustContentInsets={true}
                    extraScrollHeight={100}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.containerViewStyle}>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    Intuz built the Loc Art app as a Commercial app. This service is provided by Loc Art and is intended for use as is.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Loc Art unless otherwise defined in this Privacy Policy.
                                </Text>
                            </View>
                            
                            <Text style={styles.supportText1}>Information Collection and Use</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Name, Phone Number, Email, Address, Credit Card Information, Location, Date of Birth, Bank Account Holder Name, Bank Account Number, Bank Routing Number, and Photo Identification Document. The information that we request will be retained by us and used as described in this privacy policy.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                <Text style={styles.supportText2}>
                                    The app does use third-party services that may collect information used to identify you.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                <Text style={styles.supportText2}>
                                    Links to the privacy policy of third party service providers used by the app:
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                {this.getFlatListOf(this.state.thirdPartyList)}
                            </View>
                            <View>
                                <Text>&nbsp;</Text>
                            </View>

                            <Text style={styles.supportText1}>Log Data</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
                                </Text>
                            </View>

                            <Text style={styles.supportText1}>Cookies</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.
                                </Text>
                            </View>

                            <Text style={styles.supportText1}>Service Providers</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                <Text style={styles.supportText2}>
                                    We may employ third-party companies and individuals due to the following reasons:
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                {this.getFlatListOf(this.state.serviceProviderList)}
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                                </Text>
                            </View>

                            <Text style={styles.supportText1}>Security</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                                </Text>
                            </View>

                            <Text style={styles.supportText1}>Links to Other Sites</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                                </Text>
                            </View>

                            <Text style={styles.supportText1}>Children’s Privacy</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
                                </Text>
                            </View>

                            <Text style={styles.supportText1}>Changes to This Privacy Policy</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.
                                </Text>
                            </View>

                            <Text style={styles.supportText1}>Contact Us</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@locart.org
                                </Text>
                            </View>
                            
                            <View>
                                <Text style={styles.supportText2}>
                                    &nbsp;
                                </Text>
                                <Text style={styles.supportText2}>
                                    &nbsp;
                                </Text>
                                <Text style={styles.supportText2}>
                                    &nbsp;
                                </Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        );
    }
}
export default PolicyViewController;