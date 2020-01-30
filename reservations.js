/* Reservations.js */

"use strict";

const log = console.log;
const fs = require("fs");
const datetime = require("date-and-time");

const startSystem = () => {
	let status = {};

	try {
		status = getSystemStatus();
	} catch (e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date()
		};

		fs.writeFileSync("status.json", JSON.stringify(status));
	}

	return status;
};

/*********/

// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	const statusString = fs.readFileSync("status.json");
	const statusObject = JSON.parse(statusString);

	const allReservations = getAllReservations();

	statusObject.numReservations = allReservations.length;

	const restNames = [];
	const restResvCount = [];

	allReservations.forEach(el => {
		if (restNames.includes(el.restaurant)) {
			const index = restNames.indexOf(el.restaurant);
			restResvCount[index] = restResvCount[index] + 1;
		}
		else {
			restNames.push(el.restaurant);
			restResvCount.push(1);
		}
	});

	const indexBusiest = indexOfMax(restResvCount);
	const busiestRest = restNames[indexBusiest];

	statusObject.currentBusiestRestaurantName = busiestRest;

	updateSystemStatus(statusObject);

	return statusObject;
};

/* Helper functions to save JSON */
// You can add arguments to updateSystemStatus if you want.
const updateSystemStatus = (newStatus) => {
	const status = {};

	/* Add your code below */
	if (newStatus) {
		status.numRestaurants = newStatus.numRestaurants;
		status.numReservations = newStatus.numReservations;
		status.currentBusiestRestaurantName = newStatus.currentBusiestRestaurantName;
		status.systemStartTime = newStatus.systemStartTime;
	}

	fs.writeFileSync("status.json", JSON.stringify(status));
};

// Helper function - used from Stackoverflow. Link: https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
function indexOfMax(arr) {
	if (arr.length === 0) {
		return -1;
	}

	var max = arr[0];
	var maxIndex = 0;

	for (var i = 1; i < arr.length; i++) {
		if (arr[i] > max) {
			maxIndex = i;
			max = arr[i];
		}
	}

	return maxIndex;
}

const saveRestaurantsToJSONFile = restaurants => {
	/* Add your code below */
	const resturantFilePath = './resturants.json';

	try {
		fs.writeFileSync(resturantFilePath, JSON.stringify(restaurants))
	}
	catch{
		throw ("Could not save resturants to JSON file.");
	}

};

const saveReservationsToJSONFile = reservations => {
	/* Add your code below */
	const reservationsFilePath = './reservations.json';
	reservations.sort(compareDates);
	try {
		fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations));
	}
	catch{
		throw ("Could not save reservations to JSON file.");
	}
};

// Helper compare function
const compareDates = (a, b) => {
	const aDate = new Date(a.time);
	const bDate = new Date(b.time);
	if (aDate.getTime() > bDate.getTime()) {
		return 1;
	}
	else if (bDate.getTime() > aDate.getTime()) {
		return -1;
	}
	else {
		return 0;
	}
}

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
	// Check for duplicate names
	// if no duplicate names:
	let duplicateFlag = false;
	const allResturants = getAllRestaurants();
	const trimmedName = name.trim();

	allResturants.forEach(rest => {
		if (rest.name === trimmedName) {
			duplicateFlag = true;
		}
	});

	// remove null and assign it to proper value
	let restaurant = null;

	if (duplicateFlag) {
		//nothing
	} else {
		restaurant = {
			name: trimmedName,
			description,
			numReservations: 0
		};
		const newResturantList = [...allResturants, restaurant];
		let status = getSystemStatus();
		status.numRestaurants = status.numRestaurants + 1;
		updateSystemStatus(status);
		saveRestaurantsToJSONFile(newResturantList);
	}


	return [restaurant];
};

// should return the added reservation object
const addReservation = (restaurant, time, people) => {
	/* Add your code below */
	const reservation = {
		restaurant,
		time: (new Date(time)).toISOString(),
		people
	}; // remove null and assign it to proper value
	const allReservations = getAllReservations();
	const newReservationList = [...allReservations, reservation];

	const allResturants = getAllRestaurants();
	const theRestaurant = allResturants.filter(el => el.name === restaurant)[0];
	theRestaurant.numReservations = theRestaurant.numReservations + 1;

	saveRestaurantsToJSONFile(allResturants);
	saveReservationsToJSONFile(newReservationList);
	return reservation;
};

/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	const resturantFilePath = "./resturants.json";
	let resturantFileData;

	try {
		resturantFileData = JSON.parse(fs.readFileSync(resturantFilePath, {
			encoding: "utf-8"
		}));
	} catch {
		resturantFileData = [];
		fs.writeFileSync(resturantFilePath, JSON.stringify(resturantFileData));
	}

	return resturantFileData;
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = name => {
	/* Add your code below */
	const allResturants = getAllRestaurants();
	const theRestaurant = allResturants.filter(el => el.name === name)[0];

	return theRestaurant;
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
	/* Add your code below */
	const reservationsFilePath = "./reservations.json";
	let reservationsFileData;

	try {
		reservationsFileData = JSON.parse(fs.readFileSync(reservationsFilePath, {
			encoding: "utf-8"
		}));
	} catch {
		reservationsFileData = [];
		fs.writeFileSync(reservationsFilePath, JSON.stringify(reservationsFileData));
	}

	return reservationsFileData;
};

// Should return an array
const getAllReservationsForRestaurant = name => {
	/* Add your code below */
	const allReservations = getAllReservations();
	const allResvForRest = allReservations.filter(el => el.restaurant === name);

	return allResvForRest;
};

// Should return an array
const getReservationsForHour = time => {
	/* Add your code below */
	const lowerLim = new Date(time);
	const upperLim = datetime.addMinutes(lowerLim, 60);

	const allReservations = getAllReservations();

	const reservationsList = allReservations.filter(el => {
		const elTime = new Date(el.time);
		if (elTime >= lowerLim && elTime < upperLim) {
			return true;
		}
		else {
			return false;
		}
	});
	return reservationsList;
};

// should return a reservation object
const checkOffEarliestReservation = restaurantName => {
	const allReservations = getAllReservations();
	const restReservations = allReservations.filter(el => el.restaurant === restaurantName)
	const theReservation = restReservations[0];
	const index = allReservations.indexOf(theReservation);
	let checkedOffReservation;
	if (index === -1) {
		checkedOffReservation = null;
	}
	else {
		checkedOffReservation = allReservations.splice(index, 1)[0]; // remove null and assign it to proper value
	}
	saveReservationsToJSONFile(allReservations);

	const allResturants = getAllRestaurants();
	const theRestaurant = allResturants.filter(el => el.name === restaurantName)[0];
	theRestaurant.numReservations = theRestaurant.numReservations - 1;

	saveRestaurantsToJSONFile(allResturants);

	return checkedOffReservation;

};

// Helper method for checkoff
const checkoffHelper = (el) => {

}

const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use a functional array method
	const allReservations = getAllReservations();
	allReservations.forEach(el => {
		if (el.restaurant === restaurant) {
			const oldTime = new Date(el.time);
			const newTime = new Date(oldTime.getTime() + parseInt(minutes) * 60000)
			el.time = newTime;
		}
	});
	saveReservationsToJSONFile(allReservations);

	return getAllReservationsForRestaurant(restaurant);
};

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
};
