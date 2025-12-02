const express = require("express");
const router = express.Router();

// connect prisma
const { PrismaClient } = require("@prisma/client");
const authorize = require("../middleware/authorizeMiddleware");
const prisma = new PrismaClient();

const { checkISO8601Format } = require("../helpers/dataValidation");
const containsExtraFields = require("../helpers/extraFieldValidation");

/* EVENTS ENDPOINTS */

// Remove logged in user from event (Veda Kesarwani)
router.delete(
  "/:eventId/guests/me",
  authorize(["regular"]),
  async (req, res) => {
    const loggedUser = await prisma.user.findFirst({
      where: { utorid: req.user.utorid },
    });

    if (!loggedUser) {
      return res.status(404).json({ error: "Not Found" });
    }
    const eventId = parseInt(req.params.eventId);
    if (isNaN(eventId)) {
      return res
        .status(400)
        .json({ error: "Bad Request - eventId is invalid" });
    }

    // Find event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { guests: true },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if event ended
    const now = new Date();
    if (new Date(event.endTime) < now) {
      return res.status(410).json({ error: "Event has ended" });
    }

    // Check if user is actually on the guest list
    const isGuest = event.guests.some((g) => g.id === loggedUser.id);
    if (!isGuest) {
      return res.status(404).json({ error: "User not found in guest list" });
    }

    // Remove the logged-in user
    await prisma.event.update({
      where: { id: eventId },
      data: {
        guests: { disconnect: { id: loggedUser.id } },
      },
    });

    return res.status(204).send();
  }
);

// Delete a user from an event (Veda Kesarwani)
router.delete(
  "/:eventId/guests/:userId",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    // Validate params
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.params.userId);
    if (isNaN(eventId) || isNaN(userId)) {
      return res
        .status(400)
        .json({ error: "Bad Request - eventId or userId is invalid" });
    }

    // Check event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { guests: true },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if guest exists in event
    const guestExists = event.guests.some((g) => g.id === userId);
    if (!guestExists) {
      return res.status(404).json({ error: "Guest not found in this event" });
    }

    // Remove guest from event
    await prisma.event.update({
      where: { id: eventId },
      data: {
        guests: { disconnect: { id: userId } },
      },
    });

    return res.status(204).send();
  }
);

// Join as a guest (Veda Kesarwani)
router.post(
  "/:eventId/guests/me",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    const eventId = parseInt(req.params.eventId);

    const loggedUser = await prisma.user.findFirst({
      where: { utorid: req.user.utorid },
    });

    if (!loggedUser) {
      return res.status(404).json({ error: "Not Found" });
    }

    if (isNaN(eventId)) {
      return res
        .status(400)
        .json({ error: "Bad Request - eventId is invalid" });
    }

    // Get event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { guests: true },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if event ended
    const now = new Date();
    if (new Date(event.endTime) < now) {
      return res.status(410).json({ error: "Event has ended" });
    }

    // Check if full
    if (event.capacity && event.guests.length >= event.capacity) {
      return res.status(410).json({ error: "Event is full" });
    }

    // Check if user already in guest list
    const alreadyGuest = event.guests.some((g) => g.id === loggedUser.id);
    if (alreadyGuest) {
      return res.status(400).json({ error: "User already on guest list" });
    }

    // Add user to event guest list
    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        guests: { connect: { id: loggedUser.id } },
      },
      include: {
        guests: true,
      },
    });

    // Get full event info for response
    const numGuests = updated.guests.length;
    return res.status(201).json({
      id: updated.id,
      name: updated.name,
      location: updated.location,
      guestAdded: {
        id: req.user.id,
        utorid: req.user.utorid,
        name: req.user.name,
      },
      numGuests,
    });
  }
);

// delete a organizer user from an event (Jennifer Tan)
router.delete(
  "/:eventId/organizers/:userId",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    /**
     * Step 1: check authorization
     *
     *  Clearance: Manager or higher
     */
    const { role } = req.user;
    if (role === "regular" || role === "cashier") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const eventId = Number(req.params["eventId"]);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(404).json({ error: "Not found" });
    }
    const userId = Number(req.params["userId"]);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(404).json({ error: "Not found" });
    }
    const event = await prisma.event.findFirst({
      where: { id: eventId },
      include: { guests: true, organizers: true },
    });
    if (!event) {
      return res.status(404).json({ error: "Not found" });
    }
    const organizerUser = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!organizerUser) {
      return res.status(404).json({ error: "Not found" });
    }
    if (!event.organizers.find((organizer) => organizer.id === userId)) {
      return res
        .status(404)
        .json({ error: "Not found - user is not an organizer" });
    }
    // Remove organizer from event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        organizers: { disconnect: { id: userId } },
      },
      include: {
        organizers: true,
      },
    });
    return res.status(204).send();
  }
);

