import React, { Component } from 'react';
import { 
    FlatList, 
    Text, 
    View, 
    Alert, 
    TouchableWithoutFeedback, 
    TouchableOpacity, 
    NativeModules 
} from 'react-native';

import styles from './styles'

import TopbarView from '../../component/TopbarView'
import INTSegmentControl from '../../component/INTSegmentControl';
import { CachedImage } from 'react-native-cached-image';
import INTButton from '../../component/INTButton';
import SafeAreaView from '../../component/SafeAreaView';
import MediumList from '../../component/INTSegmentControl/MediumList';

import Settings from '../../config/Settings';
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import ModalBox from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';

var UtilityController = NativeModules.UtilityController;

import Spinner from 'react-native-loading-spinner-overlay';

class SavedArtworkViewController extends Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        Utility.navigator = this.props.navigator;

        this.state = {
            ModalVisible: false,
            selectedArtwork: {},
            selectedArtworkIndex: 0,
            isShowMediumList: false,
            selectedMediumIndex: 0,
            selectedMediumName: "All",
            spinnerVisible: false,
            selectedsegmentID: 0,
            arrArtworkList: [],
            page: 1,
            totalRecords: 0,
            error: null,
            arrCategoryList: [],
            isRecordAvailable: false,
            isDataReceived: false,
        }
    }

    componentDidMount() {
        this.getCategories()
        this.getSavedArtworksAPI()
    }

    //API
    getCategories() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
            'type': 'preferred_medium',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.length > 0) {
                    var itemAll = {
                        "id": 0,
                        "name": "   All   "
                    }
                    response.splice(0, 0, itemAll) // index position, number of item delete, item
                    this.setState({ arrCategoryList: response })
                } else {
                    this.setState({ spinnerVisible: false })
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }
    // SavedArtowrk API
    getSavedArtworksAPI() {
        var preferredId = this.state.selectedsegmentID == 0 ? '' : this.state.selectedsegmentID
        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.user.user_id + '',
            'page': this.state.page + '',
            'preferred_medium_id': preferredId + '',
        };
        console.log('params', params);
        WebClient.postRequest(Settings.URL.SAVED_ARTWORK_LIST, params, (response, error) => {
            this.setState({ isDataReceived: true, spinnerVisible: false });
            if (error == null) {
                this.setState({ arrArtworkList: this.state.page > 1 ? [...this.state.arrArtworkList, ...response.result] : response.result, totalRecords: response.totalcount, isRecordAvailable: response.result.length > 0 ? true : false })
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    endOfSavedArtworkFlatList() {
        if (this.state.arrArtworkList.length < this.state.totalRecords) {
            this.setState({
                spinnerVisible: true,
                page: this.state.page + 1
            }, this.getSavedArtworksAPI.bind(this))
        }
    }

    showAlertForUnSaved(artwork, index) {
        Alert.alert(
            'Remove',
            'Are you sure remove from saved artwork?',
            [
                { text: 'No', onPress: () => console.log("Cancel"), style: 'cancel' },
                { text: 'Yes', onPress: () => this.callSaveArtworkAPI(artwork, index) },
            ],
            { cancelable: true }
        )
    }

    // Favorite Artwork
    callSaveArtworkAPI(artwork, index) {
        console.log(artwork, index);
        this.setState({ spinnerVisible: true, ModalVisible: false });
        WebClient.postRequest(Settings.URL.SAVE_ARTWORK, {
            'user_id': Utility.user.user_id + '',
            'artwork_id': artwork.artwork_id + '',
            'artist_id': artwork.user_id + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var tempArray = this.state.arrArtworkList;
                tempArray.splice(index, 1)
                this.setState({ arrArtworkList: tempArray })
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    btnCartTapped() {
        let artwork = this.state.selectedArtwork;
        let index = this.state.selectedArtworkIndex;

        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.getUserId(),
            'artwork_id': artwork.artwork_id + '',
            'quantity': '1',// default 
            'cart_id': '0',// 0 for new add 
            'unique_device_id': Utility.deviceId + '',
        };
        WebClient.postRequest(Settings.URL.ADD_TO_CART, params, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var tempArray = this.state.arrArtworkList;
                tempArray[index].is_incart = 1;
                tempArray[index].cart_id = response.cart_id;
                this.setState({ arrArtworkList: tempArray, ModalVisible: false })
                Utility.showToast(Utility.MESSAGES.added_to_cart);
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    showModal(artwork, index) {
        this.setState({ 
            ModalVisible: true, 
            selectedArtwork: artwork, 
            selectedArtworkIndex: index 
        });
    }

    popUpClose = () => {
        this.setState({ ModalVisible: false });
    }

    // Flatlist Cell
    renderArtworkViewCell(rowData) {
        var artwork = rowData.item
        var index = rowData.index
        let firstPhotUrl = undefined

        if ((artwork.artwork_photos).length > 0) {
            firstPhotUrl = (artwork.artwork_photos[0]).image_path
        }

        return (
            <TouchableWithoutFeedback onPress={() => this.onArtworkCellDidTapped(artwork)}>
                <View style={styles.gridViewCellStyle}>
                    {/* <ProgressiveImage
                        style={styles.articleImageStyle}
                        uri={firstPhotUrl}
                        placeholderSource={Images.placeholderMediaImage}
                        borderRadius={1} /> */}
                    <CachedImage
                        style={styles.articleImageStyle}
                        source={{
                            uri: firstPhotUrl
                        }}
                        fallbackSource={Images.placeholderMediaImage}
                    />
                    <View style={styles.articleDescriptionStyle}>
                        <View style={styles.nameContainerView}>
                            <View style={styles.projectNameView}>
                                <Text style={styles.projectNameText} numberOfLines={1}>{artwork.title}</Text>
                                <Text style={styles.priceText}>{'$' + artwork.price}</Text>
                            </View>
                            <Text style={styles.artistNameText} numberOfLines={1}>{artwork.full_name}</Text>
                        </View>
                        {/* <View style={styles.articleIconView}> */}
                        <View style={{alignItems: 'center', alignContent: 'center', alignSelf: 'center'}}>
                            {/* <INTButton icon={artwork.is_incart == 0 ? Images.articleCartIcon : Images.articleAddedCartIcon} onPress={() => this.btnCartTapped(artwork, index)} />   // commented by Wang 2/26/2019 */}
                            {/* <INTButton icon={artwork.is_saved == 1 ? Images.articleFavoriteSelectIcon : Images.articleFavoriteNonSelectIcon} onPress={() => this.showAlertForUnSaved(artwork, index)} />
                            <INTButton icon={artwork.is_incart == 0 ? Images.articleCartIcon : Images.articleAddedCartIcon} />
                            <INTButton icon={Images.articleShareBlueIcon} onPress={() => this.btnShareTapped(artwork)} /> */}
                            <Icon size={20} name={"ellipsis-h"} color={"#000"} onPress={() => this.showModal(artwork, index)} />
                        </View>
                        <Text style={styles.articleTypeText}>{artwork.preferred_medium}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
    }



    //Artwork Flatlist cell tap event
    onArtworkCellDidTapped(artwork) {
        Utility.push('ArtDetailViewController', { artwork_id: artwork.artwork_id })
    }

    btnCartTapped(artwork, index) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.ADD_TO_CART, {
            'user_id': Utility.user.user_id + '',
            'artwork_id': artwork.artwork_id + '',
            'quantity': 1 + '',// default 
            'cart_id': 0 + '',// 0 for new add 
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var tempArray = this.state.arrArtworkList;
                tempArray[index].is_incart = (this.state.arrArtworkList[index].is_incart == 1 ? 0 : 1)
                this.setState({ arrArtworkList: tempArray })
                if (tempArray[index].is_incart == 1) {
                    Utility.showToast(Utility.MESSAGES.added_to_cart);
                } else {
                    Utility.showToast(Utility.MESSAGES.removed_from_cart);
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    btnShareTapped(artwork) {
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
    }

    onShareTapped() {
        let artwork = this.state.selectedArtwork;
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
    }

    showMediumList = (value) => {
        this.setState({isShowMediumList: value});
    }

    render() {
        var Modalbox = <ModalBox
            coverScreen={false}
            swipeToClose={false}
            backdropPressToClose={true}
            swipeToClose={false}
            backButtonClose={true}
            onClosed={() => this.setState({ ModalVisible: false })}
            style={styles.modalContainer}
            isOpen={this.state.ModalVisible}
            animationDuration={200}
            position='bottom'>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{width: '100%'}}>
                        <View 
                            style={{
                                width: '100%', 
                                backgroundColor: Colors.white, 
                                padding: 20, 
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            }}
                        >
                            {(this.state.selectedArtwork.is_incart == 0) && 
                                <TouchableOpacity onPress={() => this.btnCartTapped()} style={{width: '100%', alignItems: 'center'}}>
                                    <Text style={{fontSize: Utility.NormalizeFontSize(18)}}>Add to Cart</Text>
                                </TouchableOpacity>
                            }
                            {(this.state.selectedArtwork.is_incart == 1) && 
                                <TouchableOpacity onPress={() => this.removeFromCart()} style={{width: '100%', alignItems: 'center'}}>
                                    <Text style={{fontSize: Utility.NormalizeFontSize(18)}}>Remove from Cart</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{borderBottomColor: Colors.lightGray2Color, borderBottomWidth: 0.5}} />
                        <View style={{borderBottomColor: Colors.lightGray2Color, borderBottomWidth: 0.5}} />
                        <View 
                            style={{
                                width: '100%', 
                                backgroundColor: Colors.white, 
                                padding: 20
                            }}
                        >
                            <TouchableOpacity onPress={() => this.showAlertForUnSaved(this.state.selectedArtwork, this.state.selectedIndex)} style={{width: '100%', alignItems: 'center'}}>
                                <Text style={{fontSize: Utility.NormalizeFontSize(18)}}>
                                    Unsave Artwork
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{borderBottomColor: Colors.lightGray2Color, borderBottomWidth: 0.5}} />
                        <View 
                            style={{
                                width: '100%', 
                                backgroundColor: Colors.white, 
                                padding: 20, 
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                            }}
                        >
                            <TouchableOpacity onPress={() => this.onShareTapped()} style={{width: '100%', alignItems: 'center'}}>
                                <Text style={{fontSize: Utility.NormalizeFontSize(18)}}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View 
                        style={{
                            width: '100%', 
                            backgroundColor: Colors.white, 
                            padding: 20, 
                            borderRadius: 10,
                            marginTop: Utility.screenWidth / 25,
                            marginBottom: Utility.screenWidth / 25
                        }}
                    >
                        <TouchableOpacity onPress={() => this.popUpClose()} style={{width: '100%', alignItems: 'center'}}>
                            <Text style={{fontSize: Utility.NormalizeFontSize(18)}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ModalBox>

        return (
            <SafeAreaView style={styles.container}>
                <TopbarView
                    title={"SAVED ARTWORK"}
                    isTitleTappable={false}
                    isFirstLaunch={false}>
                </TopbarView>

                <View style={styles.subContainer}>
                    <View>
                        <View style={{ backgroundColor: Colors.topBarSeparator, height: 0.5, marginHorizontal: 6 }} />
                        <TouchableOpacity onPress={() => {this.setState({isShowMediumList: !this.state.isShowMediumList})}}>
                            <View 
                                style={{
                                    alignItems: 'center', 
                                    paddingVertical: 8, 
                                    alignSelf: 'center',
                                }}
                            >
                                <Text style={{fontSize: 16}}>Sort by: {this.state.selectedMediumName}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: Colors.topBarSeparator, height: 0.5, marginHorizontal: 6 }} />
                    </View>
                    {/* <INTSegmentControl // Category type horizontal Segment Component
                        controllStyle={styles.segmentControllerStyle}
                        arrSegment={this.state.arrCategoryList}
                        titleDisplayKey='name'
                        ItemIDKey='id'
                        segmentWidthStyle='dynamic'
                        titleStyle={styles.segmentTitle}
                        titleStyleSelected={styles.segmentSelectedTitle}
                        selectedSegmentStyle={{ backgroundColor: Colors.themeColor }}
                        selectionStyle='box'
                        onSelectionDidChange={(selectedIndex, segmentID) => {
                            this.setState({ isDataReceived: false, selectedsegmentID: segmentID }, () => { this.getSavedArtworksAPI() })
                        }}
                    /> */}
                    {(this.state.isRecordAvailable) ? // check if records available otherwise show no records label
                        <FlatList
                            onEndReachedThreshold={0.5}
                            onEndReached={() => this.endOfSavedArtworkFlatList()}
                            style={styles.gridViewComponentStyle}
                            data={this.state.arrArtworkList}
                            renderItem={this.renderArtworkViewCell.bind(this)}
                            numColumns={2}
                            extraData={this.state}
                            keyExtractor={(item, index) => index + ''}
                        />
                        :
                        this.state.isDataReceived ?
                            <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                            : null
                    }
                </View>
                {Modalbox}
                {this.state.isShowMediumList &&
                <MediumList
                    arrSegment={this.state.arrCategoryList}
                    onSelectionDidChange={(selectedObj, segmentIndex) => {
                        const buf = this.state.selectedMediumIndex;
                        this.setState({ 
                            isDataReceived: false, 
                            selectedsegmentID: selectedObj.id, 
                            isShowMediumList: false, 
                            selectedMediumName: selectedObj.name,
                            selectedMediumIndex: segmentIndex 
                        },
                            () => {
                                (buf != segmentIndex) ? 
                                    this.getSavedArtworksAPI()
                                : null
                            })
                    }}
                    isShowMediumList={this.state.isShowMediumList}
                    selectedMediumIndex={this.state.selectedMediumIndex}
                    onShowMediumList={this.showMediumList}
                />}
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView >
        );
    }
}
export default SavedArtworkViewController