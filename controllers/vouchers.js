const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Voucher = require("../models/voucher.js");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "staff") {
      const voucher = await Voucher.create(req.body);
      res.status(201).json(voucher);
    } else {
      res.status(403).send("Unauthorized user");
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const vouchers = await Voucher.find({}).sort({ createdAt: "desc" });
    res.status(200).json(vouchers);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:voucherId", verifyToken, async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.voucherId);
    res.status(200).json(voucher);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:voucherId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "staff") {
      const updatedVoucher = await Voucher.findByIdAndUpdate(
        req.params.voucherId,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedVoucher);
    } else {
      res.status(403).send("Unauthorized user");
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:voucherId", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "staff") {
      const deletedVoucher = await Voucher.findByIdAndDelete(
        req.params.voucherId
      );
      res.status(200).json(deletedVoucher);
    } else {
      res.status(403).send("Unauthorized user");
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/redeem/:voucherId", verifyToken, async (req, res) => {
  try {
    const { voucherId } = req.params;
    const userId = req.user._id;

    if (req.user.role === "shopper") {
      const voucher = await Voucher.findById(voucherId);
      if (!voucher) {
        return res.status(404).json({ err: "Voucher not found" });
      }

      const userRedemptionCount = voucher.redeemedBy.filter(
        (entry) => entry.user.toString() === userId.toString()
      ).length;

      if (userRedemptionCount >= voucher.redemptionsPerShopper) {
        return res.status(400).json({ err: "Redemption limit reached" });
      }

      voucher.redeemedBy.push({ user: userId, date: new Date() });
      voucher.globalRedemptionCount += 1;

      await voucher.save();

      res.json({ message: "Voucher redeemed successfully", voucher });
    } else {
      res.status(403).send("Unauthorized user");
    }
  } catch (err) {
    console.error("Error redeeming voucher:", err);
    res.status(500).json({ err: "Server error" });
  }
});

module.exports = router;