// add a guest to an event (Jennifer Tan)
router.post(
  "/:eventId/guests",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    /**
     * Step 1: check authorization
     *
     *  Manager or higher, or an organizer for this event
     */
    const eventId = Number(req.params["eventId"]);
    if (!Number.isInteger(eventId)) {
      return res.status(404).json({ error: "Not Found" });
    }
    // step 2: check payload validity

    const guestUtorID = req.body.utorid;

    if (!guestUtorID || typeof guestUtorID !== "string" || guestUtorID === "") {
      return res.status(400).json({ error: "Bad Request" });
    }

    // look for user by utorid
    const guestUser = await prisma.user.findFirst({
      where: {
        utorid: guestUtorID,
      },
    });

    if (!guestUser) {
      return res.status(404).json({ error: "Not found" });
    }

    // look for event
    const event = await prisma.event.findFirst({
      where: { id: eventId },
      include: { guests: true, organizers: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Not found" });
    }

    const { role, utorid } = req.user;

    // check if the user is an organizer, if not, check if they are manager or higher
    const isOrganizer = event.organizers.find(
      (organizer) => organizer.utorid === utorid
    );
    const isManagerOrSuperUser = role === "manager" || role === "superuser";
    if (!isOrganizer && !isManagerOrSuperUser) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // check if guest is already a organizer
    if (
      event.organizers.find(
        (organizer) => organizer.utorid === guestUser.utorid
      )
    ) {
      return res.status(400).json({ error: "Bad Request" });
    }

    // check is user is already a guest
    if (event.guests.find((guest) => guest.utorid === guestUser.utorid)) {
      return res
        .status(400)
        .json({ error: "Bad Request - user is already a guest" });
    }

    if (!event.published) {
      // if the event is not visible to the organizer yet
      if (!isManagerOrSuperUser) {
        return res.status(404).json({ error: "Not found" });
      }
    }

    // check if event has ended
    const currentDateTime = new Date();
    const endDateTime = new Date(event.endTime);

    if (endDateTime < currentDateTime) {
      return res.status(410).json({ error: "Gone" });
    }

    // check if guest list is full
    if (event.capacity === event.guests.length) {
      return res.status(410).json({ error: "Gone" });
    }

    // update the list of guests
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        guests: {
          connect: { id: guestUser.id },
        },
      },
      select: { id: true, name: true, location: true, guests: true },
    });

    if (updatedEvent) {
      return res.status(201).json({
        id: updatedEvent.id,
        name: updatedEvent.name,
        location: updatedEvent.location,
        guestAdded: {
          id: guestUser.id,
          utorid: guestUser.utorid,
          name: guestUser.name,
        },
        numGuests: updatedEvent.guests.length,
      });
    } else {
      return res.status(404).json({ error: "Not found" });
    }
  }
);

// Add an organizer to this event (Jennifer Tan)
router.post(
  "/:eventId/organizers",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    // step 1: check validity
    const { role } = req.user;
    if (role === "regular" || role === "cashier") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // step 2: validation
    const { utorid } = req.body;

    if (!utorid || typeof utorid !== "string" || utorid === "") {
      return res.status(400).json({ error: "Bad Request" });
    }

    const eventId = Number(req.params["eventId"]);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(404).json({ error: "Not found - Event Not FOund" });
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId },
      include: { guests: true, organizers: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Not found - Event Not Found" });
    }

    const organizerUser = await prisma.user.findFirst({
      where: { utorid: utorid },
    });

    if (!organizerUser) {
      return res
        .status(404)
        .json({ error: "Not found - Organizer user not found" });
    }

    // check if user is already in guest list
    if (event.guests.find((guest) => guest.utorid === utorid)) {
      return res
        .status(400)
        .json({ error: "Bad Request - User is already a Guest" });
    }

    // check if event has ended
    const currentDateTime = new Date();
    const endDateTime = new Date(event.endTime);

    if (endDateTime < currentDateTime) {
      return res.status(410).json({ error: "Gone" });
    }

    // update the list of organizers
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        organizers: {
          connect: { id: organizerUser.id },
        },
      },
      include: {
        organizers: true,
        guests: true,
      },
    });

    if (!updatedEvent) {
      return res
        .status(404)
        .json({ error: "Not Found - updated event not found" });
    }

    // Get full event info for response

    return res.status(201).json({
      id: updatedEvent.id,
      name: updatedEvent.name,
      location: updatedEvent.location,
      organizers: updatedEvent.organizers,
    });
  }
);

