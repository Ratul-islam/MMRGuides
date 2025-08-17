import { Router } from "express";
import GuideModel from "./model.js";
import { checkToken } from "../../middlewares/checkToken.js";

const guideRouter = Router();

// Simple validation for guide-table
const validateGuide = (data) => {
  const errors = [];
  if (!Array.isArray(data.rows) || data.rows.length === 0) errors.push("At least one row is required");

  if (Array.isArray(data.rows)) {
    data.rows.forEach((row, idx) => {
      if (!row.purpose && !row.guide && !row.link) {
        errors.push(`Row ${idx + 1}: At least one field is required`);
      }
    });
  }
  return errors;
};

// @route   GET /api/guides
// @desc    Get all guide tables
// @access  Public
guideRouter.get("/", async (req, res) => {
  try {
    // Parse page and limit from query params, with defaults
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Fetch paginated guides and total count
    const [guides, total] = await Promise.all([
      GuideModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      GuideModel.countDocuments()
    ]);

    res.json({
      success: true,
      data: guides,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching guides" });
  }
});

// @route   GET /api/guides/:id
// @desc    Get a specific guide table by id
// @access  Public
guideRouter.get("/:id", async (req, res) => {
  try {
    const guide = await GuideModel.findById(req.params.id);
    if (!guide)
      return res.status(404).json({ success: false, message: "Guide not found" });
    res.json({ success: true, data: guide });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching guide" });
  }
});

// @route   POST /api/guides
// @desc    Create new guide table
// @access  Private
guideRouter.post("/", checkToken, async (req, res) => {
  try {
    const errors = validateGuide(req.body);
    if (errors.length > 0)
      return res.status(400).json({ success: false, errors });

    const guide = new GuideModel({
      title: req.body.title ? req.body.title.trim() : "",
      description: req.body.description ? req.body.description.trim() : "",
      rows: req.body.rows,
    });

    await guide.save();

    res.status(201).json({ success: true, data: guide });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating guide" });
  }
});

// @route   PUT /api/guides/:id
// @desc    Update guide table
// @access  Private
guideRouter.put("/:id", checkToken, async (req, res) => {
  try {
    const guide = await GuideModel.findById(req.params.id);
    if (!guide)
      return res.status(404).json({ success: false, message: "Guide not found" });

    const errors = validateGuide(req.body);
    if (errors.length > 0)
      return res.status(400).json({ success: false, errors });

    guide.title = req.body.title ? req.body.title.trim() : "";
    guide.description = req.body.description ? req.body.description.trim() : "";
    guide.rows = req.body.rows;

    await guide.save();

    res.json({ success: true, data: guide });
  } catch {
    res.status(500).json({ success: false, message: "Error updating guide" });
  }
});

// @route   DELETE /api/guides/:id
// @desc    Delete guide table
// @access  Private
guideRouter.delete("/:id", checkToken, async (req, res) => {
  try {
    console.log(req.params.id)
    const guide = await GuideModel.findById(req.params.id);
    if (!guide)
      return res.status(404).json({ success: false, message: "Guide not found" });

    await GuideModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Guide deleted successfully" });
  } catch(err) {
    console.log(err)
    res.status(500).json({ success: false, message: "Error deleting guide" });
  }
});

export default guideRouter;