import React, { Component } from 'react';
import { View, Text } from 'react-native';

import moment from 'moment';

export default class CurrentTime extends React.Component {
	constructor(props) {
		super(props);
	}

	formatTime(time) {
		time = parseInt(time) + ':00';
		return time;
	}

	render() {
		return (
			<View style={{ alignItems: 'center', marginBottom: 10 }}>
				<Text style={{ color: '#fff', opacity: .6 }}>time</Text>
				<Text style={{ color: '#fff', fontSize: 23, fontWeight: '300' }}>{this.formatTime(this.props.time)}</Text>
			</View>
		)
	}
}
