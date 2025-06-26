const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// CORSを有効化（フロントエンドからのアクセスを許可）
app.use(cors());
app.use(express.json());

// 翻訳APIの中継エンドポイント
app.post("/api/translate", async (req, res) => {
  try {
    console.log("翻訳リクエスト:", req.body);

    const { q, source, target, format } = req.body;

    // MyMemory翻訳APIを使用（より安定）
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      q
    )}&langpair=${source}|${target}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("翻訳結果:", data);

    // MyMemory APIのレスポンス形式に合わせて変換
    const translatedText = data.responseData?.translatedText || q;

    res.json({
      translatedText: translatedText,
      original: q,
      source: source,
      target: target,
    });
  } catch (error) {
    console.error("翻訳エラー:", error);
    res.status(500).json({
      error: "翻訳エラー",
      message: error.message,
      translatedText: req.body.q, // エラー時は元のテキストを返す
    });
  }
});

// ヘルスチェック用エンドポイント
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "翻訳サーバーが正常に動作しています" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`翻訳中継サーバーが起動しました: http://localhost:${PORT}`);
  console.log("ヘルスチェック: http://localhost:3001/api/health");
});
