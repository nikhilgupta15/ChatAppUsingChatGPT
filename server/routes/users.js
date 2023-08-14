import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/findUsername", async (req, res) => {
  try {
    const { username } = req.body;
    var users = [];

    await axios
      .get("https://api.chatengine.io/users/", {
        headers: {
          "Private-Key": process.env.PRIVATE_KEY,
        },
      })
      .then((res) => {
        users = res.data;
      });

    const isUernameExist =
      users.filter((user) => user.username === username).length > 0;

    res.status(200).json({ response: isUernameExist, status: 200 });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
