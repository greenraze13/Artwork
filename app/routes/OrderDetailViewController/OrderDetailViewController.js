import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';

import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import INTButton from '../../component/INTButton'
import TextField from '../../component/TextField'
import SafeAreaView from '../../component/SafeAreaView';
import { CachedImage } from 'react-native-cached-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fonts from '../../config/Fonts';
import Spinner from 'react-native-loading-spinner-overlay';

class OrderDetailViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            art_total_price: 0,
            shipping_total_price: 0,
            deliveryTotalPrice: 0,
            grand_total_price: 0,
            service_fee: 0,
            orderdetail: this.props.orders,
            arrPastOrderList: this.props.orders.order_items,
            stripe_commission_percentage: this.props.orders.stripe_commission_percentage
        };
    }
    componentDidMount() {
        this.setTotalPrice(this.state.arrPastOrderList)
    }

    leftBtnTaaped() {
        if(this.props.fromScreen == "CheckoutView") {
            Utility.resetTo('CartViewController', { 'fromScreen': 'OrderDetailViewController' });
        } else {
            this.props.navigator.pop();
        }
    }

    btnContactUsTapped() {
        Utility.push('SupportViewController');
    }

    setTotalPrice(arrCartListTemp) {
        // console.log(JSON.stringify(arrCartListTemp));
        var totalShippingCost = 0;
        var totalDeliveryCost = 0;
        var totalPrice = 0;
        arrCartListTemp.forEach(function (element) {
            if ((element.is_custom_job == 1 && element.job_payment_type == 'onetime') || element.is_custom_job == 0) {
                totalPrice += (element.price * element.quantity) * (1 - this.state.stripe_commission_percentage/100);

                if (element.shipping_option == "shipping") {
                    totalShippingCost += element.shipping_option_cost;
                }

                if (element.shipping_option == "delivery") {
                    totalDeliveryCost += element.shipping_option_cost;
                }
            }
        }, this);

        var service_fee = (totalDeliveryCost + totalShippingCost + totalPrice) / (1 - this.state.stripe_commission_percentage/100) - (totalDeliveryCost + totalShippingCost + totalPrice);

        this.setState({
            art_total_price: totalPrice,
            shipping_total_price: totalShippingCost,
            deliveryTotalPrice: totalDeliveryCost,
            service_fee,
            grand_total_price: (totalDeliveryCost + totalShippingCost + totalPrice + service_fee)
        });
    }

    renderPastOrderViewCell(rowData) {
        var orderdetail = rowData.item
        // console.log('orderdetail = ', JSON.stringify(orderdetail))
        return (

            <View style={styles.orderItemStyle}>
                {orderdetail.is_custom_job == 1 ? null :
                    <TouchableOpacity onPress={() => this.onArtworkTapped(orderdetail)} activeOpacity={0.9}>
                        {/* <ProgressiveImage
                        style={styles.artImageStyle}
                        uri={orderdetail.artwork_photos.length > 0 ? orderdetail.artwork_photos[0].thumb_name : undefined}
                        placeholderSource={Images.placeholderMediaImage}
                        borderRadius={1} /> */}
                        <CachedImage
                            style={styles.artImageStyle}
                            source={{
                                uri: orderdetail.artwork_photos.length > 0 ? orderdetail.artwork_photos[0].thumb_name : undefined
                            }}
                            fallbackSource={Images.placeholderMediaImage}
                        />
                    </TouchableOpacity>
                }
                <View style={[styles.viewArtistInfo, { marginLeft: orderdetail.is_custom_job == 1 ? 0 : 10, }]}>
                    <Text style={styles.textArtworkName} numberOfLines={1}>
                        {orderdetail.title}
                    </Text>
                    <Text style={styles.textItemArtistName} numberOfLines={1}>
                        {orderdetail.full_name}
                    </Text>
                    <INTButton buttonStyle={styles.btnChat}
                        icon={Images.chat}
                        title="Chat"
                        titleStyle={styles.titleChat}
                        spaceBetweenIconAndTitle={0}
                        onPress={() => this.onChatTapped(orderdetail)} />
                </View>
                <View style={styles.viewPriceOrder}>
                    <Text style={styles.textPriceOrder} numberOfLines={1}>
                        {Utility.DOLLOR}{Utility.parseFloat(orderdetail.price * (1 - this.state.stripe_commission_percentage/100))}
                    </Text>
                    <Text style={styles.textQuantity} numberOfLines={1}>
                        Qty: {orderdetail.quantity}
                    </Text>
                </View>
            </View>

        );
    }
    onArtworkTapped(orderdetail) {
        Utility.push('ArtDetailViewController', { artwork_id: orderdetail.artwork_id })
    }
    onChatTapped(orderdetail) {
        var reqParam = {
            isFromCommissionScreen: false,
            receiverId: orderdetail.artist_id,
            receiverName: orderdetail.full_name,
            isCustomJobChat: orderdetail.is_custom_job,
            orderItemId: orderdetail.order_item_id,
            commissionRequestId: orderdetail.is_custom_job == 1 ? orderdetail.commission_request_id : 0,
        }
        // console.log('reqParam', reqParam)
        Utility.push('MessageInsideViewController', reqParam)
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    {/*TOPBAR VIEW*/}
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackGreen} />
                            <Text style={styles.titleTextStyle}>ORDER #{this.state.orderdetail.order_id}</Text>
                        </TouchableOpacity>
                    </View>
                    {/*Header View*/}
                    <View style={styles.viewHeader}>
                        <Text style={styles.textSelected} > {Utility.getDateMMMdd(this.state.orderdetail.order_date)}</Text>
                        <Text style={styles.textSelected} >{this.state.orderdetail.total_items > 1 ? this.state.orderdetail.total_items + " Items" : this.state.orderdetail.total_items + " Item"} </Text>
                    </View>
                    <View style={styles.viewLine}>
                    </View>
                    {/*Card And Order Listing*/}
                    <KeyboardAwareScrollView
                        style={{ marginTop: 2 }}
                        extraScrollHeight={10}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        {(this.state.arrPastOrderList.length > 0) ? // check if records available otherwise show no records label
                            <FlatList
                                style={styles.listViewCellStyle}
                                data={
                                    this.state.arrPastOrderList
                                }
                                renderItem={
                                    this.renderPastOrderViewCell.bind(this)
                                }
                                numColumns={1}
                                extraData={this.state}
                                keyExtractor={(item, index) => index + ''}
                            />
                            : <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                        }
                    </KeyboardAwareScrollView>

                    <View style={{ alignItems: 'flex-end', paddingVertical: 15, marginHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.textTotalPriceTitle, { color: Colors.blueType1 }]}>Art</Text>
                            <Text style={[styles.textTotalPrice, { color: Colors.blueType1 }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.art_total_price)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 4, }}>
                            <Text style={[styles.textTotalPriceTitle, { color: Colors.blueType1 }]}>Shipping</Text>
                            <Text style={[styles.textTotalPrice, { color: Colors.blueType1 }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.shipping_total_price)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 4, }}>
                            <Text style={[styles.textTotalPriceTitle, { color: Colors.blueType1 }]}>Delivery</Text>
                            <Text style={[styles.textTotalPrice, { color: Colors.blueType1 }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.deliveryTotalPrice)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 4, }}>
                            <Text style={[styles.textTotalPriceTitle, { color: Colors.blueType1 }]}>Service fee</Text>
                            <Text style={[styles.textTotalPrice, { color: Colors.blueType1 }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.service_fee)}</Text>
                        </View>
                        <View style={styles.viewBetTotalNGrandTotal} />
                        <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 25 }}>
                            <Text style={[styles.textTotalPriceTitle, { color: Colors.themeColor }]}>Total</Text>
                            <Text style={[styles.textTotalPrice, { color: Colors.themeColor }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.grand_total_price)}</Text>
                        </View>
                        <Text style={{ textAlign: 'center', alignSelf: 'center', color: Colors.blueType5, marginBottom: 5, fontSize: Utility.NormalizeFontSize(13) }}>Need Help?</Text>
                        <INTButton buttonStyle={styles.btnChekout}
                            title="Contact Us"
                            titleStyle={styles.titleCheckout}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => this.btnContactUsTapped()} />
                    </View>
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default OrderDetailViewController