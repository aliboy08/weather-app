import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import moment from 'moment';

export default class Days extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			days: [],
			selectedItem: 0,
			temperatureUnit: 'c',
		}
	}

	componentDidMount() {
		this.getDays();
	}

	componentDidUpdate() {
		if (this.state.temperatureUnit !== this.props.temperatureUnit) {
			this.setState({
				temperatureUnit: this.props.temperatureUnit
			})
		}
	}

	getDays() {
		var date, dates = [],
			dayName, data = [];

		// Get unique dates
		this.props.weatherData.list.forEach((item, index) => {
			date = item.dt_txt.split(' ')[0];
			if (dates.indexOf(date) === -1) dates.push(date);
		})

		// Get week day name for dates
		dates.forEach((item, index) => {
			dayName = moment(item, 'YYYY-MM-DD').format('ddd');
			data.push({
				name: dayName.toUpperCase(),
				date: item,
				temp: this.getDateInfo(item, 'temperature'),
				index: this.getDateInfo(item, 'index'),
			});
		})

		this.setState({ days: data });
	}

	getDateInfo(date, info) {
		dateTime = date + ' ' + this.props.currentTime;
		var data = this.props.weatherData.list.slice();
		var index = data.findIndex(row => row.dt_txt === dateTime);

		if (index !== -1) {
			if (info == 'index') {
				return index;
			} else if (info == 'temperature') {
				return parseInt(data[index].main.temp);
			}
		} else {
			// Data not found
			return null;
		}
	}

	selectDay(index) {
		this.props.onSelectDay(this.state.days[index]);
		this.setState({ selectedItem: index });
	}

	convertTemp(temp) {
		// Fahrenheit
		if (this.state.temperatureUnit == 'f') {
			temp = temp * 9 / 5 + 32
		}
		return parseInt(temp);
	}

	render() {
		return (
			<View style={{
				flexDirection: 'row',
				marginTop: 20,
				borderTopWidth: 1,
				borderColor: '#fff',
				paddingTop: 20,
			}}>
				{
					this.state.days.map((item, index) => {
						if (item.temp != null) {
							var activeBorder = (index == this.state.selectedItem) ? 1 : 0;
							return (
								<TouchableOpacity
									key={index} onPress={() => this.selectDay(index)}
								>
									<View style={{
										alignItems: 'center',
										justifyContent: 'center',
										borderBottomWidth: activeBorder,
										borderColor: '#fff',
										paddingBottom: 5,
										marginLeft: 15,
										marginRight: 15,
										//backgroundColor: '#eee',
									}}>
										<Text style={{
											color: '#fff',
											fontSize: 12
										}}>
											{item.name}
										</Text>
										<View style={{
											position: 'relative',
											paddingLeft: 3,
											paddingRight: 3,
										}}>
											<Text style={{ color: '#fff' }}>
												{this.convertTemp(item.temp)}
											</Text>
											<View style={{
												width: 2, height: 2,
												backgroundColor: '#fff',
												position: 'absolute',
												top: 4, right: 0,
												borderRadius: 2,
											}} />
										</View>
									</View>
								</TouchableOpacity>
							)
						}
					})
				}
			</View>
		)
	}
}
