// pages/api/logout.ts

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Çerezleri temizle
  res.setHeader("Set-Cookie", "jwt=; Path=/; Max-Age=0");

  // Tarayıcı tarafında yapılacak işlemler için bir yanıt dön
  res.status(200).json({ message: "Logged out" });
}
