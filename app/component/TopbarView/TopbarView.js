import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';

import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import DateFormat from '../../config/DateFormat';
import Fonts from '../../config/Fonts';
import PopoverTooltip from 'react-native-popover-tooltip';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Navigation } from 'react-native-navigation';
import visited from '../../config/Global';

let kARTWORK = 'ARTWORK'
let kARTIST = 'ARTISTS'
let kEVENTS = 'EVENTS/CLASSES'

const styles = StyleSheet.create({
    container: {
        width: Utility.screenWidth,
        height: Settings.topBarHeight,
        flexDirection: 'row',
        paddingTop: Settings.topBarTopPadding,
        //justifyContent: 'center',
        alignItems: 'center',
    },
    leftButton: {
        // backgroundColor: 'red',
        //top: Settings.topBarTopPadding,
        left: Settings.topBarHorizontalPadding,
        position: 'absolute',
        // padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightBtnView: {
        flex: 1,
        position: 'absolute',
        right: Settings.topBarHorizontalPadding,
        flexDirection: 'row',
    },
    rightButton: {
        top: Settings.topBarTopPadding,
        padding: 10
    },
    // cartButton: {
    //     top: Settings.topBarTopPadding,
    //     padding: 10,
    //     paddingRight: Utility.screenWidth / 7
    // },
    // not tapable title
    titleView: {
        padding: 10,
        marginLeft: 35,
        flexDirection: 'row',
    },
    titleText: {
        fontFamily: Fonts.santanaBlack,
        fontSize: Settings.titleFontSize,
        textAlign: 'left',
        color: Colors.green,
    },

    // tapable title
    titleViewTappable: {
        flexDirection: 'row',
    },
    dropDownImageStyle: {
        marginTop: 5,
        height: 10,
        width: 10,
        marginHorizontal: 5
    },
    titleTextTappable: {
        fontFamily: Fonts.santanaBlack,
        fontSize: Settings.titleFontSize,
        textAlign: 'left',
        color: Colors.themeColor,
        // width : 105                   
    },



    doneView: {
        padding: 10,
    },
    doneBtnText: {
        fontFamily: Fonts.santanaBold,
        fontSize: 14,
        color: Colors.doneBtn,
    },
    labelStyle: {
        color: Colors.grayTextColor,
        textAlign: 'center',
        paddingVertical: 6
    }


});

