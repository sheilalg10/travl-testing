"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.Booking = void 0;
class Booking {
    constructor(name, email, checkIn, checkOut, discount, room) {
        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }
    get fee() {
        const nights = Room.daysBetween(this.checkIn, this.checkOut);
        let baseRate = this.room.rate * (1 - this.room.discount / 100);
        let total = baseRate * nights;
        total *= 1 - this.discount / 100;
        return Math.round(total);
    }
}
exports.Booking = Booking;
class Room {
    constructor(name, rate, discount = 0) {
        this.bookings = [];
        this.name = name;
        this.rate = rate;
        this.discount = discount;
    }
    isOccupied(date) {
        return this.bookings.some((booking) => date >= booking.checkIn && date < booking.checkOut);
    }
    occupancyPercentage(startDate, endDate) {
        const totalDays = Room.daysBetween(startDate, endDate);
        if (totalDays === 0)
            return 0;
        let occupiedDays = 0;
        for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
            if (this.isOccupied(new Date(d)))
                occupiedDays++;
        }
        return (occupiedDays / totalDays) * 100;
    }
    static totalOccupancyPercentage(rooms, startDate, endDate) {
        const totalDays = Room.daysBetween(startDate, endDate) * rooms.length;
        if (totalDays === 0)
            return 0;
        let occupiedDays = 0;
        for (const room of rooms) {
            for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
                if (room.isOccupied(new Date(d)))
                    occupiedDays++;
            }
        }
        return (occupiedDays / totalDays) * 100;
    }
    static availableRooms(rooms, startDate, endDate) {
        const dates = [];
        for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }
        return rooms.filter((room) => dates.every((date) => !room.isOccupied(date)));
    }
    static daysBetween(start, end) {
        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.ceil((end.getTime() - start.getTime()) / msPerDay);
    }
}
exports.Room = Room;
