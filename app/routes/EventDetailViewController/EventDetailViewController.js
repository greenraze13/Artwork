/*
 * This example demonstrates how to use ParallaxScrollView within a ScrollView component.
 */
import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    Linking,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import styles from './styles'
import Utility from '../../config/Utility';
import Settings from '../../config/Settings';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Images from '../../config/Images';
import INTButton from '../../component/INTButton'
import Colors from '../../config/Colors';
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';
import WebClient from '../../config/WebClient';
import Spinner from 'react-native-loading-spinner-overlay';
import Fonts from '../../config/Fonts';
import RNCalendarEvents from 'react-native-calendar-events';
import HTML from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

// const htmlContent = `
//     <h1>This HTML snippet is now rendered with native components !</h1>
//     <h2>Enjoy a webview-free and blazing fast application</h2>
//     <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
//     <em style="textAlign: center;">Look at how happy this native cat is</em>
// `;

class EventDetailViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            eventResponse: {},
            isDataReceived: false,
        };
    }

    componentDidMount() {
        this.getEventDetailAPI();
    }

    //API
    getEventDetailAPI() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_EVENT_DETAILS, {
            'user_id': Utility.getUserId(),
            'event_id': this.props.eventId + '',
            // 'event_id': 4 + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response) {
                    this.setState({ isDataReceived: true, eventResponse: response })
                }
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    openBuyNowClicked() {
        if (Linking.canOpenURL(this.state.eventResponse.buy_ticket_url)) {
            Linking.openURL(this.state.eventResponse.buy_ticket_url);
        } else {
            Utility.showToast(Utility.MESSAGES.book_ticket_url_invalid);
        }
    }

    openAddToCalenderClicked() {
        RNCalendarEvents.authorizeEventStore()
            .then(status => {
                // console.log(status);
                RNCalendarEvents.authorizationStatus()
                    .then(status => {
                        //status = denied, restricted, authorized or undetermined
                        // console.log("Calendar authorizationStatus:", status);
                        var startDate = new Date(Number(this.state.eventResponse.event_datetime));
                        endDate = new Date(Date.parse(startDate) + 3600000);
                        RNCalendarEvents.saveEvent(this.state.eventResponse.title, {
                            location: this.state.eventResponse.address,
                            description: this.state.eventResponse.description,
                            startDate: startDate,
                            endDate: endDate,
                        })
                            .then(id => {
                                // console.log("Calendar event id:", id);
                                Utility.showToast(Utility.MESSAGES.event_added_in_device_calender)
                            })
                            .catch(error => {
                                console.log("Calendar add event error:", error);
                            });
                    })
                    .catch(error => {
                        console.log("Calendar authorizationError:", error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    backBtnTapped() {
        Utility.navigator.pop({
            animated: true,
        });
    }


    artImageTapped(click_index) {
        var artwork_photos = [];
        if (this.state.eventResponse.event_photo != undefined) {
            var params = {
                "image_path": this.state.eventResponse.event_photo,
            }
            artwork_photos.push(params);
            Utility.push('ImageFullScreenViewController', { artwork_photos: artwork_photos, click_index: click_index })
        }
    }

    render() {
        const { onScroll = () => { } } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity 
                    onPress={this.backBtnTapped.bind(this)} 
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
                            {this.state.eventResponse.title != undefined ? this.state.eventResponse.title + "" : ""}
                            </Text>
                        </View>
                    </View>
                </View>
                </TouchableOpacity>

                <View style={{borderTopColor: Colors.black, borderWidth: 0.5}}></View>

                <ScrollView>
                    <TouchableOpacity onPress={this.artImageTapped.bind(this, 0)} activeOpacity={0.7}>
                        <View style={{ width: Utility.screenWidth, height: PARALLAX_HEADER_HEIGHT }}>
                        <LinearGradient colors={['#85A2B7', '#b4c8d7', '#dae4eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{flex: 1}}>
                            <ProgressiveImage
                                style={{
                                    width: Utility.screenWidth,
                                    height: PARALLAX_HEADER_HEIGHT
                                }}
                                uri={this.state.eventResponse.event_photo != undefined ? this.state.eventResponse.event_photo : ""}
                                placeholderSource={Images.placeholderMediaImage}
                                onPress={this.artImageTapped.bind(this, 0)}
                                backgroundColor={'#696d23'}
                            />
                        </LinearGradient>
                        </View>
                    </TouchableOpacity>
                    {
                        this.state.isDataReceived ?
                            <View style={styles.eventDetailViewStyle}>
                                {/* <View style={styles.eventProfile}> */}
                                <View style={{ flex: 1, }}>
                                    <View style={styles.eventNamePrice}>
                                        <Text style={styles.eventNameText}>{this.state.eventResponse.title != undefined ? this.state.eventResponse.title + "" : ""}</Text>
                                        <View style={(Dimensions.get('window').width > 320) ? styles.viewPriceStyle : styles.viewPriceStyleForSmallSize}><Text style={styles.txtPriceStyle}>{Utility.DOLLOR}{Utility.parseFloat(this.state.eventResponse.price)}</Text></View>
                                    </View>
                                    <Text style={styles.artistNameText}>{Utility.getEventFormatDate(this.state.eventResponse.event_datetime, false) + ' to ' + Utility.getEventFormatDate(this.state.eventResponse.event_endtime, true) + " - " + (this.state.eventResponse.address != undefined ? this.state.eventResponse.address : "")}</Text>
                                </View>
                                {/* </View> */}
                                <Text style={styles.eventDescriptionText}>{this.state.eventResponse.description != undefined ? this.state.eventResponse.description : ""}</Text>
                                {/* <HTML html={this.state.eventResponse.description != undefined ? this.state.eventResponse.description : ""} imagesMaxWidth={Dimensions.get('window').width} /> */}
                            </View> : null
                    }
                    <Spinner visible={this.state.spinnerVisible} />
                </ScrollView>
                {
                    this.state.isDataReceived ?
                        <View style={styles.addToCalenderBuyTicketNowView}>
                            {/*Add to Calendar*/}
                            <INTButton buttonStyle={styles.btnAddToCalendar} title={'Add To Calendar'}
                                titleStyle={styles.calendarText}
                                spaceBetweenIconAndTitle={0}
                                onPress={() => this.openAddToCalenderClicked()} />
                            <INTButton buttonStyle={styles.btnBuyTicketNow} title={'Tickets/Info'}
                                titleStyle={styles.buyTicketText}
                                spaceBetweenIconAndTitle={0}
                                onPress={() => this.openBuyNowClicked()} />
                        </View>
                        : null
                }
            </View>
        );
    }
}

const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = Utility.isPlatformAndroid ? 50 : 64;

const parallaxStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
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
        width: Utility.screenWidth,//300,
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
        position: 'absolute',
        bottom: 10,
        left: 10
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

export default EventDetailViewController;