class TopbarView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notificationCount: this.props.notificationCount
        };
    }

    static defaultProps = {
        isLeftItemTypeLogo: false,
        showSearchBtn: false,
        showOptionsBtn: false,
        showDoneButton: false,
        showNotificationBtn: false,
        showCalenderBtn: false,
        doneText: 'Done',
        showDropdown: false,
        isFirstLaunch: true,            // added by Wang
    };

    // added by Wang - start
    componentDidMount() {
        if (this.props.isFirstLaunch) {
            this.refs.tooltip.toggle();
            visited.isFirstLaunch = false;
        }
    }
    // added by Wang - end

    leftBtnTaaped() {
        // if (this.props.onhiddenMediumList != null)
        //     this.props.onhiddenMediumList();

        if (this.props.isLeftItemTypeLogo == true && this.props.onLeftBtnPress == undefined) {
            // Utility.resetTo('SigninController');
            Utility.toggleSideMenu();
        } else if (this.props.isLeftItemTypeLogo == false && this.props.onLeftBtnPress == undefined) {
            Utility.navigator.pop({
                animated: true,
                //animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
            });

        } else if (this.props.onLeftBtnPress != undefined) {
            this.props.onLeftBtnPress()
        }
    }

    notificationBtnTapped() {
        if (this.props.onNotificationTapped != undefined) {
            this.props.onNotificationTapped()
        }
    }

    doneBtnTapped() {
        if (this.props.onDoneTapped != undefined) {
            this.props.onDoneTapped()
        }
    }

    optionBtnTapped() {
        if (this.props.onOptionsTapped != undefined) {
            this.props.onOptionsTapped(this.optionBtn)
        }
    }

    searchBtnTapped() {
        // if (this.props.onhiddenMediumList != null)
        //     this.props.onhiddenMediumList();

        if (this.props.onSearchTapped != undefined) {
            this.props.onSearchTapped()
        }
    }

    calenderBtnTapped() {
        if (this.props.calenderBtnTapped != undefined) {
            this.props.calenderBtnTapped()
        }
    }

    titleView() {
        return (
            <View style={styles.titleView}>
                <TouchableOpacity style={styles.leftButton} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                    <Text style={styles.titleText}>
                        {this.props.title}
                    </Text>
                </TouchableOpacity>
            </View>);
    }

    onTitleTapped() {
        // if (this.props.onhiddenMediumList != null)
        //     this.props.onhiddenMediumList();

        this.refs.tooltip.toggle();
    }

    // cartBtnTapped() {
    //     if (this.props.onhiddenMediumList != null)
    //         this.props.onhiddenMediumList();
            
    //     Utility.push('CartViewController');
    // }

    titleViewTappable() {
        return (
            <TouchableOpacity style={styles.titleViewTappable} onPress={this.onTitleTapped.bind(this)} activeOpacity={1}>
                <Image style={styles.dropDownImageStyle} source={Images.topBarDropdownIcon} />
                <Text style={styles.titleTextTappable} numberOfLines={1}>
                    {this.props.title}
                </Text>
            </TouchableOpacity>
        );
    }


    render() {
        containerStyle = this.props.isTitleTappable == true ? [styles.container, { justifyContent: 'center' }] : styles.container
        return (
            <View style={containerStyle}>
                <TouchableOpacity style={styles.leftButton} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                    {/* <Image source={this.props.isLeftItemTypeLogo
                        ? Images.topBarLogoBlack
                        : Images.topBarBackBtn} /> */}
                    <Icon size={20} name={(this.props.isLeftItemTypeLogo) ? "bars" : "caret-left"} size={24} color={(this.props.isLeftItemTypeLogo) ? "#000" : "#8C9230"} />
                    {/* <Icon size={20} name={"circle"} size={14} color={"#8C9230"} style={{marginLeft: 15, marginTop: -10}} /> */}
                </TouchableOpacity>
                {(this.props.isTitleTappable == true)
                    ?
                    <PopoverTooltip
                        ref='tooltip'
                        buttonComponent={
                            this.titleViewTappable()
                        }
                        labelStyle={styles.labelStyle}
                        tooltipContainerStyle={{ width: 150 }}
                        timingConfig={{ duration: 1 }}
                        opacityChangeDuration={1}
                        items={[
                            {
                                label: kARTWORK,
                                onPress: () => {
                                    if (this.props.onMenuClick != undefined) {
                                        this.props.onMenuClick({ "index": 0, "title": kARTWORK })
                                    }
                                }
                            },
                            {
                                label: kARTIST,
                                onPress: () => {
                                    if (this.props.onMenuClick != undefined) {
                                        this.props.onMenuClick({ "index": 1, "title": kARTIST })
                                    }
                                }
                            },
                            {
                                label: kEVENTS,
                                onPress: () => {
                                    if (this.props.onMenuClick != undefined) {
                                        this.props.onMenuClick({ "index": 2, "title": kEVENTS })
                                    }
                                }
                            }
                        ]}
                    />
                    : this.titleView()}
                {/* {this.props.showSearchBtn == true ?
                    <View style={styles.rightBtnView}>
                        <TouchableOpacity style={styles.cartButton} onPress={this.cartBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.articleAddedCartIcon}></Image>
                        </TouchableOpacity>
                    </View>
                    : null
                } */}

                <View style={styles.rightBtnView}>
                    {this.props.showCalenderBtn == true
                        ? <TouchableOpacity style={styles.rightButton} onPress={this.calenderBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarCalender}></Image>
                        </TouchableOpacity>
                        : null
                    }

                    {this.props.showNotificationBtn == true
                        ? <TouchableOpacity style={styles.rightButton} onPress={this.notificationBtnTapped.bind(this)} activeOpacity={0.7}>
                            {this.state.notificationCount > 0
                                ? <Image source={Images.notificationsIconSelected}></Image>
                                : <Image source={Images.notificationsIcon}></Image>
                            }
                        </TouchableOpacity>
                        : null
                    }

                    {this.props.showSearchBtn == true
                        ? <TouchableOpacity style={styles.rightButton} onPress={this.searchBtnTapped.bind(this)} activeOpacity={0.7}>
                            {/* <Image source={Images.topBarSearchBlack}></Image> */}
                            <Icon name="search" size={24} color="#000" style={{transform: [{ rotate: '90deg' }]}} />
                        </TouchableOpacity>
                        : null
                    }

                    {this.props.showOptionsBtn == true
                        ? <TouchableOpacity ref={(optionBtn) => { this.optionBtn = optionBtn }} style={styles.rightButton} onPress={this.optionBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarMore}></Image>
                        </TouchableOpacity>
                        : null
                    }

                    {this.props.showDoneButton == true
                        ? <TouchableOpacity style={styles.doneView} onPress={this.doneBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Text style={styles.doneBtnText}>
                                {this.props.doneText}
                            </Text>
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View >
        );
    }
}
export default TopbarView