// Create a new reward transaction (Veda Kesarwani)
router.post(
  "/:eventId/transactions",
  authorize(["manager", "superuser", "regular"]), // regular allowed only if organizer
  async (req, res) => {
    const allowedFields = ["type", "utorid", "amount", "remark"];
    if (containsExtraFields(allowedFields, req.body)) {
      return res
        .status(400)
        .json({ error: "Bad request - extra fields present" });
    }

    const eventId = parseInt(req.params.eventId, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ error: "Bad Request - invalid eventId" });
    }

    // Verify type and amount
    if (req.body.type !== "event") {
      return res.status(400).json({ error: "Bad Request - invalid type" });
    }
    const amount = parseInt(req.body.amount, 10);
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Bad Request - amount must be positive integer" });
    }

    // Check event existence
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizers: true, guests: true },
    });
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Clearance check
    const isOrganizer = event.organizers.some(
      (o) => o.utorid === req.user.utorid
    );
    if (req.user.role === "regular" && !isOrganizer) {
      return res
        .status(403)
        .json({ error: "Forbidden - not authorized for this event" });
    }

    // Check if event has enough remaining points
    if (event.pointsRemain < amount) {
      return res
        .status(400)
        .json({ error: "Bad Request - not enough remaining points" });
    }

    // Case 1: single guest (utorid provided)
    if (req.body.utorid) {
      const guest = await prisma.user.findUnique({
        where: { utorid: req.body.utorid },
      });
      if (!guest) {
        return res.status(400).json({ error: "Bad Request - guest not found" });
      }
      const isGuest = event.guests.some((g) => g.utorid === guest.utorid);
      if (!isGuest) {
        return res.status(400).json({
          error: "Bad Request - user not on guest list for this event",
        });
      }
      if (event.pointsRemain < amount) {
        return res
          .status(400)
          .json({ error: "Bad Request - not enough remaining points" });
      }

      const transaction = await prisma.transaction.create({
        data: {
          type: "event",
          spent: 0,
          amount: amount,
          processed: true,
          suspicious: false,
          remark: req.body.remark || null,
          user: { connect: { id: guest.id } },
          creator: { connect: { id: req.user.id } },
        },
        select: {
          id: true,
          user: { select: { utorid: true } },
          amount: true,
          type: true,
          remark: true,
          creator: { select: { utorid: true } },
        },
      });

      // Update guest points + event remaining points
      await prisma.user.update({
        where: { id: guest.id },
        data: { points: { increment: amount } },
      });
      await prisma.event.update({
        where: { id: eventId },
        data: { pointsRemain: { decrement: amount } },
      });

      return res.status(201).json({
        id: transaction.id,
        recipient: transaction.user.utorid,
        awarded: transaction.amount,
        type: "event",
        relatedId: eventId,
        remark: transaction.remark,
        createdBy: transaction.creator.utorid,
      });
    }

    // Case 2: award to all guests
    const guests = event.guests;
    if (guests.length === 0) {
      return res
        .status(400)
        .json({ error: "Bad Request - no guests to award points to" });
    }
    const totalNeeded = guests.length * amount;
    if (event.pointsRemain < totalNeeded) {
      return res
        .status(400)
        .json({ error: "Bad Request - not enough remaining points" });
    }

    const results = [];
    for (const guest of guests) {
      const transaction = await prisma.transaction.create({
        data: {
          type: "event",
          spent: 0,
          amount: amount,
          processed: true,
          suspicious: false,
          remark: req.body.remark || null,
          user: { connect: { id: guest.id } },
          creator: { connect: { id: req.user.id } },
        },
        select: {
          id: true,
          user: { select: { utorid: true } },
          amount: true,
          type: true,
          remark: true,
          creator: { select: { utorid: true } },
        },
      });
      await prisma.user.update({
        where: { id: guest.id },
        data: { points: { increment: amount } },
      });
      results.push({
        id: transaction.id,
        recipient: transaction.user.utorid,
        awarded: transaction.amount,
        type: "event",
        relatedId: eventId,
        remark: transaction.remark,
        createdBy: transaction.creator.utorid,
      });
    }

    await prisma.event.update({
      where: { id: eventId },
      data: { pointsRemain: { decrement: totalNeeded } },
    });

    return res.status(201).json(results);
  }
);

