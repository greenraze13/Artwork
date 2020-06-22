import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Modal, Text, Platform, FlatList, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SearchBar from 'react-native-searchbar';
import _ from 'lodash';
import Fonts from '../../config/Fonts';

// import cca2List from '../data/cca2';
import { getHeightPercent } from './ratio';
import CloseButton from './CloseButton';
import styles from './CountryPicker.style';
import AlphabetPicker from './AlphabetPicker';
import EmojiComponent from './Emoji';
const SearchIcon = (props) => <AntDesign {...props} name="search1" />;

let countries = null;
let Emoji;

// Maybe someday android get all flags emoji
// but for now just ios
// const isEmojiable = Platform.OS === 'ios' ||
// (Platform.OS === 'android' && Platform.Version >= 21);
const isEmojiable = Platform.OS === 'ios';

if (isEmojiable) {
  countries = require('./data/countries-emoji');
  Emoji = EmojiComponent;
} else {
  countries = require('./data/countries');
  Emoji = <View />;
}
export default class CountryPicker extends Component {
  static defaultProps = {
    translation: 'eng',
  };

  static propTypes = {
    cca2: PropTypes.string.isRequired,
    phoneSelector: PropTypes.bool,
    tileSelector: PropTypes.bool,
    showLetters: PropTypes.bool,
    translation: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    closeable: PropTypes.bool,
    children: PropTypes.node,
    requiredCountries: PropTypes.array,
    searchable: PropTypes.bool,
  };

  static renderImageFlag(cca2, imageStyle) {
    let source = countries[cca2] ? countries[cca2].flag : '';
    return <Image style={[styles.imgStyle, imageStyle]} source={{ uri: source }} />;
  }

  state = {
    modalVisible: false,
    data: [],
    letters: this.getLetters([]),
    countriesFlat: this.convertCountriesToArray(),
    filteredCountry: this.convertCountriesToArray(),
    loading: false,
  };

  componentWillMount() {
    if (_.isArray(this.props.requiredCountries) && !_.isEmpty(this.props.requiredCountries)) {
      this.updateStateWithCountries(this.props.requiredCountries);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.requiredCountries &&
      this.props.requiredCountries &&
      nextProps.requiredCountries.length !== this.props.requiredCountries.length
    ) {
      this.updateStateWithCountries(nextProps.requiredCountries);
      if (this.props.searchable && this.searchBar) {
        this.searchBar.show();
      }
    }
  }

  onSelectCountry(country) {
    this.setState({
      modalVisible: false,
      filteredCountry: this.state.countriesFlat,
    });

    if (this.props.searchable && this.searchBar) {
      this.searchBar._clearInput();
    }

    this.props.onChange({
      country,
      ...countries[country.cca2],
      flag: undefined,
      name: this.getCountryName(countries[country.cca2]),
    });
  }

  getCountryName(country, optionalTranslation) {
    const translation = optionalTranslation || this.props.translation || 'eng';
    return country.name[translation] || country.name.common;
  }

  getHeightForLetters() {
    return getHeightPercent(100);
  }

  getLetters(data) {
    const letters = _(data).map((x, i) => ({
      key: this.getCountryName(countries[x])[0],
      index: i,
    }))
      .sortBy(x => x.key)
      .uniqBy(x => x.key)
      .value();
    return letters;
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset;
  }

  convertCountriesToArray() {
    const countriesFlat = [];
    _.mapKeys(countries, (value, key) => {
      const country = {};
      country.cca2 = key;
      country.name = this.getCountryName(value, this.props.transalation);
      country.name = _.lowerCase(country.name);
      // country.currency = value.currency;
      // country.callingCode = value.callingCode;
      countriesFlat.push(country);
    });
    return countriesFlat;
  }

  handleSearch = input => {
    // if (_.isEmpty(input)) return this.updateStateWithCountries(this.props.requiredCountries);

    const inputLow = _.lowerCase(input);
    let result = _.filter(this.state.countriesFlat, el => el.name.indexOf(inputLow) !== -1);
    console.log('result0>', result);
    this.setState({ filteredCountry: result });
    // this.updateCountriesOnSearch(result);

    // return result;
  };

  // letters = _.range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1).map(n =>
  //   String.fromCharCode(n).substr(0)
  // );

  // dimensions of country list and window
  itemHeight = 52;

  // getHeightPercent(7);
  listHeight = countries.length * this.itemHeight;

  openModal() {
    this.setState({ modalVisible: true });
  }

  openModal = this.openModal.bind(this);

  scrollTo(index) {
    this._flatList.scrollToIndex({
      index,
      viewPosition: 0,
    });
  }

  updateCountriesOnSearch = searchResults => {
    if (_.isEmpty(searchResults)) {
      return this.updateStateWithCountries();
    }
    let items = _.map(searchResults, 'cca2');
    items = _.compact(items);
    items = _.intersection(items, this.props.requiredCountries);
    if (items) {
      this.updateStateWithCountries(items);
    }
  };

  updateStateWithCountries(requiredCountries) {
    this.setState({ loading: true });
    if (_.isArray(requiredCountries) && !_.isEmpty(requiredCountries)) {
      let items = requiredCountries;
      if (items) {
        items = _.filter(requiredCountries, x => _.has(countries, x));
        items = _.sortBy(items, cca2 => {
          return _.get(countries[cca2], 'name.common');
        });
        this.setState({
          data: items,
          letters: this.getLetters(items),
          loading: false,
        });
      }
    } else {
      this.setState({
        data: [],
        letters: this.getLetters([]),
        loading: false,
      });
    }
  }

  renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onSelectCountry(country)}
        activeOpacity={0.95}>
        {this.renderCountryDetail(country)}
      </TouchableOpacity>
    );
  }

  renderCountryDetail(pcountry) {
    const country = countries[pcountry.cca2];
    return (
      <View style={styles.itemCountry}>
        {this.renderFlag(pcountry.cca2)}
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName}>{this.getCountryName(country)}</Text>
        </View>
      </View>
    );
  }

  renderEmojiFlag(cca2, emojiStyle) {
    let name = countries[cca2] ? countries[cca2].flag : '';
    return (
      <Text style={[styles.emojiFlag, emojiStyle]}>
        <Emoji name={name} />
      </Text>
    );
  }

  renderEmptySelector() {
    return (
      <View style={[styles.AUI_fullWidth, this.props.phoneSelector ? { borderBottomWidth: 0 } : {}]}>
        <Text style={[styles.AUI_emptyLabel]}>
          {this.props.phoneSelector ? 'Select country code...' : 'Select...'}
        </Text>
        <View style={styles.AUI_globe}>
          {this.props.pickerIcon}
        </View>
      </View>
    );
  }

  renderFlag(cca2, itemStyle, emojiStyle, imageStyle) {
    return (
      <View style={[styles.itemCountryFlag, itemStyle]}>
        {isEmojiable
          ? this.renderEmojiFlag(cca2, emojiStyle)
          : CountryPicker.renderImageFlag(cca2, imageStyle)}
      </View>
    );
  }

  renderLetters(letterObj) {
    return (
      <TouchableOpacity
        key={letterObj.key}
        onPress={() => this.scrollTo(letterObj.index)}
        activeOpacity={0.6}>
        <View style={styles.letter}>
          <Text style={styles.letterText}>{letterObj.key}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderPhoneSelector(cca2, optionalTransalation) {
    if (!cca2) {
      cca2 = 'ZA'; // this is added to render the component;
    }
    const countryCode = countries[cca2].callingCode;
    let source = countries[cca2] ? countries[cca2].flag : '';
    return (
      <View style={styles.AUI_phoneSelector}>
        <Image
          style={styles.AUI_countryFlagImage}
          source={{ uri: source }}
        />
        <Text style={[styles.AUI_phoneLabel]}>
          {`+ ${countryCode}`}
        </Text>
        <View style={[styles.AUI_globe, { borderRightWidth: 1, borderRightColor: '#B2B9BE' }]} />
      </View>
    );
  }

  renderSelector(cca2) {
    const countryCode = countries[cca2].callingCode;
    return (
      <View style={styles.AUI_fullWidth}>
        {isEmojiable
          ? this.renderEmojiFlag(cca2, styles.AUI_countryFlagImageiOS)
          : CountryPicker.renderImageFlag(cca2, styles.AUI_countryFlagImageAndroid)}
        {/* {this.renderEmojiFlag(cca2, styles.AUI_countryFlagImage)} */}
        <Text style={{
          fontSize: 16,
          color: '#8C9230',
          fontFamily: 'Helvetica',
          fontWeight: 'bold',
          paddingRight: 10,
          marginLeft: 5,
        }}>
          {`+ ${countryCode}`}
        </Text>      
      </View>
    );
  }

  render() {
    if (!this.props.cca2 && !this.state.modalVisible) {
      return (
        <TouchableOpacity onPress={() => this.setState({ modalVisible: true })} activeOpacity={0.7}>
          {this.renderEmptySelector()}
        </TouchableOpacity>
      );
    }
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
        >
          {this.props.children
            ? this.props.children
            : <View>
              {this.renderSelector(this.props.cca2)}
            </View>}
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}>
          {this.props.closeable && isEmojiable && (
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 30, justifyContent: 'flex-end', marginTop: 40 }}>
              <CloseButton onPress={() => this.setState({ modalVisible: false })} />
            </View>
          )}
          <View style={styles.modalContainer}>
            {this.props.searchable && (
              <View style={{ height: 40, alignItems:'center', justifyContent:"center", flexDirection: 'row', marginTop: 5, padding: 10, borderRadius: 20, backgroundColor: '#f2f2f2', }}>
                <SearchIcon color={'grey'} size={18} />
                <TextInput
                  placeholder={'Search'}
                  placeholderTextColor={'#A9A9A9'}
                  style={{ flex: 1, height:40, marginLeft: 15, fontSize: 14, color: 'black', }}
                  onChangeText={text => this.handleSearch(text)}
                  underlineColorAndroid="transparent"
                />
              </View>
            )}
            <FlatList
              ref={flatList => (this._flatList = flatList)}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps={'handled'}
              data={this.state.filteredCountry}
              renderItem={({ item }) => this.renderCountry(item)}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={(data, index) => ({
                length: this.itemHeight,
                offset: this.itemHeight * index,
                index,
              })}
            />
            {this.props.showLetters && (
              <View
                style={[
                  styles.letters,
                  {
                    height: this.getHeightForLetters(),
                    transform: [{ translateY: this.props.searchable ? 64 : 0 }, { scale: 0.9 }],
                  },
                ]}>
                <AlphabetPicker
                  alphabet={this.state.letters}
                  onTouchLetter={letterObj => this.scrollTo(letterObj.index)}
                />
              </View>
            )}
          </View>
        </Modal>
      </View>
    );
  }
}
