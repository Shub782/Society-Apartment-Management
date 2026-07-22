const express = require("express");
const router = express.Router();

const Notice = require("../models/Notice");
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

// GET ALL
router.get("/", async(req,res)=>{

    try{

        const notices = await Notice.find().sort({createdAt:-1});

        res.json(notices);

    }

    catch(error){

        res.status(500).json({message:error.message});

    }

});

// GET ONE
router.get("/:id", async(req,res)=>{

    try{

        const notice = await Notice.findById(req.params.id);

        if(!notice){

            return res.status(404).json({
                message:"Notice not found"
            });

        }

        res.json(notice);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

// CREATE
router.post("/", async(req,res)=>{

    try{

        const notice = new Notice(req.body);

        const savedNotice = await notice.save();

        res.status(201).json(savedNotice);

    }

    catch(error){

        res.status(400).json({
            message:error.message
        });

    }

});

// UPDATE
router.put("/:id", async(req,res)=>{

    try{

        const updatedNotice = await Notice.findByIdAndUpdate(

            req.params.id,

            req.body,

            {new:true}

        );

        res.json(updatedNotice);

    }

    catch(error){

        res.status(400).json({
            message:error.message
        });

    }

});

// DELETE
router.delete("/:id", async(req,res)=>{

    try{

        await Notice.findByIdAndDelete(req.params.id);

        res.json({
            message:"Notice Deleted Successfully"
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});

module.exports = router;