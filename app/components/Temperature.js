import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Temperature extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			temperature: null,
			temperatureUnit: 'c',
		}
	}

	componentDidMount() {
		this.setState({
			temperature: this.convertTemp(this.props.temperature)
		})
	}

	updateTemperature(temperature) {
		this.setState({
			temperature: parseInt(temperature),
		})
	}

	convertTemp(temp) {
		// Fahrenheit
		if (this.state.temperatureUnit == 'f') {
			temp = temp * 9 / 5 + 32
		}
		return parseInt(temp);
	}

	componentDidUpdate() {
		if (this.state.temperatureUnit !== this.props.temperatureUnit) {
			this.setState({
				temperatureUnit: this.props.temperatureUnit
			})
		}
	}

	render() {
		var temp = this.convertTemp(this.props.temperature);
		return (
			<View style={{
				alignItems: 'center'
			}}>
				<Text style={{ color: '#fff', opacity: .6 }}>temp</Text>
				<View style={{ position: 'relative' }}>
					<Text style={{ color: '#fff', fontSize: 30 }}>
						{temp}
					</Text>
					<View style={{
						width: 5, height: 5,
						backgroundColor: '#fff',
						position: 'absolute',
						top: 4, right: -7,
						borderRadius: 10,
					}} />
				</View>
			</View>
		)
	}
}