// retrieve one event (Jennifer Tan)
router.get(
  "/:eventId",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    const { role, utorid } = req.user;

    const allowedFields = []; // payload must be empty

    if (containsExtraFields(allowedFields, req.body)) {
      return res
        .status(400)
        .json({ error: "Bad request - extra fields present" });
    }

    // step 2: params validity
    const eventId = Number(req.params["eventId"]);

    if (!Number.isInteger(eventId) || eventId < 0) {
      return res.status(404).json({ error: "Not Found" });
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId },
      include: { guests: true, organizers: true },
    });

    if (event) {
      if (role === "regular") {
        // regular users only see certain information
        // check if user is an organizer
        const isOrganizer = event.organizers.find(
          (organizer) => organizer.utorid === utorid
        );
        if (isOrganizer) {
          return res.status(200).json({
            id: event.id,
            name: event.name,
            description: event.description,
            location: event.location,
            startTime: event.startTime,
            endTime: event.endTime,
            capacity: event.capacity,
            pointsRemain: event.pointsRemain,
            pointsAwarded: event.pointsAwarded,
            published: event.published,
            organizers: event.organizers,
            guests: event.guests,
          });
        } else {
          return res.status(200).json({
            id: event.id,
            name: event.name,
            description: event.description,
            location: event.location,
            startTime: event.startTime,
            endTime: event.endTime,
            capacity: event.capacity,
            organizers: event.organizers,
            numGuests: event.guests.length,
          });
        }
      } else {
        return res.status(200).json({
          id: event.id,
          name: event.name,
          description: event.description,
          location: event.location,
          startTime: event.startTime,
          endTime: event.endTime,
          capacity: event.capacity,
          pointsRemain: event.pointsRemain,
          pointsAwarded: event.pointsAwarded,
          published: event.published,
          organizers: event.organizers,
          guests: event.guests,
        });
      }
    } else {
      return res.status(404).json({
        error: "Not Found",
      });
    }
  }
);

