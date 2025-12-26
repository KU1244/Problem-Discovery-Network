# next-tailwind-base

Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS v4 の最小UIテンプレート。
テンプレから新規プロジェクトを素早く起こすためのベースです。

* GitHub: [https://github.com/KU1244/next-tailwind-base](https://github.com/KU1244/next-tailwind-base)

---

## 技術スタック

* **Next.js** 16.0.1（App Router / Turbopack）
* **React** 19
* **TypeScript** 5
* **Tailwind CSS** 4（`@tailwindcss/postcss`）
* **ESLint**（`eslint-config-next`）
* **Import Alias**: `@/*` → `src/` をルートとして参照

## はじめかた（ローカル）

```bash
# 依存インストール
npm install

# 開発起動
npm run dev   # http://localhost:3000

# 本番ビルド → 起動
npm run build
npm start
```

> 推奨 Node.js: **20+**

---

## テンプレから新規プロジェクトを作る流れ

テンプレートを“乱用”するための標準手順を2通り用意しています。

### 方式1: GitHubの「Use this template」を使う（推奨）

1. このリポジトリ（`KU1244/next-tailwind-base`）を **Template Repository** に設定

    * GitHub → Settings → General → **Template repository** にチェック
2. 右上の **Use this template** から **新しいリポジトリ**を作成
3. ローカルで clone して開発開始

**メリット**: 履歴は新規リポのものから開始。シンプルで安全。

### 方式2: クローン→履歴切り離し→新リポに紐づけ（手動）

```bash
# ① テンプレを新プロジェクト名でクローン
git clone git@github.com:KU1244/next-tailwind-base.git my-new-project
cd my-new-project

# ② 履歴を切り離し（テンプレの .git を削除）
rm -rf .git

# ③ 自分の履歴で再初期化
git init
git add .
git commit -m "chore: scaffold from next-tailwind-base"

# ④ 新リポに接続して初回プッシュ
git branch -M main
git remote add origin git@github.com:<your-org-or-user>/<new-repo>.git
git push -u origin main
```

**メモ**: 完全に独立したい場合に有効。テンプレ側の履歴は持ち込まれません。

### 新規プロジェクト用チェックリスト

* `package.json` の `name` を新プロジェクト名に変更
* `README.md` のタイトル／リポURLを差し替え
* ライセンスや著作権表記を更新（必要なら）
* Node 20+ で動作確認 → 依存導入 → 開発起動

### 運用の小技

* **タグ運用**: テンプレ側で `v0.1.0` などタグを切っておくと、開始時点を記録しやすい
* **アップストリーム追随（任意）**:

  ```bash
  git remote add upstream git@github.com:KU1244/next-tailwind-base.git
  git fetch upstream
  git merge upstream/main   # or: git rebase upstream/main
  ```

  ※ 新規プロジェクトを完全独立運用するなら upstream の追加は不要。

---

## ディレクトリ（初期想定）

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    TestBox.tsx
postcss.config.mjs
tsconfig.json
```

## Tailwind v4 のポイント

* `postcss.config.mjs` に `@tailwindcss/postcss` を設定
* `app/globals.css` は v4 スタイルで記述（旧 `@tailwind base/components/utilities` は不要）

```css
/* app/globals.css の例 */
@import "tailwindcss";
@theme {
  --font-sans: "Inter", sans-serif;
  --color-brand: oklch(60% 0.2 250);
}
html, body {
  font-family: var(--font-sans);
}
```

## TypeScript 設定の要点

* `baseUrl: "."`、`paths: { "@/*": ["./src/*"] }`
* Next.js が起動時に `jsx: "react-jsx"` へ自動補正

## npm スクリプト

```bash
npm run dev     # 開発サーバ
npm run build   # 本番ビルド
npm start       # 本番起動
npm run lint    # ESLint
```

---

## ライセンス

プロジェクト要件に応じて追記してください。
