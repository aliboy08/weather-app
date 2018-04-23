import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default class TemperatureSelect extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			unit: 'c',
			activeC: 1,
			activeF: 0,
		}
	}

	changeUnit(unit) {
		var tempState = {}
		if (unit === 'c') {
			tempState.activeC = 1;
			tempState.activeF = 0;
		} else {
			tempState.activeC = 0;
			tempState.activeF = 1;
		}
		this.setState(tempState);
		this.props.setTempUnit(unit);
	}

	render() {
		return (
			<View style={{ flexDirection: 'row' }}>

				<TouchableOpacity
					style={{
						paddingLeft: 3,
						paddingRight: 3,
						paddingBottom: 2,
						marginRight: 20,
						borderBottomWidth: this.state.activeC,
						borderColor: '#fff',
						position: 'relative',
					}}
					onPress={() => this.changeUnit('c')}
				>
					<View style={{
						width: 2, height: 2,
						backgroundColor: '#fff',
						position: 'absolute',
						top: 4, left: 0,
						borderRadius: 2,
					}} />
					<Text style={{ color: '#fff', fontSize: 16 }}>C</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						paddingLeft: 3,
						paddingRight: 3,
						paddingBottom: 2,
						borderBottomWidth: this.state.activeF,
						borderColor: '#fff',
						position: 'relative',
					}}
					onPress={() => this.changeUnit('f')}
				>
					<View style={{
						width: 2, height: 2,
						backgroundColor: '#fff',
						position: 'absolute',
						top: 4, left: 0,
						borderRadius: 2,
					}} />
					<Text style={{ color: '#fff', fontSize: 16 }}>F</Text>
				</TouchableOpacity>

			</View>
		)
	}
}