// edit an event (Jennifer Tan)
router.patch(
  "/:eventId",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    const { utorid, role } = req.user;

    // step 2: payload validity

    // check authorization level
    if (!(role === "manager" || role === "superuser")) {
      if (req.body.points) {
        return res.status(403).json({
          error: "Forbidden: Only managers and super users can update points",
        });
      }
      if (req.body.published) {
        return res.status(403).json({
          error:
            "Forbidden: Only managers and super users can update published",
        });
      }
    }
    // name
    if ("name" in req.body && req.body.name != null) {
      if (typeof req.body.name !== "string") {
        return res.status(400).json({
          error: "Bad Request - Name is Invalid",
        });
      }
    }

    if ("description" in req.body && req.body.description != null) {
      if (typeof req.body.description !== "string") {
        return res.status(400).json({
          error: "Bad Request - Description is Invalid",
        });
      }
    }

    if ("location" in req.body && req.body.location != null) {
      if (typeof req.body.location !== "string") {
        return res.status(400).json({
          error: "Bad Request - Location is Invalid",
        });
      }
    }

    // checking starttime and datetime
    const currentDateTime = new Date();
    if ("startTime" in req.body && req.body.startTime != null) {
      const startDate = new Date(req.body.startTime);
      if (!checkISO8601Format(req.body.startTime)) {
        return res.status(400).json({
          error: "Bad Request - startTime is Invalid",
        });
      }

      if (startDate < currentDateTime) {
        return res.status(400).json({
          error: "Bad Request - Event has already started",
        });
      }
    }

    if ("endTime" in req.body && req.body.endTime != null) {
      const endDate = new Date(req.body.endTime);
      if (!checkISO8601Format(req.body.endTime)) {
        return res.status(400).json({
          error: "Bad Request - endTime is Invalid",
        });
      }

      if (endDate < currentDateTime) {
        return res.status(400).json({
          error: "Bad Request - Event has Ended is Invalid",
        });
      }
    }

    if (
      "startTime" in req.body &&
      req.body.startTime != null &&
      "endTime" in req.body &&
      req.body.endTime != null
    ) {
      const startDate = new Date(req.body.startTime);
      const endDate = new Date(req.body.endTime);
      if (startDate > endDate) {
        return res.status(400).json({
          error: "Bad Request - Start time cannot be after end time is Invalid",
        });
      }
    }

    if ("capacity" in req.body && req.body.capacity != null) {
      if (
        !Number.isInteger(req.body.capacity) ||
        Number(req.body.capacity) < 0
      ) {
        return res.status(400).json({
          error: "Bad Request - Capacity is Invalid",
        });
      }
    }

    // update points
    if ("points" in req.body && req.body.points != null) {
      if (!Number.isInteger(req.body.points) || Number(req.body.points) < 0) {
        return res.status(400).json({
          error: "Bad Request - points is Invalid",
        });
      }
    }
    if (req.body.published != null && req.body.published !== true) {
      return res
        .status(400)
        .json({ error: "Bad Request - published is not set to true" });
    }

    const eventId = Number(req.params["eventId"]);

    if (!Number.isInteger(eventId) || eventId < 0) {
      return res.status(404).json({ error: "Not Found" });
    }

    // Other bad request checks
    const originalEvent = await prisma.event.findFirst({
      where: { id: eventId },
      include: { guests: true, organizers: true },
    });

    if (!originalEvent) {
      return res.status(400).json({ error: "Not Found" });
    }

    // If capacity is reduced, but the number of confirmed guests exceeds the new capacity.
    if (req.body.capacity != null) {
      const currentGuests = originalEvent.guests ?? [];
      const newCapacity = Number(req.body.capacity);
      const currentCapacity = originalEvent.capacity ?? Infinity;

      // Only check if reducing capacity
      if (newCapacity < currentCapacity && currentGuests.length > newCapacity) {
        return res.status(400).json({
          error:
            "Bad Request - Number of confirmed guests exceeds the new capacity",
        });
      }
    }

    //  If the total amount of points is reduced, resulting in the remaining points allocated
    // to the event falling below zero. Points already awarded to guests cannot be retracted through this API.
    if (
      req.body.points != null &&
      Number(req.body.points) <
        originalEvent.pointsAwarded + originalEvent.pointsRemain
    ) {
      return res.status(400).json({
        error: "Bad Request - New Points is below remaining points allocated",
      });
    }

    //  If update(s) to name, description, location, startTime, or capacity is made after the original start time has passed.
    const originalStartDate = new Date(originalEvent.startTime);
    const originalEndDate = new Date(originalEvent.endTime);
    if (
      (("name" in req.body && req.body.name != null) ||
        ("description" in req.body && req.body.description != null) ||
        ("location" in req.body && req.body.location != null) ||
        ("startTime" in req.body && req.body.startTime != null) ||
        ("capacity" in req.body && req.body.capacity != null)) &&
      originalStartDate < currentDateTime
    ) {
      return res.status(400).json({
        error: "Bad Request - Original Start Time as passed",
      });
    }

    if (req.body.endTime && originalEndDate < currentDateTime) {
      return res.status(400).json({
        error: "Bad Request - Event has Ended",
      });
    }

    if (role === "manager" || role === "superuser") {
      // successful
      const updateData = {};
      if ("name" in req.body && req.body.name != null)
        updateData.name = req.body.name;
      if ("description" in req.body && req.body.description != null)
        updateData.description = req.body.description;
      if ("location" in req.body && req.body.location != null)
        updateData.location = req.body.location;
      if ("startTime" in req.body && req.body.startTime != null)
        updateData.startTime = req.body.startTime;
      if ("endTime" in req.body && req.body.endTime != null)
        updateData.endTime = req.body.endTime;
      if ("capacity" in req.body && req.body.capacity != null)
        updateData.capacity = req.body.capacity;
      if ("points" in req.body && req.body.points != null)
        updateData.pointsRemain = req.body.points - originalEvent.pointsAwarded;
      if ("published" in req.body && req.body.published != null)
        updateData.published = req.body.published;
      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: updateData, // only update fields that were included
        select: {
          // only retrieve the values that were changed
          id: true,
          name: true,
          description: true,
          location: true,
          startTime: req.body.startTime != null,
          endTime: req.body.endTime != null,
          capacity: req.body.capacity != null,
          pointsRemain: req.body.points != null,
          published: req.body.published != null,
        },
      });

      if (!updatedEvent) {
        return res.status(404).json({ error: "Not Found" });
      } else {
        return res.status(200).json(updatedEvent);
      }
    } else {
      if (published || points) {
        // only manager and higher can update these info
        return res.status(403).json({ error: "Forbidden" });
      } else {
        // need to check if person is an organizer
        const organizer = originalEvent.organizers.find(
          (organizer) => organizer.utorid === utorid
        );
        if (!organizer) {
          // user is NOT an organizer
          return res.status(403).json({ error: "Forbidden" });
        }

        const updateData = {};
        if ("name" in req.body && req.body.name != null)
          updateData.name = req.body.name;
        if ("description" in req.body && req.body.description != null)
          updateData.description = req.body.description;
        if ("location" in req.body && req.body.location != null)
          updateData.location = req.body.location;
        if ("startTime" in req.body && req.body.startTime != null)
          updateData.startTime = req.body.startTime;
        if ("endTime" in req.body && req.body.endTime != null)
          updateData.endTime = req.body.endTime;
        if ("capacity" in req.body && req.body.capacity != null)
          updateData.capacity = req.body.capacity;
        const updatedEvent = await prisma.event.update({
          where: { id: eventId },
          data: updateData,
          select: {
            // only retrieve the values that were changed
            id: true,
            name: true,
            description: true,
            location: true,
            startTime: req.body.startTime != null,
            endTime: req.body.endTime != null,
            capacity: req.body.capacity != null,
          },
        });
        if (!updatedEvent) {
          return res.status(404).json({ error: "Not Found" });
        } else {
          return res.status(200).json(updatedEvent);
        }
      }
    }
  }
);

