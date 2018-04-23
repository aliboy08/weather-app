import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

const WEATHER_IMAGES = {
	clear_night: require('../../assets/clear-night.png'),
	cloudy_night: require('../../assets/cloudy-night.png'),
	sunny: require('../../assets/sunny.png'),
	sun_partcloud: require('../../assets/sun-partcloud.png'),
	cloudy: require('../../assets/cloudy.png'),
	lightning_storm: require('../../assets/lightning-storm.png'),
	rain: require('../../assets/rain.png'),
	snow: require('../../assets/snow.png'),
	windy: require('../../assets/windy.png'),
};

export default class Weather extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			image_index: 0,
		}
	}

	getImage = () => {

		var icon = '';
		var weather = this.props.weather.toLowerCase();
		var time = parseInt(this.props.time);

		if (
			weather.indexOf('clear') != -1 ||
			weather.indexOf('sunny') != -1
		) {

			// Clear
			if (time >= 6 && time < 18) {
				// Day
				icon = WEATHER_IMAGES.sunny;
			} else {
				// Night
				icon = WEATHER_IMAGES.clear_night;
			}

		} else if (weather.indexOf('cloud') != -1) {

			// Cloudy
			if (time >= 6 && time < 18) {
				// Day
				icon = WEATHER_IMAGES.cloudy;

				// Partly cloudy
				if (weather.indexOf('part') != -1) {
					icon = WEAHTER_IMAGES.sun_partcloud
				}

			} else {
				// Night
				icon = WEATHER_IMAGES.cloudy_night;
			}

		}
		else if (weather.indexOf('wind') != -1) {

			// Windy
			icon = WEATHER_IMAGES.windy;

		} else if (weather.indexOf('rain') != -1) {

			// Rainy
			icon = WEATHER_IMAGES.rain;

		} else if (weather.indexOf('snow') != -1) {

			// Snow
			icon = WEATHER_IMAGES.snow;

		} else if (
			weather.indexOf('storm') != -1 ||
			weather.indexOf('lightning') != -1
		) {

			// Lightning / Storm
			icon = WEATHER_IMAGES.lightning_storm;

		} else {

			// Default
			if (time >= 6 && time < 18) {
				// Day
				icon = WEATHER_IMAGES.sunny;
			} else {
				// Night
				icon = WEATHER_IMAGES.clear_night;
			}

		}

		return icon;
	}

	render() {
		var weather_image = this.getImage();
		return (
			<View>

				<View style={{ alignItems: 'center' }}>
					<Text style={{ color: '#fff', fontSize: 21 }}>
						{this.props.weather}
					</Text>
				</View>

				<View style={{
					marginBottom: -20,
					marginTop: -20,
				}}>
					<Image
						style={{
							width: 180,
							height: 160,
							resizeMode: 'contain',
							//backgroundColor: '#222',
						}}
						source={weather_image}
					/>
				</View>
			</View>
		)
	}
}
