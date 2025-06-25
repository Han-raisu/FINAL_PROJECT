# 翻訳中継サーバー

LibreTranslate APIの中継サーバーです。CORS問題を解決し、フロントエンドから翻訳APIを使用できるようにします。

## セットアップ

1. 依存関係をインストール
```bash
npm install
```

2. サーバーを起動
```bash
npm start
```

または開発モード（ファイル変更時に自動再起動）
```bash
npm run dev
```

## 使用方法

### 翻訳API
- **エンドポイント**: `POST /api/translate`
- **リクエスト例**:
```json
{
  "q": "こんにちは",
  "source": "ja",
  "target": "en",
  "format": "text"
}
```

### ヘルスチェック
- **エンドポイント**: `GET /api/health`
- サーバーの動作状況を確認できます

## ポート
デフォルト: 3001
環境変数 `PORT` で変更可能