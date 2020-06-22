import Utility from './Utility';
import WebClient from './WebClient';
import RNAccountKit, { Color, StatusBarStyle } from 'react-native-facebook-account-kit'
//BASE_URL = 'http://192.168.10.46:5011/api/'; // Vishal system
//BASE_URL = 'http://192.168.10.191:5011/api/'; // hardik system
// BASE_URL = 'http://192.168.10.13:5011/api/'; // git staging
// BASE_URL = 'http://52.25.140.200:5011/api/'; // to give client

export const Settings = {
  GOOGLE_CLIENT_ID_FOR_IOS: "68937573375-q52g59t0uu3pv2erc4qk7pfr1r8092kv.apps.googleusercontent.com",
  // ARTOWORK_IMAGE_CDN : 'dvw0obt09seph.cloudfront.net',                 // added by Wang Jan/24/2019
  // ARTOWORK_THUMBNAIL_IMAGE_CDN : 'd14zmposbtx8tr.cloudfront.net',      // added by Wang Jan/24/2019

  URL: {
    GET_CONVERSATION: WebClient.SERVER_BASE_URL + 'chat/get-conversations', //GET
    GET_CHAT_LIST: WebClient.SERVER_BASE_URL + 'chat/get-chat-list', //GET
    GET_CHAT_LIST_WITH_ARTIST: WebClient.SERVER_BASE_URL + 'chat/get-chat-list-with-artist', //GET
    ADD_MESSAGE: WebClient.SERVER_BASE_URL + 'chat/add-message', // POST
    ADD_MESSAGE_WITH_ARTIST: WebClient.SERVER_BASE_URL + 'chat/add-message-with-artist', // POST
    MEDIA_UPLOAD_CHAT: WebClient.SERVER_BASE_URL + 'user/mediaupload',//POST

    SEND_OTP: 'user/send-otp',
    SAVE_TOKEN: 'user/save-token',
    CMS: 'master/get-cms',
    USER_LOGIN: 'user/login',//POST
    PRE_SIGNUP: 'user/pre-signup',//POST
    SIGNUP: 'user/signup',//POST
    SOCIAL_LOGIN: 'user/social-login',//POST
    MEDIA_UPLOAD: 'user/mediaupload',//POST

    FORGOT_PASSWORD: 'user/forgotpassword',//POST
    EDIT_PROFILE: 'user/editprofile',//POST
    GET_MASTER_DATA: 'master/get-master-data',//POST  //tags,preferred_medium,size,project_type
    REQUEST_FOR_ARTIST: 'user/request-for-artist', //POST
    GET_ARTWORKS: 'customer/get-artworks',//POST
    GET_ARTWORKS_V2: 'customer/v2/get-artworks',//POST    //added by Wang Feb/18/2019
    GET_ARTIST: 'customer/get-artist',//POST
    ADD_ARTWORK: 'artist/add-artwork', //POST
    ADD_ARTWORK_V2: 'artist/v2/add-artwork', //POST      added by Wang 1/24/2019
    SEARCH_KEYWORDS: 'master/search-keywords', //GET    
    GET_ARTIST_DETAIL: 'customer/get-artist-detail', //POST
    FOLLOW_ARTIST: 'customer/follow-artist', //POST
    SAVE_ARTWORK: 'customer/save-artwork', //POST    

    ADD_TO_CART: 'cart/add-to-cart', //POST    
    ADD_TO_CART_V2: 'cart/v2/add-to-cart', //POST       added by Wagn Feb/18/2019
    GET_CART: 'cart/get-cart', //POST    
    GET_CART_V2: 'cart/v2/get-cart', //POST          added by Wang Feb/18/2019
    GET_ORDER_ITEM_BY_ID_V2: 'order/v2/get-order-item-by-id', // POST     added by Wang Apr/15/2019
    GET_ORDER_LIST: 'order/get-order-list', //POST    
    GET_ORDER_LIST_V2: 'order/v2/get-order-list', //POST       added by Wang 04/08/2019
    REMOVE_FROM_CART: 'cart/remove-to-cart', //POST    
    SHARE_ARTWORK: 'customer/share-artwork', //POST    
    PLACE_ORDER: 'order/place-order', //POST    
    PLACE_ORDER_V2: 'order/v2/place-order', //POST    
    GET_SOLD_ARTWORK: 'order/get-sold-artwork-list', //POST    
    GET_ARTIST_ARTWORK: 'customer/get-artist-artworks', //POST    



    SAVED_ARTWORK_LIST: 'customer/get-favourite-list', // GET
    GET_FOLLOWED_ARTIST: 'customer/get-following-artist', // GET
    GET_USER_LIST: 'customer/get-user-list',
    ADD_JOB_REQUEST: 'job/add-job-request',
    GET_NEW_REQUEST_LIST: 'job/request-list',
    GET_ONGOING_JOB_LIST: 'cart/get-ongoing-job-list',
    GET_COMPLETED_JOB_LIST: 'order/get-completed-job-list',
    CREATE_CUSTOM_JOB: 'job/create-custom-job',
    GET_ARTWORK_DETAIL: 'customer/get-artwork-detail',//POST
    GET_ARTWORK_DETAIL_V2: 'customer/v2/get-artwork-detail',//POST      added by wang 1/24/2019
    REMOVE_ARTWORK: 'artist/remove-artwork',//POST
    GET_PAYMENT_LIST: 'order/get-artwork-payment-list',//POST 
    ORDER_STATUS_UPDATE: 'order/artwork-order-status-update',//POST 
    GET_PROFILE_INFO: 'user/get-profile-info',//POST 
    CHANGE_PASSWORD: 'user/changepassword',//POST

    GET_EVENT_LIST: 'event/event-list',
    GET_EVENT_DETAILS: 'event/event-detail',

    UPDATE_SETTINGS: 'user/update-setting',
    GET_NOTIFICATIONS_LIST: 'user/get-notification-list',

    ADD_CONTACT_REQUEST: 'user/add-contact-us-request',

    ADD_PRODUCT_DELIVERY_TYPE: 'cart/add-product-delivery-type',
    REPORT_ARTWORK: 'customer/report-artwork',
    REMOVE_FROM_ONGOING_LIST: 'cart/remove-to-ongoing-list',

    ADD_BANK_INFO: 'order/add-bank-details',
    GET_BANK_INFO: 'order/get-bank-details',
    TRANSFER_MONEY: 'order/transfer-money',

    CHECK_PHONE: 'user/check-phone',
    GET_JOB_DETAIL: 'customer/get-job-detail',
    LOGOUT: 'user/logout',
    GET_AWS: 'master/get-aws',
    GET_GUEST_CART_COUNT: 'user/get-guest-cart-count',
    ADD_SUBSCRIPTION: 'user/add-user-subscription',
    // GET_VISITED_LIST: 'user/get-visited-list',
    // UPDATE_VISITED_LIST: 'user/update-visited-list',
  },

  topBarHeight: Utility.isPlatformAndroid
    ? 50
    : 50,
  topBarTopPadding: Utility.isPlatformAndroid
    ? 0
    : 0,
  topBarHorizontalPadding: 10,
  titleFontSize: 20,
};

