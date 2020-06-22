import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';

import styles from './styles'

import SafeAreaView from '../../component/SafeAreaView';
import TopbarView from '../../component/TopbarView';

import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


class TermsViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
        };
    }

    render() {
        return (
            <SafeAreaView>
                <TopbarView
                    title={'Terms of Use'}
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
                            <Text style={styles.supportText1}>Terms & Conditions</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app. You’re not allowed to copy, or modify the app, any part of the app, or our trademarks in any way. You’re not allowed to attempt to extract the source code of the app, and you also shouldn’t try to translate the app into other languages, or make derivative versions. The app itself, and all the trade marks, copyright, database rights and other intellectual property rights related to it, still belong to Loc Art.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    Loc Art is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you’re paying for.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    The Loc Art app stores and processes personal data that you have provided to us, in order to provide our Service. It’s your responsibility to keep your phone and access to the app secure. We therefore recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device. It could make your phone vulnerable to malware/viruses/malicious programs, compromise your phone’s security features and it could mean that the Loc Art app won’t work properly or at all.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    You should be aware that there are certain things that Loc Art will not take responsibility for. Certain functions of the app will require the app to have an active internet connection. The connection can be Wi-Fi, or provided by your mobile network provider, but Loc Art cannot take responsibility for the app not working at full functionality if you don’t have access to Wi-Fi, and you don’t have any of your data allowance left.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    If you’re using the app outside of an area with Wi-Fi, you should remember that your terms of the agreement with your mobile network provider will still apply. As a result, you may be charged by your mobile provider for the cost of data for the duration of the connection while accessing the app, or other third party charges. In using the app, you’re accepting responsibility for any such charges, including roaming data charges if you use the app outside of your home territory (i.e. region or country) without turning off data roaming. If you are not the bill payer for the device on which you’re using the app, please be aware that we assume that you have received permission from the bill payer for using the app.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    Along the same lines, Loc Art cannot always take responsibility for the way you use the app i.e. You need to make sure that your device stays charged – if it runs out of battery and you can’t turn it on to avail the Service, Loc Art cannot accept responsibility.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    With respect to Loc Art’s responsibility for your use of the app, when you’re using the app, it’s important to bear in mind that although we endeavor to ensure that it is updated and correct at all times, we do rely on third parties to provide information to us so that we can make it available to you. Loc Art accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    At some point, we may wish to update the app. The app is currently available on Android and iOS – the requirements for both systems (and for any additional systems we decide to extend the availability of the app to) may change, and you’ll need to download the updates if you want to keep using the app. Loc Art does not promise that it will always update the app so that it is relevant to you and/or works with the iOS/Android version that you have installed on your device. However, you promise to always accept updates to the application when offered to you, We may also wish to stop providing the app, and may terminate use of it at any time without giving notice of termination to you. Unless we tell you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must stop using the app, and (if needed) delete it from your device.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    Humans must be 18 years or older to use the Loc Art Services. Minors under the age of 18 and at least 13 years of age are only permitted to use our Services through a Loc Art account owned by a legal guardian or a parent of the minor with their appropriate permission and under their direct supervision. Minors under 13 years of age are not permitted to use Loc Art or the Services we provide. You are responsible for any and all account activity conducted by an individual under the age of 18 on your account.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    You must provide correct information about yourself. It is not allowed to use false information or to pretend to be another business or person on your account.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    You are the sole person responsible for your content on Loc Art. Respectively, You understand that you have all necessary rights to your content on Loc Art and that you’re not breaching or breaking a legal or moral code of any third party’s rights by posting something on Loc Art.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    We do not own or claim ownership of any artworks posted on Loc Art. We only provide the marketplace to help artist sell to their community, so Loc Art cannot and will not make any guarantees to the legality, safety, and quality of the work sold on Loc Art.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    Loc art reserves the right to give its users a 7-day free return policy on their purchases. In regards, artist have to refund the user 100% of the purchase pice if the artwork is returned within 7 days. Commission artworks return policy and refund will be dealt with on a case by case bases.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    You have the ability to use our Services to interact with other individuals, either online or in person. However, you understand that we do not screen users of our Services, and you release us from all liability relating to your interactions with other users. Please be careful and exercise caution and good judgment in all interactions with others, especially if you are meeting someone in person.  
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    You agree not to interfere with or try to disrupt Loc Art's app, website, or services. For example, by distributing a virus or other harmful computer code.
                                </Text>
                            </View>
                            <Text style={styles.supportText1}>Changes to This Terms and Conditions</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    We may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Terms and Conditions on this page. These changes are effective immediately after they are posted on this page.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    These Terms do not create any agency, partnership, joint venture, employment, or franchisee relationship between you and Loc Art.
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    We reserve the right to remove any account, message, or post if we deem it to be offensive or harmful in any way.
                                </Text>
                            </View>
                            <Text style={styles.supportText1}>Contact Us</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>
                                    If you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us at support@locart.org
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
export default TermsViewController;