// delete an event (Jennifer Tan)
router.delete(
  "/:eventId",
  authorize(["manager", "superuser"]),
  async (req, res) => {
    // step 1: authorization
    const { role } = req.user;
    if (role === "regular" || role === "cashier") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // step 2: check validity
    const eventId = Number(req.params["eventId"]);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(404).json({ error: "Not Found" });
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: "Not Found" });
    }

    if (event.published) {
      return res.status(400).json({ error: "Bad Request" });
    } else {
      const deletedEvent = await prisma.event.delete({
        where: { id: eventId },
      });
      if (deletedEvent) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: "Not Found" });
      }
    }
  }
);

// registers a new event (Jennifer Tan)
router.post("/", authorize(["manager", "superuser"]), async (req, res) => {
  // step 1: check authorization, manager or higher required

  // step 2: check payload validity
  const { name, description, location, startTime, endTime, capacity, points } =
    req.body;

  const allowedFields = [
    "name",
    "description",
    "location",
    "startTime",
    "endTime",
    "capacity",
    "points",
  ];

  if (containsExtraFields(allowedFields, req.body)) {
    return res
      .status(400)
      .json({ error: "Bad request - extra fields present" });
  }

  // check mandatory strings
  if (!name || typeof name !== "string" || name.trim().length <= 0) {
    return res.status(400).json({ error: "Bad Request - Name" });
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length <= 0
  ) {
    return res.status(400).json({ error: "Bad Request - Description" });
  }

  if (
    !location ||
    typeof location !== "string" ||
    location.trim().length <= 0
  ) {
    return res.status(400).json({ error: "Bad Request - Location" });
  }

  if (
    !startTime ||
    typeof startTime !== "string" ||
    startTime.trim().length <= 0
  ) {
    return res.status(400).json({ error: "Bad Request - StartTime" });
  }

  if (!endTime || typeof endTime !== "string" || endTime.trim().length <= 0) {
    return res
      .status(400)
      .json({ error: "Bad Request - EndTime Strings Payload" });
  }

  // points must be a positive integer
  if (!points || !Number.isInteger(Number(points)) || Number(points) < 0) {
    return res
      .status(400)
      .json({ error: "Bad Request - Invalid Points Payload" });
  }

  // check time
  if (!checkISO8601Format(startTime) || !checkISO8601Format(endTime)) {
    return res.status(400).json({
      error: "Bad Request - Invalid StartTime/EndTime Payload : ISO Format",
    });
  }

  const capacityValidity =
    (capacity && Number.isInteger(Number(capacity)) && Number(capacity) > 0) ||
    capacity === null; // capacity is either null or a positive integer

  if (!capacityValidity) {
    return res.status(400).json({
      error: "Bad Request - Capacity must be a positive integer or null",
    });
  }

  // If start time or end time (or both) is in the past.
  const currentDateTime = new Date();
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  if (
    startDate < currentDateTime ||
    endDate < currentDateTime ||
    endDate < startDate // start date cannot be after end Date
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request - Date Order is invalid" });
  }

  // step 3: return newly created event
  const newEvent = await prisma.event.create({
    data: {
      name: name,
      description: description,
      location: location,
      startTime: startTime,
      endTime: endTime,
      capacity: capacity,
      pointsRemain: points,
    },
    include: {
      guests: true,
      organizers: true,
    },
  });

  return res.status(201).json({
    id: newEvent.id,
    name: newEvent.name,
    description: newEvent.description,
    location: newEvent.location,
    startTime: newEvent.startTime,
    endTime: newEvent.endTime,
    capacity: newEvent.capacity,
    pointsRemain: newEvent.pointsRemain,
    pointsAwarded: newEvent.pointsAwarded,
    published: newEvent.published,
    guests: newEvent.guests,
    organizers: newEvent.organizers,
  });
});