Settings.configureMobileVerificationView = function (mobileNumber, countryCode) {
  // console.log("**********Code" + countryCode)
  RNAccountKit.configure({
    //responseType: 'token' | 'code' // 'token' by default,
    titleType: 'login',
    initialAuthState: '',
    initialEmail: '',
    initialPhoneCountryPrefix: countryCode != ''
      ? countryCode
      : '+1',
    initialPhoneNumber: mobileNumber,
    facebookNotificationsEnabled: true, // true by default
    readPhoneStateEnabled: true, // true by default,
    receiveSMS: true, // true by default,
    // countryWhitelist: ['US'], // [] by default
    // countryBlacklist: ['US'], // [] by default
    defaultCountry: 'US',
    theme: {
      // Background
      backgroundColor: Color.rgba(255, 255, 255, 1),
      //backgroundImage: 'background.png',
      // Button
      buttonBackgroundColor: Color.hex('#FAB20B'),
      buttonBorderColor: Color.hex('#FAB20B'),
      buttonTextColor: Color.rgba(255, 255, 255, 1),
      // Button disabled
      buttonDisabledBackgroundColor: Color.rgba(250, 178, 11, 0.5),
      buttonDisabledBorderColor: Color.rgba(250, 178, 11, 0.5),
      buttonDisabledTextColor: Color.rgba(255, 255, 255, 0.5),
      // Header
      headerBackgroundColor: Color.hex('#FAB20B'),
      headerButtonTextColor: Color.rgba(255, 255, 255, 1),
      headerTextColor: Color.rgba(255, 255, 255, 1),
      // Input
      inputBackgroundColor: Color.rgba(255, 255, 255, 1),
      inputBorderColor: Color.hex('#FAB20B'),
      inputTextColor: Color.hex('#777777'),
      // Others
      iconColor: Color.hex('#FAB20B'),
      textColor: Color.hex('#FAB20B'),
      titleColor: Color.rgba(255, 255, 255, 1),
      // Header
      statusBarStyle: StatusBarStyle.LightContent, // or StatusBarStyle.Default
    }
  })
}

export default Settings;
