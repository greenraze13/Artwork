import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import { Platform } from 'react-native';

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    subContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    // Search Component    
    searchView: {
        height: Settings.topBarHeight,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        marginTop: Utility.isPlatformAndroid ? 0 : Utility.isiPhoneX ? 40 : 20
    },
    inputWrapper: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    inputText: {
        flex: 1,
        fontFamily: Fonts.promptRegular,
        color: Colors.blueType2,
        padding: 4,
    },
    btnClose: {
        padding: 0,
        justifyContent: 'center',
    },

    //AutoSuggestionList
    autoSuggestionContainer: {
        position: 'absolute',
        width: Utility.screenWidth - 80,
        marginHorizontal: 40,
        marginTop: 71,
        maxHeight: 150
    },
    autoSuggestionRowItem: {
        height: 30,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    saperatorStyle: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.grayBorderColor
    },
    // Category Component
    segmentControllerStyle: {
        marginTop: 10,
        marginBottom: 10,
        height: 26,
        backgroundColor: Colors.white,
        marginHorizontal: 15,
    },
    segmentTitle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(14),
        color: Colors.categoryTextGray,
    },
    segmentSelectedTitle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(14),
        color: Colors.white,
    },

    noRecordsFoundTextStyle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(16),
        color: Colors.lightGray3Color,
        flex: 1,
        textAlign: 'center',
        marginTop: 200,
    },

    // Flatlist Component
    gridViewComponentStyle: {
        // marginTop: 30,               original
        // marginHorizontal: 6          original
        marginTop: 10,
        marginHorizontal: 6,
        backgroundColor: Colors.white
    },
    gridViewCellStyle: {
        minWidth: Utility.screenWidth / 2 - 10,
        maxWidth: Utility.screenWidth / 2 - 10,
        height: 250,
        marginTop: 0,
        marginRight: 6,
        marginBottom: 8,
        // backgroundColor: Colors.grayType1,
    },
    imageCell: {
        // position: 'absolute',
        flex: 0.9,
        // backgroundColor: 'red'
    },
    imageCellOuter: {
        // position: 'absolute',
        flex: 0.95,
        // backgroundColor: 'green',

    },

    //renderArtworkViewCell
    articleImageStyle: {
        flex: 0.65,
        borderWidth: 0.5,
    },
    articleDescriptionStyle: {
        marginHorizontal: 12,
        flex: 0.55,
    },
    nameContainerView: {
        marginTop: 10,
    },
    projectNameView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    projectNameText: {
        flex: 1,
        fontSize: Utility.NormalizeFontSize(14),
        fontFamily: Fonts.promptRegular
    },
    priceText: {
        fontSize: Utility.NormalizeFontSize(11),
        fontFamily: Fonts.promptRegular,
        justifyContent: 'flex-end',
        color: Colors.themeColor,
        marginHorizontal: 5
    },
    artistNameText: {
        // marginLeft: 8,
        fontSize: Utility.NormalizeFontSize(11),
        color: Colors.grayType2,
        alignSelf: 'center'
    },
    articleIconView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 5,
        marginVertical: 12,
    },
    articleTypeText: {
        fontFamily: Fonts.promptRegular,
        alignSelf: 'center',
        justifyContent: 'center',
        // color: Colors.grayType3,
        color: Colors.black,
        width: "100%",
        textAlign: 'center',
        fontSize: Utility.NormalizeFontSize(12),
    },

    //renderArtistViewCell
    artistViewCellArticleImageStyle: {
        // marginHorizontal: 5,
        // marginTop: 15,
        // minHeight: 100,
        flex: 1,
        // backgroundColor: 'red',
    },
    artistDescriptionStyle: {
        marginHorizontal: 5,
        marginTop: 4,
        // flex: 0.45,
    },
    artistNameContainerView: {
        // marginTop: 10,
        flexDirection: 'row',
    },
    artistImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        position: 'absolute',
        // borderWidth: 1,
        // borderColor: 'white',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        marginTop: 125,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'white',
        shadowOpacity: 1,
        elevation: 5,
    },
    artistPlaceHolderPhoto: {
        height: 50,
        width: 50,
        // borderWidth: 1,
        borderColor: Colors.blueType2,
        resizeMode: 'cover',
    },
    artistNameContainerStyle: {
        // marginLeft: 5,
        marginRight: 0,
        marginTop: 5,
        flex: 1,
        // height: 45,
    },
    artistViewCellArtistNameText: {
        marginTop: 2,
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.promptMedium,
        color: Colors.black,
        textAlign: 'center',
        // backgroundColor:'green',
    },
    artistViewCellMediumOfWork: {
        color: Colors.grayType2,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(13),
        textAlign: 'center',
        // backgroundColor:'blue',
    },
    artistDescriptionView: {
        marginTop: 6,
        // marginHorizontal: 10,
    },
    artistShortDescText: {
        alignSelf: 'center',
        justifyContent: 'center',
        color: Colors.grayType2,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(10),
    },
    artistTypeText: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.lightGray4Color,
        width: "100%",
        textAlign: 'center',
        // backgroundColor:'red',
    },

    // Calendar
    calendar: {
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
    },
    //Event list
    listViewCellStyle: {
        marginTop: 12,
        backgroundColor: Colors.white
    },
    eventItemStyle: {
        // height: 86, //Image height 60 and 3 padding
        flexDirection: 'row',
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: Colors.blueType4,
        marginHorizontal: 6,
        backgroundColor: Colors.grayType1,
        marginTop: 6,
        // padding: 3
    },
    eventImageStyle: {
        height: 80,
        width: 80,
        backgroundColor: Colors.transparent,
    },
    viewEventNameStyle: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    textEventName: {
        color: Colors.black,
        fontFamily: Fonts.promptMedium,
        fontSize: Utility.NormalizeFontSize(14)
    },
    textEventInfo: {
        flex: 1,
        color: Colors.grayTextColor2,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginTop: -4
    },
    viewPriceCart: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    textPriceCart: {
        color: Colors.blueType2,
        fontFamily: Fonts.promptLight,
        textAlign: 'center',
        fontSize: Utility.NormalizeFontSize(11),
        marginHorizontal: 10
    },
    txtNoEventFoundStyle: {
        alignSelf: 'center',
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(16),
        color: Colors.grayTextColor,
        marginTop: 100
    },
    markDayTextStyle: {
        marginTop: 5,
        fontSize: 14,
        color: Colors.themeColor,
    },
    markDayContainerStyle: {
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: 16
    },
    selectedDayTextStyle: {
        marginTop: 5,
        fontSize: 14,
        color: Colors.white,
    },
    modalContainer: {
        backgroundColor: 'transparent',
        width: Utility.screenWidth - 20,
        height: Utility.screenHeight / 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    headerTextStyle: {
        color: Colors.black,
        fontSize: Utility.NormalizeFontSize(18),
        fontFamily: Fonts.santanaBold,
        paddingVertical: 8,
    },
    closeTextStyle: {
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.santanaBold,
        padding: 6,
    },
});