// gets a list of events (Jennifer Tan)
router.get(
  "/",
  authorize(["regular", "cashier", "manager", "superuser"]),
  async (req, res) => {
    /**
     * step 1: check for authorization
     *
     * Clearance: regular and higher
     *
     * regular cannot see unpublished events -> need to filter
     */

    // step 2: check payload validity

    const { role } = req.user;

    // check for authorization
    if (role === "regular" || role === "cashier") {
      if ("published" in req.query && req.query.purchased !== null) {
        return res.status(403).json({
          error: "Forbidden - Publish only available for manager or higher.",
        });
      }
    } else {
      if ("published" in req.query && req.query.published !== null) {
        if (
          typeof req.query.published !== "string" ||
          (req.query.published !== "false" && req.query.published !== "true") // if it IS a string, then check the actual content
        ) {
          return res
            .status(400)
            .json({ error: "Bad Request - Published is Invalid" });
        }
      }
    }

    // name
    if ("name" in req.query && req.query.name != null) {
      if (typeof req.query.name !== "string") {
        return res.status(400).json({
          error: "Bad Request - Name is Invalid",
        });
      }
    }

    // description
    if ("description" in req.query && req.query.description != null) {
      if (typeof req.query.description !== "string") {
        return res.status(400).json({
          error: "Bad Request - Description is Invalid",
        });
      }
    }

    if ("location" in req.query && req.query.location != null) {
      if (typeof req.query.location !== "string") {
        return res.status(400).json({
          error: "Bad Request - Location is Invalid",
        });
      }
    }

    if ("started" in req.query && req.query.started !== null) {
      if (
        typeof req.query.started !== "string" ||
        (req.query.started !== "false" && req.query.started !== "true")
      ) {
        return res.status(400).json({
          error: "Bad Request - Started is Invalid",
        });
      }
    }

    if ("ended" in req.query && req.query.ended !== null) {
      if (
        typeof req.query.ended !== "string" ||
        (req.query.ended !== "false" && req.query.ended !== "true")
      ) {
        return res.status(400).json({
          error: "Bad Request - Ended is Invalid",
        });
      }
    }

    if ("showFull" in req.query && req.query.showFull !== null) {
      if (
        typeof req.query.showFull !== "string" ||
        (req.query.showFull !== "false" && req.query.showFull !== "true")
      ) {
        return res.status(400).json({
          error: "Bad Request - ShowFull is Invalid",
        });
      }
    }

    if ("page" in req.query && req.query.page !== null) {
      if (
        !Number.isInteger(Number(req.query.page)) ||
        Number(req.query.page) <= 0
      ) {
        return res.status(400).json({ error: "Bad Request - Page is Invalid" });
      }
    }

    // NEW!
    if ("organizerId" in req.query && req.query.organizerId !== null) {
      if (
        !Number.isInteger(Number(req.query.organizerId)) ||
        Number(req.query.organizerId) <= 0
      ) {
        return res.status(404).json({ error: "Not Found" });
      }

      // see if user exists
      const organizerUser = await prisma.user.findFirst({
        where: { id: Number(req.query.organizerId) },
      });

      if (!organizerUser) {
        return res
          .status(404)
          .json({ error: "Not found - Organizer user not found" });
      }
    }

    // filter by guestId
    if ("guestId" in req.query && req.query.guestId !== null) {
      if (
        !Number.isInteger(Number(req.query.guestId)) ||
        Number(req.query.guestId) <= 0
      ) {
        return res.status(404).json({ error: "Not Found" });
      }

      // see if user exists
      const guestUser = await prisma.user.findFirst({
        where: { id: Number(req.query.guestId) },
      });

      if (!guestUser) {
        return res
          .status(404)
          .json({ error: "Not found - Organizer user not found" });
      }
    }

    let page;

    // set default value
    if (!req.query.page) {
      page = 1; // default is 1
    } else {
      page = Number(req.query.page);
    }

    if ("limit" in req.query && req.query.limit !== null) {
      if (
        !Number.isInteger(Number(req.query.limit)) ||
        Number(req.query.limit) <= 0
      ) {
        return res
          .status(400)
          .json({ error: "Bad Request - Limit is Invalid" });
      }
    }

    let limit;

    if (!req.query.limit) {
      limit = 10;
    } else {
      limit = Number(req.query.limit);
    }

    /* Filtering */

    // step 3: look for events with name, description, and location filters
    let events = await prisma.event.findMany({
      include: { guests: true, organizers: true },
    }); // just get all of them

    // filter by name
    if (req.query.name) {
      events = events.filter((event) => event.name === req.query.name);
    }

    // filter by description
    if (req.query.description) {
      events = events.filter(
        (event) => event.description === req.query.description
      );
    }

    // filter by location
    if (req.query.location) {
      events = events.filter((event) => event.location === req.query.location);
    }

    // filter by showFull

    if (req.query.showFull) {
      if (req.query.showFull === "false") {
        // only show events that are not full
        events = events.filter(
          (event) => !(event.capacity === event.guests.length)
        );
      } // otherwise, show ALL events regardless if they are full
    }

    const currentDateTime = new Date();
    if (req.query.started === "true") {
      // return events where the startDate <= currentDateTime
      events = events.filter((event) => {
        const startDate = new Date(event.startTime);
        if (startDate <= currentDateTime) {
          return event;
        }
      });
    } else if (req.query.started === "false") {
      // return events where the startDate > currentDateTime
      events = events.filter((event) => {
        const startDate = new Date(event.startTime);
        if (startDate > currentDateTime) {
          return event;
        }
      });
    }

    if (req.query.ended === "true") {
      // return events where the endDate <= currentDateTime
      events = events.filter((event) => {
        const endDate = new Date(event.endTime);
        if (endDate <= currentDateTime) {
          return event;
        }
      });
    } else if (req.query.ended === "false") {
      // return events where the endDate > currentDateTime
      events = events.filter((event) => {
        const endDate = new Date(event.endTime);
        if (endDate > currentDateTime) {
          return event;
        }
      });
    }

    // regular users cannot see unpublished events, but only manager and super user can filter
    if (role === "regular" || role === "cashier") {
      events = events.filter((event) => event.published === true);
    } else if (role === "manager" || role === "superuser") {
      if (req.query.published == "true") {
        events = events.filter((event) => event.published === true);
      } else if (req.query.published === "false") {
        events = events.filter((event) => event.published === false);
      }
    }

    // filter by if theyre an organizer
    if (req.query.organizerId) {
      events = events.filter((event) =>
        event.organizers.find(
          (organizer) => Number(organizer.id) === Number(req.query.organizerId)
        )
      );
    }

    // filter by if theyre a guest
    if (req.query.guestId) {
      events = events.filter((event) =>
        event.guests.find((guest) => {
          return Number(guest.id) === Number(req.query.guestId);
        })
      );
    }

    const totalEventCount = events.length;

    // perform pagination
    const startIndex = (page - 1) * limit;
    let newEventList = [];
    for (let i = startIndex; i < startIndex + limit; i++) {
      let event = events[i];
      if (event) {
        if (role === "manager" || role === "superuser") {
          newEventList.push({
            id: event.id,
            name: event.name,
            location: event.location,
            startTime: event.startTime,
            endTime: event.endTime,
            capacity: event.capacity,
            pointsRemain: event.pointsRemain,
            pointsAwarded: event.pointsAwarded,
            published: event.published,
            numGuests: event.guests.length,
          });
        } else {
          newEventList.push({
            id: event.id,
            name: event.name,
            location: event.location,
            startTime: event.startTime,
            endTime: event.endTime,
            capacity: event.capacity,
            numGuests: event.guests.length,
          });
        }
      }
    }

    return res.status(200).json({
      count: totalEventCount,
      results: newEventList,
    });
  }
);

/* =========== INVALID ENDPOINTS =========== */

// endpoint: /events/:eventId/guests/:userId (Veda Kesarwani)
router.all("/:eventId/guests/:userId", (_, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// endpoint: /events/:eventId/guests/me (Veda Kesarwani)
router.all("/:eventId/guests/me", (_, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// endpoint: /events/:eventId/organizers/:userId (Jennifer Tan)
router.all("/:eventId/organizers/:userId", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

// endpoint: /events/:eventId/guests (Jennifer Tan)
router.all("/:eventId/guests", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

//endpoint: /events/:eventId/transactions (Veda Kesarwani)
router.all("/:eventId/transactions", (_, res) => {
  return res.status(405).json({ error: "Method unsupported" });
});

// endpoint: /events/:eventId/organizers/ (Jennifer Tan)
router.all("/:eventId/organizers/", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

// endpoint: /events/:eventId/ (Jennifer Tan)
router.all("/:eventId", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

// endpoint: /events/  (Jennifer Tan)
router.all("/", (_, res) => {
  return res.status(405).json({ error: "Not Allowed" });
});

module.exports = router;
