const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Voucher = require("../models/voucher.js")
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "Staff"){
        const voucher = await Voucher.create(req.body);
        res.status(201).json(voucher);}
        else{
            res.status(403).send("Unauthorized user");
      }} catch (err) {
        res.status(500).json({ err: err.message });
      }
    });

    router.get("/", verifyToken, async (req, res) => {
        try {
          const vouchers = await Voucher.find({})
            .sort({ createdAt: "desc" });
          res.status(200).json(vouchers);
        } catch (err) {
          res.status(500).json({ err: err.message });
        }
      });
      
      router.get("/:voucherId", verifyToken, async (req, res) => {
        try {
            const voucher = await Voucher.findById(req.params.voucherId);
            res.status(200).json(voucher);
        } catch (error) {
            res.status(500).json({ err: err.message });    
        }
      });

      router.put("/:voucherId", verifyToken, async (req, res) => {
        try {
            if (req.user.role === "Staff"){
                const updatedVoucher = await Voucher.findByIdAndUpdate(req.params.voucherId, req.body, {new:true})
                res.status(200).json(updatedVoucher);
            } else{
                res.status(403).send("Unauthorized user");
            }
          } catch (err) {
            res.status(500).json({ err: err.message });
          }
        });

        router.delete("/:voucherId", verifyToken, async (req, res) => {
            try {
                if (req.user.role === "Staff"){
                    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.voucherId)
                    res.status(200).json(deletedVoucher);
                } else{
                    res.status(403).send("Unauthorized user");
                }
              } catch (err) {
                res.status(500).json({ err: err.message });
              }
            });

module.exports = router;
