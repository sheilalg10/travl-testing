export class Booking {
  name: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  discount: number;
  room: Room;

  constructor(
    name: string,
    email: string,
    checkIn: Date,
    checkOut: Date,
    discount: number,
    room: Room
  ) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }

  get fee(): number {
    const nights = Room.daysBetween(this.checkIn, this.checkOut);
    let baseRate = this.room.rate * (1 - this.room.discount / 100);
    let total = baseRate * nights;
    total *= 1 - this.discount / 100;
    return Math.round(total);
  }
}

export class Room {
  name: string;
  bookings: Booking[] = [];
  rate: number;
  discount: number;

  constructor(name: string, rate: number, discount: number = 0) {
    this.name = name;
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date: Date): boolean {
    return this.bookings.some(
      (booking) => date >= booking.checkIn && date < booking.checkOut
    );
  }

  occupancyPercentage(startDate: Date, endDate: Date): number {
    const totalDays = Room.daysBetween(startDate, endDate);
    if (totalDays === 0) return 0;

    let occupiedDays = 0;
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      if (this.isOccupied(new Date(d))) occupiedDays++;
    }

    return (occupiedDays / totalDays) * 100;
  }

  static totalOccupancyPercentage(rooms: Room[], startDate: Date, endDate: Date): number {
    const totalDays = Room.daysBetween(startDate, endDate) * rooms.length;
    if (totalDays === 0) return 0;

    let occupiedDays = 0;
    for (const room of rooms) {
      for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
        if (room.isOccupied(new Date(d))) occupiedDays++;
      }
    }

    return (occupiedDays / totalDays) * 100;
  }

  static availableRooms(rooms: Room[], startDate: Date, endDate: Date): Room[] {
    const dates: Date[] = [];
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    return rooms.filter((room) =>
      dates.every((date) => !room.isOccupied(date))
    );
  }

  static daysBetween(start: Date, end: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((end.getTime() - start.getTime()) / msPerDay);
  }
}
