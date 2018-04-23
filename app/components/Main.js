import React, { Component } from "react";
import {
	View,
	Text,
	AsyncStorage,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	ScrollView,
} from "react-native";

import Background from "./Background";
import Knob from "./Knob";
import CurrentDay from "./CurrentDay";
import CurrentTime from "./CurrentTime";
import UserLocation from "./UserLocation";
import Weather from "./Weather";
import Temperature from "./Temperature";
import TemperatureSelect from "./TemperatureSelect";
import Days from "./Days";

import moment from "moment";

const DATA_EXPIRY_TIME = 3; //hrs

const WINDOW_WIDTH = Dimensions.get("window").width; //full width
const WINDOW_HEIGHT = Dimensions.get("window").height; //full height

export default class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedTime: this.formatTime(moment().hour()),
			currentTime: this.formatTime(moment().hour()),
			currentTemperature: null,
			currentWeather: null,
			temperatureUnit: "c",
			selectedDate: moment().format("YYYY-MM-DD"),
			selectedDataIndex: false,
			weatherData: [],
			saveTime: null,
			locationDataLoaded: false,
			weatherDataLoaded: false,
			locationName: ""
		};
	}

	handleKnobChange(time) {
		time = this.formatTime(time);
		this.setState(
			{
				selectedTime: time
			},
			() => {
				this.setWeatherDataRow();
				this.initiateBackgroundChange();
			}
		);
	}

	initiateBackgroundChange = () => {
		this.backgroundComponent.animateBackground();
	};

	formatTime(val) {
		var time = parseInt(val);
		// Round off time to divisible by 3
		if (time % 3 != 0) {
			time = parseInt(time / 3) * 3 + 3;
		}

		if (time == 24) {
			time = 0;
		}

		// prepend 0 to single digits, for HH:mm:ss format
		prefix = time < 10 ? "0" : "";
		time = prefix + time + ":00:00";
		return time;
	}

	setTime(val, callback) {
		var time = this.formatTime(val);
		this.setState(
			{
				selectedTime: time
			},
			() => {
				if (typeof callback == "function") callback();
			}
		);
	}

	setWeatherDataRow = () => {
		var date = this.state.selectedDate + " " + this.state.selectedTime;

		var list = this.state.weatherData.list.slice();
		var index = list.findIndex(row => row.dt_txt === date);

		//console.log('data found!= ', this.state.weatherData.list[index]);
		if (index > 0) {
			//console.log('index found = '+ index);

			this.setState({
				selectedDataIndex: index,
				currentTemperature: this.state.weatherData.list[index].main.temp,
				currentWeather: this.state.weatherData.list[index].weather[0]
					.description
			});
		} else {
			this.setState({
				selectedDataIndex: null,
				currentTemperature: null,
				currentWeather: null
			});
		}
	};

	onLocationLoad = location => {
		//console.log("Location loaded, set state", location);
		// User Location Loaded
		this.setState(
			{
				location: {
					latitude: location.latitude,
					longitude: location.longitude,
					name: location.locationName // google geolocation not used
				},
				locationDataLoaded: true
			},
			() => {
				//console.log('Location state loaded', this.state.location);
				// Check if save time exprired
				this.loadStorageData("saveTime", this.downloadWeatherData, () => {
					// Checking...
					//console.log('CHECK SAVE TIME', this.state.saveTime);

					var today = new Date();
					var saveTime = new Date(this.state.saveTime);
					var hourDifference = Math.abs(today - saveTime) / 36e5;

					if (hourDifference > DATA_EXPIRY_TIME) {
						// Data Expired, execute OK callback
						//console.log('DATA EXPIRED, RUN EXPIRE CALLBACK');
						this.downloadWeatherData();
					} else {
						// Date OK, execute EXPIRED callback
						//console.log('DATA OK, RUN OK CALLBACK');
						this.loadStorageData(
							"weatherData",
							this.downloadWeatherData,
							() => {
								this.setState({
									weatherDataLoaded: true,
									locationName: this.state.weatherData.city.name
								});
								this.setWeatherDataRow();
							}
							//this.setWeatherDataRow
						);
					}
				});
			}
		);
	};

	loadStorageData(key, noDataCallback, onLoadCompleteCallback) {
		//console.log('loadStorageData', key);
		AsyncStorage.getItem(key, (err, result) => {
			if (!err) {
				if (result !== null) {
					//console.log('HAVE '+ key +' DATA IN STORAGE');
					result = JSON.parse(result);
					this.setState({ [key]: result }, () => {
						if (typeof onLoadCompleteCallback == "function")
							onLoadCompleteCallback();
					});
				} else {
					//console.log('NO '+ key +' DATA IN STORAGE', noDataCallback);
					if (typeof noDataCallback == "function") noDataCallback();
				}
			} else {
				alert(err.message);
			}
		});
	}

	downloadWeatherData = () => {
		if (this.state.weatherDataLoaded) {
			// Data is already loaded, avoid extra queries
			return;
		}

		//let api_url = 'http://samples.openweathermap.org/data/2.5/forecast?lat=8.4764&lon=124.6416&appid=43507a432ff38f75f3a2f067a0c89014'; // test url

		// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}

		var api_key = "43507a432ff38f75f3a2f067a0c89014";

		let api_url =
			"http://api.openweathermap.org/data/2.5/forecast?lat=" +
			this.state.location.latitude +
			"&lon=" +
			this.state.location.longitude +
			"&units=metric&appid=" +
			api_key +
			"";

		return fetch(api_url)
			.then(response => response.json())
			.then(responseJson => {
				var saveTime = new Date();
				//console.log('Download data from open weather api', responseJson);
				this.setState(
					{
						weatherDataLoaded: true,
						weatherData: responseJson,
						saveTime: saveTime,
						locationName: responseJson.city.name
					},
					function() {
						AsyncStorage.setItem(
							"saveTime",
							JSON.stringify(this.state.saveTime)
						);
						AsyncStorage.setItem(
							"weatherData",
							JSON.stringify(this.state.weatherData)
						);
						//console.log(this.state.weatherData);
					}
				);
			})
			.catch(error => {
				console.error(error);
			});
	};

	noWeatherData() {
		return (
			<View style={{ alignItems: "center" }}>
				<Text style={{ color: "#fff", fontSize: 20 }}>No data</Text>
				<Text style={{ color: "#fff", fontSize: 20 }}>for this time</Text>
			</View>
		);
	}

	// Display element only if Weather Data is loaded
	weatherDataLoaded(element) {
		if (this.state.weatherDataLoaded) {
			return element;
		} else {
			// Weather data not yet ready
			return null;
		}
	}

	onSelectDay(data) {
		//console.log('MAIN onSelectDay', data);
		this.setState(
			{
				selectedDate: data.date,
				selectedDataIndex: data.index,
				currentTemperature: this.state.weatherData.list[data.index].main
					.temp,
				currentWeather: this.state.weatherData.list[data.index].weather[0]
					.description
			},
			() => {
				//console.log('MAIN updateDay', this.state.currentTemperature);
				this.currentDayComponent.updateDay();
			}
		);
	}

	onSetTempUnit(unit) {
		if (unit !== this.state.temperatureUnit) {
			this.setState({ temperatureUnit: unit }, () => {});
		}
	}

	render() {
		return (
			<ScrollView 
				style={styles.main}
				contentContainerStyle={{
					alignItems: "center",
					justifyContent: "flex-start",
					//height: '100%',
					//paddingVertical: 20,
				}}
			>
				<Background
					time={this.state.selectedTime}
					onRef={ref => (this.backgroundComponent = ref)}
				/>

				<View style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: WINDOW_HEIGHT,
					//paddingBottom: 100,
					//backgroundColor: '#eee'
				}}>
					<View
						style={{
							alignItems: "center"
						}}
					>
						<View style={styles.topSection}>
							<View style={styles.topSectionLeft}>
								<UserLocation
									style={{ color: "#fff", fontSize: 16 }}
									onLoad={val => this.onLocationLoad(val)}
									locationName={this.state.locationName}
								/>
							</View>

							{this.weatherDataLoaded(
								<TemperatureSelect
									setTempUnit={val => this.onSetTempUnit(val)}
								/>
							)}
						</View>

						<CurrentTime time={this.state.selectedTime} />
					</View>

					<View style={styles.weatherDetailsContainer}>
						{this.weatherDataLoaded(
							<Knob
								onSelect={val => this.handleKnobChange(val)}
								time={this.state.selectedTime}
							/>
						)}

						{this.weatherDataLoaded(
							<View style={styles.weatherDetails}>
								{this.state.selectedDataIndex && (
									<Weather
										time={this.state.selectedTime}
										weather={this.state.currentWeather}
									/>
								)}

								{this.state.selectedDataIndex && (
									<Temperature
										temperature={this.state.currentTemperature}
										temperatureUnit={this.state.temperatureUnit}
									/>
								)}

								{!this.state.selectedDataIndex && this.noWeatherData()}
							</View>
						)}
					</View>

					<CurrentDay
						selectedDate={this.state.selectedDate}
						onRef={ref => (this.currentDayComponent = ref)}
					/>

					{this.weatherDataLoaded(
						<Days
							weatherData={this.state.weatherData}
							currentTime={this.state.currentTime}
							temperatureUnit={this.state.temperatureUnit}
							onSelectDay={val => this.onSelectDay(val)}
						/>
					)}
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	main: {
		// backgroundColor: "#F5FCFF",
		//height: "100%",
		//alignItems: "center",
		// justifyContent: "flex-start"
	},
	topSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: WINDOW_WIDTH,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 15,
		marginBottom: 20
	},
	weatherDetailsContainer: {
		position: "relative",
		width: 280
	},
	weatherDetails: {
		width: 240,
		height: 240,
		position: "absolute",
		left: "50%",
		marginLeft: -120,
		top: "50%",
		marginTop: -120,
		alignItems: "center",
		justifyContent: "center"
	}
});
