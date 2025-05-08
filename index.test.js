const { Room, Booking } = require('./index');

describe("Room", () => {
  let room;
  let booking1;
  let booking2;

  beforeEach(() => {
    room = new Room("Room A", 10000, 10);
    booking1 = new Booking(
      "John Doe",
      "john@example.com",
      new Date("2025-05-01"),
      new Date("2025-05-03"),
      5,
      room
    );
    booking2 = new Booking(
      "Jane Smith",
      "jane@example.com",
      new Date("2025-05-04"),
      new Date("2025-05-05"),
      0,
      room
    );
    room.bookings.push(booking1, booking2);
  });

  test("isOccupied returns true if date is within a booking", () => {
    expect(room.isOccupied(new Date("2025-05-01"))).toBe(true);
    expect(room.isOccupied(new Date("2025-05-02"))).toBe(true);
    expect(room.isOccupied(new Date("2025-05-06"))).toBe(false);
  });

  test("isOccupied returns false if date is not within any booking", () => {
    expect(room.isOccupied(new Date("2025-05-06"))).toBe(false);
    expect(room.isOccupied(new Date("2025-04-30"))).toBe(false);
  });

  test("occupancyPercentage returns correct value", () => {
    const start = new Date("2025-05-01");
    const end = new Date("2025-05-07");
    expect(room.occupancyPercentage(start, end)).toBe(71);
  });

  test("static totalOccupancyPercentage works", () => {
    const room2 = new Room("Room B", 8000, 0);
    room2.bookings.push(
      new Booking(
        "Mark",
        "mark@mail.com",
        new Date("2025-05-02"),
        new Date("2025-05-04"),
        0,
        room2
      )
    );
    const start = new Date("2025-05-01");
    const end = new Date("2025-05-05");

    const total = Room.totalOccupancyPercentage([room, room2], start, end);
    expect(total).toBeGreaterThan(0);
  });

  test("static availableRooms works", () => {
    const room2 = new Room("Room B", 8000, 0);
    const start = new Date("2025-05-01");
    const end = new Date("2025-05-03");
    const available = Room.availableRooms([room2], start, end);
    expect(available).toContain(room2);
  });
});

describe("Booking", () => {
  test("fee is calculated correctly with discounts", () => {
    const room = new Room("Room X", 10000, 10);
    const booking = new Booking(
      "Client",
      "client@mail.com",
      new Date("2025-05-01"),
      new Date("2025-05-04"),
      5,
      room
    );
    expect(booking.fee).toBeCloseTo(256.5);
  });
});
