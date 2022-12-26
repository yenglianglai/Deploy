import { response, Router } from "express";
import ScoreCard from "../models/ScoreCard";
const router = Router();
router.delete("/cards", async (req, res) => {
    try {
        await ScoreCard.deleteMany({});
        res.json({ message: "Database cleared" })
    } catch (e) {
        res.send("Database deletion failed");
    };
});
router.post("/card", async (req, res) => {
    let name = req.body.name
    let subject = req.body.subject
    let score = req.body.score
    const existing = await ScoreCard.findOne({ name, subject });

    if (existing) {
        try {
            existing.score = score;
            await existing.save()
            res.send({ message: "Updating (" + name + ", " + subject + ", " + score + ")", card: true })
        } catch (e) {
            // throw new Error("ScoreCard creation error: " + e);
            res.send({ message: "ScoreCard updating error", card: false })
        }
    }
    else {
        try {
            const newScoreCard = new ScoreCard({ name, subject, score });
            await newScoreCard.save();
            res.send({ message: "Adding (" + name + ", " + subject + ", " + score + ")", card: true })
        } catch (e) {
            res.send({ message: "ScoreCard adding error", card: false })
        }
    }
});
router.get("/cards", async (req, res) => {
    let type = req.query.type;
    let queryString = req.query.queryString;
    let returnMessages = []
    try {
        if (type == "name") {
            const results = await ScoreCard.find({ name: queryString }).exec();
            if (!results.length) {
                res.send({ message: "Name (" + queryString + ") not found!" })
            }
            else {
                results.map(r => {
                    returnMessages.push("Found card with name: (" + r.name + ", " + r.subject + ", " + r.score + ")")
                })
                res.send({ messages: returnMessages })

            }
        }
        if (type == "subject") {
            const results = await ScoreCard.find({ subject: queryString }).exec();
            if (!results.length) {
                res.send({ message: "Subject (" + queryString + ") not found!" })
            }
            else {
                results.map(r => {
                    returnMessages.push("Found card with subject: (" + r.name + ", " + r.subject + ", " + r.score + ")")
                })
                res.send({ messages: returnMessages })
            }
        }
    }
    catch (e) {
        // console.log("here")
        res.send({ message: "ScoreCard updating error" })
    }
});


export default router;