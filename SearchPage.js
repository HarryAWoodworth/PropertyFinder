'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';

// Creates a query string based on the parameters in data, then transforms data
// into name=value pairs seperated by ampersands, then finally calls Nestoria API
// to return the property listings.
function urlForQueryAndPage(key, value, pageNumber) {
  const data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber,
  };
  data[key] = value;

  const querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'https://api.nestoria.co.uk/api?' + querystring;
}

type Props = {};
export default class SearchPage extends Component<Props> {
  static navigationOptions = {
    title: 'Property Finder',
  };

  // This constructor gives the SeachPage component a state
  // variable holding a searchString variable default set to 'london'
  constructor(props) {
	  super(props);
	  this.state = {
	    searchString: 'london',
	    isLoading: false,
	    message: '',
	  };
	}

	// This method handles a change in seachString and sets the state to the new text
	// as well as logs the event happening and the old/new text strings.
	// This method is called using the onChange property in the TextInput
	// An underscore at the start of a method indicated private
	_onSearchTextChanged = (event) => {
	  // console.log('_onSearchTextChanged');
	  this.setState({ searchString: event.nativeEvent.text });
	  // console.log('Current: '+this.state.searchString+', Next: '+event.nativeEvent.text);
	};

	// Signal to the state that the component is loading
	// Executes the query using a Fetch API promise chain
	_executeQuery = (query) => {
	  
	  console.log(query);
	  this.setState({ isLoading: true });

	 fetch(query)
	  .then(response => response.json())
	  .then(json => this._handleResponse(json.response))
	  .catch(error =>
	     this.setState({
	      isLoading: false,
	      message: 'Something bad happened ' + error
	   }));

	};

	// Create and execute the query based on the searchString from the state
	_onSearchPressed = () => {
	  const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
	  this._executeQuery(query);
	};

	// This clears isLoading and logs the number of properties found if the query was successful.
	_handleResponse = (response) => {
	  this.setState({ isLoading: false , message: '' });
	  if (response.application_response_code.substr(0, 1) === '1') {
	    // console.log('Properties found: ' + response.listings.length);
	    this.props.navigation.navigate('Results', {listings: response.listings});
	  } else {
	    this.setState({ message: 'Location not recognized; please try again.'});
	  }
	};


  render() {

  	// Logs that the SearchPage was rendered
  	// console.log('SearchPage.render');
  	
  	// Every time the page renders, if the page is loading show a spinner
  	const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;

  	// Return the HTML stuff to be rendered 
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name or postcode.
        </Text>
        <View style={styles.flowRight}>
				  <TextInput
				    underlineColorAndroid={'transparent'}
				    style={styles.searchInput}
				    value={this.state.searchString}
				    onChange={this._onSearchTextChanged}
				    placeholder='Search via name or postcode'
				  />
				  <Button
				    onPress={this._onSearchPressed}
				    color='#48BBEC'
				    title='Go'
				  />
				</View>
				<Image source={require('./Resources/house.png')} style={styles.image}/>
				{spinner}
				<Text style={styles.description}>{this.state.message}</Text>
     </View>
    );

  }

}

const styles = StyleSheet.create({

  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },

  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },

  flowRight: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'stretch',
  },

	searchInput: {
	  height: 36,
	  padding: 4,
	  marginRight: 5,
	  flexGrow: 1,
	  fontSize: 18,
	  borderWidth: 1,
	  borderColor: '#48BBEC',
	  borderRadius: 8,
	  color: '#48BBEC',
	},

	image: {
  	width: 217,
  	height: 138,
	},

});

