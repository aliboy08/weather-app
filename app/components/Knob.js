import React, { Component } from "react";
import { PanResponder, StyleSheet, View, Text, Image } from "react-native";

const CONTAINER_SIZE = 280;
const CONTAINER_RADIUS = CONTAINER_SIZE / 2;

const KNOB_CENTER_X = CONTAINER_SIZE / 2; // 100
const KNOB_CENTER_Y = CONTAINER_SIZE / 2; // 100
const KNOB_RADIUS = CONTAINER_SIZE / 2;

//const INDICATOR_RADIUS = 14;
const INDICATOR_RADIUS = 21;
const INDICATOR_DIAMETER = INDICATOR_RADIUS * 2;

const TIME_STEP = 3;

const ENABLE_DEBUG = false;

const QUADRANTS = [
	{
		// Initial
		name: 0,
		x: CONTAINER_RADIUS,
		y: 0
	},
	{
		name: 1,
		x: CONTAINER_RADIUS * 2,
		y: CONTAINER_RADIUS
	},
	{
		name: 2,
		x: CONTAINER_RADIUS,
		y: CONTAINER_RADIUS * 2
	},
	{
		name: 3,
		x: 0,
		y: CONTAINER_RADIUS
	},
	{
		name: 4,
		x: CONTAINER_RADIUS,
		y: 0
	}
];

