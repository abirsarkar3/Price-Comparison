import express, { Request, Response } from "express";
import cors from "cors";
import { fetchPrices } from "../lib/fetchPrices";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/fetch-prices", async (req: Request, res: Response) => {
  const { item, category, location } = req.body;
  if (!item || !category || !location) {
    return res.status(400).json({ error: "Missing parameters" });
  }
  try {
    const results = await fetchPrices({ item, category, location });
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});