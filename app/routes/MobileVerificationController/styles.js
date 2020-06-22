import { StyleSheet } from 'react-native';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Utility from '../../config/Utility';

export const brandColor = Colors.themeColor;

export default StyleSheet.create({
    container: {
      flex: 1,
    },
    countryPicker: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnVerify: {
      backgroundColor: Colors.green,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: 120,
      minHeight: 30,
      //marginBottom: 20,
      borderRadius: 20,
      marginTop: 30,
    },
    titleVerify: {
      color: 'white',
      fontSize: 14,
      fontFamily: Fonts.promptLight,
      backgroundColor: 'transparent',
    },
    abuseButtonStyle: {
      backgroundColor: Colors.blueType1,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: 120,
      minHeight: 30,
      //marginBottom: 20,
      borderRadius: 20,
      marginTop: 30,
      // backgroundColor: Colors.blueType1,
      // borderRadius: 5,
      // marginVertical: 10,
      // marginHorizontal: 10
    },
    abuseButtonTextStyle: {
      color: 'white',
      fontSize: 14,
      fontFamily: Fonts.promptLight,
      backgroundColor: 'transparent',
        // textAlign: 'center',
        // color: 'white',
        // marginHorizontal: 15,
    },
    inputText: {
      flex: 1,
      paddingVertical: 6,
      fontFamily: Fonts.promptLight,
      color: Colors.blueType2,
      fontSize: Utility.NormalizeFontSize(15),
    },
    inputWrapper: {
      height: 48
    },
    header: {
      textAlign: 'center',
      marginTop: 60,
      fontSize: 22,
      margin: 20,
      color: '#4A4A4A',
    },
    form: {
      margin: 20
    },
    textInput: {
      padding: 0,
      margin: 0,
      flex: 1,
      fontSize: 16,
      color: brandColor,
      borderBottomColor:'grey',
      borderBottomWidth:0.5,
      height: 36,
    },
    button: {
      marginTop: 20,
      height: 50,
      backgroundColor: brandColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontFamily: 'Helvetica',
      fontSize: 16,
      fontWeight: 'bold'
    },
    didntGetText: {
      margin: 10,
      fontSize: 14,
      textAlign: 'center',
    },
    wrongNumberText: {
      margin: 10,
      fontSize: 14,
      textAlign: 'center',
      color:brandColor,
    },
    disclaimerText: {
      marginTop: 30,
      fontSize: 12,
      color: 'grey'
    },
    callingCodeView: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    callingCodeText: {
      fontSize: 16,
      color: brandColor,
      fontFamily: 'Helvetica',
      fontWeight: 'bold',
      paddingRight: 10
    }
  });
  