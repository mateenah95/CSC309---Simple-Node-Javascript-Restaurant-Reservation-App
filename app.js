/* E3 app.js */
"use strict";

const log = console.log;
const yargs = require("yargs")
  .option("addRest", {
    type: "array" // Allows you to have an array of arguments for particular command
  })
  .option("addResv", {
    type: "array"
  })
  .option("addDelay", {
    type: "array"
  });

const reservations = require("./reservations");

// datetime available if needed
const datetime = require("date-and-time");

const yargs_argv = yargs.argv;
// log(yargs_argv); // uncomment to see what is in the argument array

if ("addRest" in yargs_argv) {
  const args = yargs_argv["addRest"];
  const rest = reservations.addRestaurant(args[0], args[1]);
  if (rest[0] !== null) {
    log(`Added restaurant ${args[0]}.`);
  } else {
    log(`Duplicate restaurant not added.`);
  }
}

if ("addResv" in yargs_argv) {
  const args = yargs_argv["addResv"];
  const resv = reservations.addReservation(args[0], args[1], args[2]);

  // Produce output below
  if (resv) {
    const thedatetime = new Date(resv.time);
    const dateString = datetime.format(thedatetime, "MMM DD YYYY, HH:mm A");
    log(`Added reservation at ${resv.restaurant} on ${dateString} for ${resv.people} people.`);
  }
}

if ("allRest" in yargs_argv) {
  const restaurants = reservations.getAllRestaurants(); // get the array

  // Produce output below
  restaurants.forEach(restaurant => {
    log(
      `${restaurant.name}: ${restaurant.description} - ${restaurant.numReservations} active reservations.`
    );
  });
}

if ("restInfo" in yargs_argv) {
  const restaurants = reservations.getRestaurantByName(yargs_argv["restInfo"]);

  // Produce output below
  log(
    `${restaurants.name}: ${restaurants.description} - ${restaurants.numReservations} active reservations.`
  );
}

if ("allResv" in yargs_argv) {
  const restaurantName = yargs_argv["allResv"];
  const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(
    restaurantName
  ); // get the arary

  // Produce output below
  log(`Reservations for ${restaurantName}:`);
  reservationsForRestaurant.forEach(reservation => {
    const thedatetime = new Date(reservation.time);
    const dateString = datetime.format(thedatetime, "MMM DD YYYY, HH:mm A");
    log(`- ${dateString}, table for ${reservation.people}`);
  });
}

if ("hourResv" in yargs_argv) {
  const time = yargs_argv["hourResv"];
  const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary

  // Produce output below
  if (reservationsForRestaurant) {
    log('Reservations in the next hour:');
    reservationsForRestaurant.forEach(el => {
      const thedatetime = new Date(el.time);
      const dateString = datetime.format(thedatetime, "MMM DD YYYY, HH:mm A");
      log(`- ${el.restaurant}: ${dateString}, table for ${el.people}`);
    });
  }

}

if ("checkOff" in yargs_argv) {
  const restaurantName = yargs_argv["checkOff"];
  const earliestReservation = reservations.checkOffEarliestReservation(
    restaurantName
  );

  // Produce output below
  if (earliestReservation) {

    const thedatetime = new Date(earliestReservation.time);
    const dateString = datetime.format(thedatetime, "MMM DD YYYY, HH:mm A");
    log(`Checked off reservation on ${dateString}, table for ${earliestReservation.people}.`);
  }
}

if ("addDelay" in yargs_argv) {
  const args = yargs_argv["addDelay"];
  const resv = reservations.addDelayToReservations(args[0], args[1]);

  // Produce output below
  log(`Reservations for ${args[0]}:`);
  resv.forEach(reservation => {
    const thedatetime = new Date(reservation.time);
    const dateString = datetime.format(thedatetime, "MMM DD YYYY, HH:mm A");
    log(`- ${dateString}, table for ${reservation.people}`);
  });

}

if ("status" in yargs_argv) {
  const status = reservations.getSystemStatus();
  const reservationsList = reservations.getAllReservations();

  // Produce output below
  const thedatetime = new Date(status.systemStartTime);
  const dateString = datetime.format(thedatetime, "MMM DD YYYY, HH:mm A");

  log("Number of resturants: ", status.numRestaurants);
  log("Number of total reservations: ", reservationsList.length);
  log("Busiest resturant: ", status.currentBusiestRestaurantName);
  log("System started at: ", dateString);
}