class Room {
  constructor(name, rate, discount = 0) {
    this.name = name;
    this.rate = rate;
    this.discount = discount;
    this.bookings = [];
  }

  isOccupied(date) {
    return this.bookings.some(
      (booking) => date >= booking.checkIn && date <= booking.checkOut
    );
  }

  occupancyPercentage(startDate, endDate) {
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
    let occupiedDays = 0;

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (this.isOccupied(new Date(d))) {
        occupiedDays++;
      }
    }

    return Math.round((occupiedDays / totalDays) * 100);
  }

  static totalOccupancyPercentage(rooms, startDate, endDate) {
    const total = rooms.reduce(
      (sum, room) => sum + room.occupancyPercentage(startDate, endDate),
      0
    );
    return Math.round(total / rooms.length);
  }

  static availableRooms(rooms, startDate, endDate) {
    return rooms.filter((room) => {
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        if (room.isOccupied(new Date(d))) return false;
      }

      return true;
    });
  }
}

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
    const nights = (this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24);
        let base = this.room.rate * nights;
        base -= base * (this.room.discount / 100);
        base -= base * (this.discount / 100);
        return base / 100; 
  }
}

module.exports = { Room, Booking };