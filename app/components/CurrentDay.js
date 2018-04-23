import React, { Component } from "react";
import { View, Text } from "react-native";

import moment from "moment";

export default class CurrentDay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			weekD: null,
			monthD: null,
			monthDPrefix: null
		};
	}

	componentDidMount() {
		this.props.onRef(this);
		this.updateDay();
	}

	updateDay() {
		var selectedDate = moment(this.props.selectedDate, "YYYY-MM-DD");
		var monthD = selectedDate.format("D");
		var monthDPrefix;

		monthD = monthD.toString();
		var lastDigit = parseInt(monthD[monthD.length - 1]);

		switch (lastDigit) {
			case 1:
				monthDPrefix = "st";
				break;
			case 2:
				monthDPrefix = "nd";
				break;
			case 3:
				monthDPrefix = "rd";
				break;
			default:
				monthDPrefix = "th";
		}

		this.setState({
			weekD: selectedDate.format("ddd"),
			monthD: monthD,
			monthDPrefix: monthDPrefix
		});
	}

	render() {
		return (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<Text
					style={{
						color: "#fff",
						fontSize: 27,
						opacity: 0.6,
						marginRight: 10
					}}
				>
					{this.state.weekD}
				</Text>

				<Text
					style={{
						color: "#fff",
						fontSize: 27,
						marginRight: 3
					}}
				>
					{this.state.monthD}
				</Text>

				<Text
					style={{
						color: "#fff",
						fontSize: 14
					}}
				>
					{this.state.monthDPrefix}
				</Text>
			</View>
		);
	}
}
