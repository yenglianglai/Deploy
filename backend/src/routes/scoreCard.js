import { Router } from "express";
import ScoreCard from "../models/ScoreCard";
const router = Router();

const deleteDB = async () => {
  try {
    await ScoreCard.deleteMany({});
    console.log("Database deleted");
    return "Database cleared";
  } catch (e) {
    throw new Error("Database deletion failed");
  }
};

const saveUser = async (name, subject, score) => {
  let msg;
  const existing = await ScoreCard.findOne({
    name,
    subject,
  });

  if (existing) {
    msg = `Updating (${name}, ${subject}, ${score})`;
    try {
      existing.score = score;
      existing.save();
      console.log("Updated user", name);
      return msg;
    } catch (e) {
      throw new Error("User creation error: " + e);
    }
  } else {
    msg = `Adding (${name}, ${subject}, ${score})`;
    try {
      const newUser = new ScoreCard({ name, subject, score });
      console.log("Created user", newUser);
      await newUser.save();
      return msg;
    } catch (e) {
      throw new Error("User creation error: " + e);
    }
  }
};

router.delete("/cards", async (_, res) => {
  const msg = await deleteDB();
  res.send({ message: msg });
});

router.post("/card", async (req, res) => {
  const name = req.body.name;
  const subject = req.body.subject;
  const score = req.body.score;

  try {
    const msg = await saveUser(name, subject, score);
    res.json({ message: msg, card: true });
  } catch (e) {
    res.json({ message: e, card: false });
  }
});
router.get("/cards", async (req, res) => {
  const type = req.query.type;
  const str = req.query.queryString;
  let existing = false;

  if (type === "name") {
    existing = await ScoreCard.find({ name: str }).exec();
  } else {
    existing = await ScoreCard.find({ subject: str }).exec();
  }

  if (existing.length === 0) {
    res.send({ message: `“QueryType ${str} not found!` });
  } else {
    const out = existing.map((q) => [
      `Found card with name: (${q.name}, ${q.subject}, ${q.score})`,
    ]);
    console.log(out);
    res.send({
      messages: out,
    });
  }
});
export default router;
