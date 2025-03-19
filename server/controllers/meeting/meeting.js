const MeetingHistory = require("../../model/schema/meeting");
const mongoose = require("mongoose");
const User = require("../../model/schema/user");

const add = async (req, res) => {
    try {
        const result = new MeetingHistory(req.body);
        await result.save();
        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to create :", err);
        res.status(400).json({ err, error: "Failed to create" });
    }
};

const index = async (req, res) => {
    try {
        const query = req.query;
        query.deleted = false;

        const user = await User.findById(req.user.userId);
        if (user?.role !== "superAdmin") {
            delete query.createBy;
            query.$or = [
                { createBy: new mongoose.Types.ObjectId(req.user.userId) },
                { assignUser: new mongoose.Types.ObjectId(req.user.userId) },
            ];
        }

        const result = await MeetingHistory.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "User",
                    localField: "createBy",
                    foreignField: "_id",
                    as: "createdByUser",
                },
            },
            {
                $lookup: {
                    from: "Contact",
                    localField: "attendes",
                    foreignField: "_id",
                    as: "attendeesData",
                },
            },
            {
                $lookup: {
                    from: "Lead",
                    localField: "attendesLead",
                    foreignField: "_id",
                    as: "attendeesLeadData",
                },
            },
            { $unwind: { path: "$createdByUser", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    createdByName: {
                        $concat: [
                            "$createdByUser.firstName",
                            " ",
                            "$createdByUser.lastName",
                            " ",
                            "$createdByUser.username",
                        ],
                    },
                    attendees: {
                        $map: {
                            input: "$attendeesData",
                            as: "attendee",
                            in: {
                                $concat: [
                                    "$$attendee.firstName",
                                    " ",
                                    "$$attendee.lastName",
                                    " ",
                                    "$$attendee.username",
                                ],
                            },
                        },
                    },
                    attendeesLead: {
                        $map: {
                            input: "$attendeesLeadData",
                            as: "lead",
                            in: {
                                $concat: [
                                    "$$lead.firstName",
                                    " ",
                                    "$$lead.lastName",
                                    " ",
                                    "$$lead.username",
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    createdByUser: 0,
                    attendeesData: 0,
                    attendeesLeadData: 0,
                },
            },
        ]);

        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to fetch meetings:", err);
        res.status(400).json({ err, error: "Failed to fetch meetings" });
    }
};

const view = async (req, res) => {
    try {
        let result = await MeetingHistory.findOne({ _id: req.params.id });
        if (!result) return res.status(404).json({ message: "No Data Found." });

        let response = await MeetingHistory.aggregate([
            { $match: { _id: result._id } },
            {
                $lookup: {
                    from: "User",
                    localField: "createBy",
                    foreignField: "_id",
                    as: "createdByUser",
                },
            },
            {
                $lookup: {
                    from: "Contact",
                    localField: "attendes",
                    foreignField: "_id",
                    as: "attendeesData",
                },
            },
            {
                $lookup: {
                    from: "Lead",
                    localField: "attendesLead",
                    foreignField: "_id",
                    as: "attendeesLeadData",
                },
            },
            { $unwind: { path: "$createdByUser", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    createdByName: {
                        $concat: ["$createdByUser.firstName", " ", "$createdByUser.lastName"],
                    },
                    attendees: {
                        $map: {
                            input: "$attendeesData",
                            as: "attendee",
                            in: { $concat: ["$$attendee.firstName", " ", "$$attendee.lastName"] },
                        },
                    },
                    attendeesLead: {
                        $map: {
                            input: "$attendeesLeadData",
                            as: "lead",
                            in: { $concat: ["$$lead.firstName", " ", "$$lead.lastName"] },
                        },
                    },
                },
            },
            {
                $project: {
                    createdByUser: 0,
                    attendeesData: 0,
                    attendeesLeadData: 0,
                },
            },
        ]);

        res.status(200).json(response[0]);
    } catch (err) {
        console.error("Failed to fetch meeting:", err);
        res.status(400).json({ err, error: "Failed to fetch meeting" });
    }
};

const deleteData = async (req, res) => {
    try {
        const result = await MeetingHistory.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", result: result });
    } catch (err) {
        res.status(404).json({ message: "error", err });
    }
};

const deleteMany = async (req, res) => {
    try {
        const result = await MeetingHistory.updateMany(
            { _id: { $in: req.body } },
            { $set: { deleted: true } },
        );
        res.status(200).json({ message: "done", result });
    } catch (err) {
        res.status(404).json({ message: "error", err });
    }
};

module.exports = { add, index, view, deleteData, deleteMany };