export default class Knob extends Component {
	constructor(props) {
		super(props);

		this.circleStyles = {
			defaultColor: "#fff",
			activeColor: "#222",
			defaultOpacity: 1,
			activeOpacity: 0.8
		};

		var centerX = CONTAINER_SIZE / 2 - INDICATOR_RADIUS;
		var rightX = CONTAINER_SIZE - INDICATOR_RADIUS;
		var leftX = -INDICATOR_RADIUS;

		var topY = -INDICATOR_RADIUS;
		var bottomY = CONTAINER_SIZE - INDICATOR_RADIUS;
		var centerY = CONTAINER_SIZE / 2 - INDICATOR_RADIUS;

		var _circlePosX,
			_circlePosY,
			_dragDirectionY,
			indicatorX,
			indicatorY,
			rads,
			x,
			y,
			quadrant,
			width,
			temp,
			tempState,
			time,
			prefix;

		var quadrant = this.getQuadrantByTime(this.props.time);

		this.state = {
			circleColor: this.circleStyles.defaultColor,
			circleOpacity: this.circleStyles.defaultOpacity,
			circlePosX: quadrant.circlePosX,
			circlePosY: quadrant.circlePosY,
			circlePrevPosX: quadrant.circlePrevPosX,
			circlePrevPosY: quadrant.circlePrevPosY,
			completeRotation: quadrant.completeRotation,
			// circlePosX: centerX,
			// circlePosY: topY,
			// circlePrevPosX: centerX,
			// circlePrevPosY: topY,
			// completeRotation: 0,
			dragDirectionY: 1, // clockwise
			selectedQuadrant: 0, // 12 o'clock
			completeRotation: 0
		};

		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
			onPanResponderGrant: (evt, gestureState) => {
				this.setState({
					//circleColor: this.circleStyles.activeColor
					circleOpacity: this.circleStyles.activeOpacity
				});
			},
			onPanResponderMove: (evt, gestureState) => {
				// current circle coordinates
				_circlePosX =
					this.state.circlePrevPosX + gestureState.dx + INDICATOR_RADIUS;
				_circlePosY =
					this.state.circlePrevPosY + gestureState.dy + INDICATOR_RADIUS;

				//console.log(gestureState);

				// Limit the indicator to the circle path
				rads = Math.atan2(
					_circlePosY - KNOB_CENTER_Y,
					_circlePosX - KNOB_CENTER_X
				);
				indicatorX = KNOB_RADIUS * Math.cos(rads) + centerX;
				indicatorY = KNOB_RADIUS * Math.sin(rads) + centerY;

				//console.log('X = '+ indicatorX + ' Y = ' + indicatorY);

				_dragDirectionY = gestureState.vy > 0 ? 1 : 0;

				this.setState({
					circlePosX: indicatorX,
					circlePosY: indicatorY,
					dragDirectionY: _dragDirectionY
				});
			},
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				tempState = {
					circleColor: this.circleStyles.defaultColor,
					circleOpacity: this.circleStyles.defaultOpacity,
					circlePrevPosX: this.state.circlePosX,
					circlePrevPosY: this.state.circlePosY
				};

				if (gestureState.dx != 0 && gestureState.dy != 0) {
					// Have movement
					_circlePosX =
						this.state.circlePrevPosX +
						gestureState.dx +
						INDICATOR_RADIUS;
					_circlePosY =
						this.state.circlePrevPosY +
						gestureState.dy +
						INDICATOR_RADIUS;

					//quadrant = this.getQuadrant(_circlePosX, _circlePosY);
					quadrant = this.getClosestQuadrant(_circlePosX, _circlePosY);
					x = quadrant.x - INDICATOR_RADIUS;
					y = quadrant.y - INDICATOR_RADIUS;
					tempState.selectedQuadrant = quadrant.name;

					// snap to every quarter, interval 3 hrs
					time = quadrant.name * TIME_STEP;

					if (this.state.completeRotation > 0) {
						// 2nd rotation, + 12hrs
						time = time + 12;
					}

					// Complete Rotation
					if (quadrant.name == 4) {
						// 1st Rotation = add 12hrs, 2nd rotation reset to 0
						tempState.completeRotation =
							this.state.completeRotation > 0 ? 0 : 1;
					}

					//console.log('Quadrant ' + quadrant.name + ' x = '+ x + ' y = '+ y + ' TIME = '+ time + ' completeRotation = '+ this.state.completeRotation);

					tempState.circlePosX = x;
					tempState.circlePosY = y;
					tempState.circlePrevPosX = x;
					tempState.circlePrevPosY = y;
					this.handleSelect(time); // Execute on select
				}

				this.setState(tempState);
			},
			onPanResponderTerminate: (evt, gestureState) => {
				//console.log('onPanResponderTerminate');
			},
			onShouldBlockNativeResponder: (evt, gestureState) => {
				return true;
			}
		});
	} // constructor

	getQuadrant(x, y) {
		//console.log('Drop X = '+ x + ' Y = '+ y);

		if (x > CONTAINER_RADIUS && y < CONTAINER_RADIUS) {
			// Quadrant 1 | x = 2, y = 1
			// on counter counter-clockwise, snap to first/last quadrant = Q4
			_dragDirectionY = this.state.dragDirectionY == 1 ? 0 : -1;
			quadrant = 1 + _dragDirectionY;
		} else if (x > CONTAINER_RADIUS && y > CONTAINER_RADIUS) {
			// Quadrant 2 | x = 1, y = 2
			_dragDirectionY = this.state.dragDirectionY == 1 ? 0 : -1;
			quadrant = 2 + _dragDirectionY;
		} else if (x < CONTAINER_RADIUS && y > CONTAINER_RADIUS) {
			// Quadrant 3 | x = 0, y = 1
			_dragDirectionY = this.state.dragDirectionY == 0 ? 0 : 1;
			quadrant = 3 - _dragDirectionY;
		} else if (x < CONTAINER_RADIUS && y < CONTAINER_RADIUS) {
			// Quadrant 4 | x = 1, y = 0
			_dragDirectionY = this.state.dragDirectionY == 0 ? 0 : 1;
			quadrant = 4 - _dragDirectionY;
		}

		return QUADRANTS[quadrant];
	}

	getClosestQuadrant(x, y) {
		//console.log('getClosestQuadrant x = '+ x + ' y = '+ y);

		if (x < CONTAINER_RADIUS && y < CONTAINER_RADIUS) {
			// Quadrant 4 | x = 1, y = 0
			_dragDirectionY = this.state.dragDirectionY == 0 ? 0 : 1;
			quadrant = 4 - _dragDirectionY;
			return QUADRANTS[quadrant];
		}

		temp = {
			quadrant: 0,
			distance: 999999
		};

		QUADRANTS.forEach((item, index) => {
			//if( index == 0 ) return; // skip quadrant 0
			x = parseInt(x);
			y = parseInt(y);
			var item_x = parseInt(item.x);
			var item_y = parseInt(item.y);

			// find closest point
			// (x1 - x2)squared + (y1 - y2)squared
			var diff = Math.pow(item_x - x, 2) + Math.pow(item_y - y, 2);

			if (diff < temp.distance) {
				temp = {
					quadrant: index,
					distance: diff
				};
			}
		});

		return QUADRANTS[temp.quadrant];
	}

	handleSelect(val) {
		this.props.onSelect(val);
	}

	setKnobPos(time) {
		time = parseInt(time);
		quadrant = QUADRANTS[(time / 3) % 4];
		x = quadrant.x - INDICATOR_RADIUS;
		y = quadrant.y - INDICATOR_RADIUS;
		tempState = {
			circlePosX: x,
			circlePosY: y,
			circlePrevPosX: x,
			circlePrevPosY: y
		};
		tempState.completeRotation = time > 12 ? 1 : 0;
		this.setState(tempState);
	}

	getQuadrantByTime(time) {
		time = parseInt(time);
		quadrant = QUADRANTS[(time / 3) % 4];
		x = quadrant.x - INDICATOR_RADIUS;
		y = quadrant.y - INDICATOR_RADIUS;
		return {
			circlePosX: x,
			circlePosY: y,
			circlePrevPosX: x,
			circlePrevPosY: y,
			completeRotation: time > 12 ? 1 : 0
		};
	}

	render() {
		return (
			<View style={styles.pathContainer}>
				<View style={styles.pathInnerContainer}>
					<Image
						style={styles.circlePathImage}
						source={require("../../assets/Oval-fade.png")}
					/>

					<Image
						{...this._panResponder.panHandlers}
						style={[
							{
								left: this.state.circlePosX,
								top: this.state.circlePosY,
								opacity: this.state.circleOpacity
							},
							styles.knobImage
						]}
						source={require("../../assets/knob.png")}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	pathContainer: {
		//backgroundColor: '#888',
		paddingTop: 20,
		paddingBottom: 20,
		position: "relative",
		alignItems: "center"
	},
	pathInnerContainer: {
		//backgroundColor: '#999',
		position: "relative",
		width: CONTAINER_SIZE,
		height: CONTAINER_SIZE
	},
	circlePathImage: {
		overflow: "visible",
		position: "absolute",
		top: 0,
		left: 0,
		width: 280,
		height: 280,
		resizeMode: "contain"
	},
	circlePath: {
		overflow: "visible",
		position: "absolute",
		top: 0,
		left: 0
	},
	knob: {
		width: INDICATOR_DIAMETER,
		height: INDICATOR_DIAMETER,
		borderRadius: INDICATOR_RADIUS,
		position: "relative",
		zIndex: 30,
		elevation: 5
	},
	knobImage: {
		position: "relative",
		width: INDICATOR_DIAMETER,
		height: INDICATOR_DIAMETER,
		resizeMode: "contain"
	}
});
