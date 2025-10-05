// controllers/timelineController.js
const Timeline = require('../Model/TimelineModel');

// 👉 Get all timelines
exports.getAllTimelines = async (req, res) => {
  try {
    const timelines = await Timeline.find();
    res.status(200).json(timelines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timelines", error });
  }
};

// 👉 Get a timeline by ID
exports.getTimelineById = async (req, res) => {
  try {
    const timeline = await Timeline.findById(req.params.id);
    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }
    res.status(200).json(timeline);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timeline", error });
  }
};

// 👉 Create new timeline
exports.createTimeline = async (req, res) => {
  try {
    const newTimeline = new Timeline(req.body);
    const savedTimeline = await newTimeline.save();
    res.status(201).json(savedTimeline);
  } catch (error) {
    res.status(500).json({ message: "Error creating timeline", error });
  }
};

// 👉 Update timeline
exports.updateTimeline = async (req, res) => {
  try {
    const updatedTimeline = await Timeline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated doc
    );

    if (!updatedTimeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    res.status(200).json(updatedTimeline);
  } catch (error) {
    res.status(500).json({ message: "Error updating timeline", error });
  }
};

// 👉 Delete timeline
exports.deleteTimeline = async (req, res) => {
  try {
    const deletedTimeline = await Timeline.findByIdAndDelete(req.params.id);

    if (!deletedTimeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    res.status(200).json({ message: "Timeline deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting timeline", error });
  }
};
