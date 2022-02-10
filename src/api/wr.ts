import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserStatsPlain } from "../fetch-adapter";

export default async (req: VercelRequest, res: VercelResponse) => {
  const font_color = (req.query.font_color as string | undefined) || "black";
  const win_color = (req.query.win_color as string | undefined) || "green";
  const lose_color = (req.query.lose_color as string | undefined) || "red";
  const profile = req.query.profile as string | undefined;
  const max = (req.query.max as string | undefined) || "5";
  const maxNum = Number.parseFloat(max);

  if (!profile || Number.isNaN(maxNum)) {
    res.setHeader("Content-Type", "application/json");
    res.send({ msg: "Missing argument" });
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(
    await getUserStatsPlain(profile, font_color, maxNum, win_color, lose_color)
  );
};
