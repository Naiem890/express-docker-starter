const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: Number,
      required: true,
      unique: true,
    },
    wallet_id: {
      type: Number,
      required: true,
      ref: "User",
    },
    stations: [
      {
        station_id: {
          type: Number,
          required: true,
          ref: "Station", 
        },
        train_id: Number,
        arrival_time: String,
        departure_time: String,
      },
    ],
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
