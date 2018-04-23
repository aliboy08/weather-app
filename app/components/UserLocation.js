import React, { Component } from "react";
import {
	View,
	Text,
	Image,
	PermissionsAndroid,
	//BackHandler
} from "react-native";
// import { View, Text, Image, BackHandler } from "react-native";

import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

//import Permissions from "react-native-permissions";

//import Geocoder from "react-native-geocoding";

export default class UserLocation extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			latitude: null,
			longitude: null,
			locationName: null
		};

		//this.requestLocationPermission().catch(error => error);
	}

	// async requestLocationPermission() {
	// 	try {
	// 		const fineLocationPermission = await PermissionsAndroid.request(
	// 			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	// 			{
	// 				title: "Weather App Location Permission",
	// 				message: "Weather App needs access to location "
	// 			}
	// 		);
	// 		if (fineLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
	// 			console.log("You can use location");
	// 			//this.geolocationGetCurrentPosition();

	// 		} else {
	// 			console.log("Location permission denied");
	// 		}
			
	// 	} catch (err) {
	// 		console.warn(err);
	// 	}
	// }

	// locationPermissionCheck(){
	// 	PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
	// 	.then((enabled)=>{
	// 		if( !enabled ) {
	// 			console.log('ACCESS_FINE_LOCATION NOT ENABLED, ATTEMPT TO ENABLE');
	// 		} else {
	// 			console.log('ACCESS_FINE_LOCATION ENABLED');
	// 		}
	// 	});
	// }

	componentDidMount() {
		// Check Location Permission Status
		// Permissions.check("location").then(response => {
		// 	// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
		// 	console.log("Location permission check", response);
		// 	if (response !== "authorized") {
		// 		console.log('Not authorized, attempt to enable');
		// 		this.enableLocationService();
		// 	}
		// });

		//console.log('UserLocation componentDidMount');
		
		this.enableLocationService();

		//this.geolocationGetCurrentPosition();
	}

	geolocationGetCurrentPosition() {
		//console.log('geolocationGetCurrentPosition');
		navigator.geolocation.getCurrentPosition(
			(position) => {
				//this.getLocationName
				//console.log('Geolocation success!', position);
				this.setState(
					{
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					},
					() => {
						//console.log('geolocationGetCurrentPosition state', this.state);
						this.props.onLoad(this.state); // pass state to main.js
						//this.getLocationName(); // Not used anymore, Weather API is getting the location name
					}
				);
			},
			(error) => {
				alert(error.message);
			},
			{
				enableHighAccuracy: false,
				timeout: 20000,
				maximumAge: 1000
			}
		);
	}

	enableLocationService() {
		LocationServicesDialogBox.checkLocationServicesIsEnabled({
			message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/>",
			ok: "YES",
			cancel: "NO",
		}).then(function (success) {
			//console.log('Location Service Enabled', success);
			// success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
			this.geolocationGetCurrentPosition();
		}.bind(this)
		).catch((error) => {
			alert(error.message);
		});
	}

	getLocationName() {
		//console.log('getLocationName lat = '+ this.state.latitude + ' lng = '+ this.state.longitude);
		// Geocoder.setApiKey("AIzaSyDS6Od7olxjnk8dZQKVGMHwdAq-h9vlbfg");
		// Geocoder.getFromLatLng(this.state.latitude, this.state.longitude).then(
		// 	json => {
		// 		var address_component = json.results[0].address_components[0];
		// 		//console.log('address_component', address_component);
		// 		this.setState(
		// 			{
		// 				locationName: address_component.long_name
		// 			},
		// 			() => {
		// 				this.props.onLoad(this.state); // pass state to main.js
		// 			}
		// 		);
		// 	},
		// 	error => {
		// 		alert(error);
		// 	}
		// );
	}

	render() {
		return (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<Image
					style={{
						width: 15,
						height: 15,
						resizeMode: "contain",
						marginRight: 7
					}}
					source={require("../../assets/marker.png")}
				/>
				<Text style={this.props.style}>
					{
						//this.state.locationName
						this.props.locationName
					}
				</Text>
			</View>
		);
	}
}
