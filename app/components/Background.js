import React, { Component } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import Chroma from 'chroma-js'

const TOP_COLORS = [
	'#4d5196', // 6PM - 3AM
	'#37185a', // 3AM - 6AM
	'#e07ec5', // 6AM - 9AM
	'#ffd07a', // 9AM - 3PM
	'#ffa947', // 3PM - 6PM
	'#4d5196', // 6PM - 3AM
]

const BOTTOM_COLORS = [
	'#0a1b4d', // 6PM - 3AM
	'#a15797', // 3AM - 6AM
	'#f6a750', // 6AM - 9AM
	'#ffaf33', // 9AM - 3PM
	'#ff76b5', // 3PM - 6PM
	'#0a1b4d', // 6PM - 3AM
]

//const GRADIENT_COLOR_LENGTH = 700
const GRADIENT_COLOR_LENGTH = 301
const TOP_COLORS_SPECTRUM = Chroma.scale(TOP_COLORS).colors(GRADIENT_COLOR_LENGTH)
const BOTTOM_COLORS_SPECTRUM = Chroma.scale(BOTTOM_COLORS).colors(GRADIENT_COLOR_LENGTH)

export default class Background extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			previoustime: 0,
			colorTop: TOP_COLORS_SPECTRUM[0],
			colorBottom: BOTTOM_COLORS_SPECTRUM[0]
		}
	}

	componentDidMount() {
		//console.log('background componentDidMount');
		this.props.onRef(this);
		this.animateBackground();
	}
	componentWillUnmount() {
		this.props.onRef(undefined)
	}

	animateBackground() {
		//console.log('Background animateBackground', this.props.time);

		var timeColor = this.getGradientSpectrum(this.props.time);
		var colorIndex;

		//console.log('timeColor', timeColor);

		var i = 0;
		let animationInterval = setInterval(() => {

			colorIndex = i + timeColor.start;

			this.setState({
				colorTop: TOP_COLORS_SPECTRUM[colorIndex],
				colorBottom: BOTTOM_COLORS_SPECTRUM[colorIndex]
			})
			//console.log('i = ' + i + ' colorIndex = '+ colorIndex);
			if (i >= timeColor.interval) {
				//console.log('STOP ANIMATION', colorIndex);
				clearInterval(animationInterval);
			}
			i++;
		}, 1);
	}

	getGradientSpectrum(time) {
		this.setState({ previoustime: time });
		time = parseInt(time);
		//console.log('Background Js getBgColor', time);
		switch (time) {
			case 0:
				return { start: 250, end: 300, interval: 50 }
			case 3:
				return { start: 0, end: 50, interval: 50 }
			case 6:
				return { start: 50, end: 100, interval: 50 }
			case 9:
				return { start: 100, end: 117, interval: 17 }
			case 12:
				return { start: 117, end: 134, interval: 17 }
			case 15:
				return { start: 134, end: 150, interval: 16 }
			case 18:
				return { start: 250, end: 300, interval: 50 }
			case 21:
				return { start: 300, end: 300, interval: 0 }
			case 24:
				return { start: 0, end: 20, interval: 20 }
		}
		// if( time >= 18 || time < 3 ) {
		//    // 6PM - 3AM
		//    console.log('6PM - 3AM');
		//    return {
		//       start: 5 * spectrumLength,
		//       end: 6 * spectrumLength,
		//    };
		//
		// } else if ( time >= 3 && time < 6 ) {
		//    // 3AM - 6AM
		//    console.log('3AM - 6AM');
		//    return {
		//       start: 0 * spectrumLength,
		//       end: 1 * spectrumLength,
		//    };
		//
		// } else if ( time >= 6 && time < 9 ) {
		//    // 6AM - 9AM
		//    console.log('6AM - 9AM');
		//    return {
		//       start: 1 * spectrumLength,
		//       end: 2 * spectrumLength,
		//    };
		//
		// } else if ( time >= 9 && time < 15 ) {
		//    // 9AM - 3PM
		//    console.log('9AM - 3PM');
		//    return {
		//       start: 2 * spectrumLength,
		//       end: 3 * spectrumLength,
		//    };
		//
		// } else if ( time >= 15 && time < 18 ) {
		//    // 3PM - 6PM
		//    console.log('3PM - 6PM');
		//    return {
		//       start: 4 * spectrumLength,
		//       end: 5 * spectrumLength,
		//    };
		// }
	}

	getBgColor(time) {
		time = parseInt(time);

		if (time >= 18 || time < 3) {
			// 6PM - 3AM
			return ['#4d5196', '#0a1b4d'];

		} else if (time >= 3 && time < 6) {
			// 3AM - 6AM
			return ['#37185a', '#a15797'];

		} else if (time >= 6 && time < 9) {
			// 6AM - 9AM
			return ['#e07ec5', '#f6a750'];

		} else if (time >= 9 && time < 15) {
			// 9AM - 3PM
			return ['#ffd07a', '#ffaf33'];

		} else if (time >= 15 && time < 18) {
			// 3PM - 6PM
			return ['#ffa947', '#ff76b5'];
		}
	}

	render() {
		return (
			<LinearGradient
				colors={[this.state.colorTop, this.state.colorBottom]}
				//colors={this.getBgColor(this.props.time)}
				style={{
					flex: 1,
					position: 'absolute',
					top: 0,
					left: 0,
					height: '100%',
					width: '100%',
				}}
			/>
		)
	}
}
