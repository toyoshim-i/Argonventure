# Psychological Interrogation Adventure Anthology

スマートフォン縦画面（およびPCブラウザ）向けに設計された、約10分で遊べる「取調室・心理的駆け引き」テキストアドベンチャーゲームの2本立てアンソロジーです。

---

## 収録タイトル

### Vol.1『SILENT PULSE ― 23時45分の死角 ―』 ([`index.html`](./index.html))
- **ジャンル**: 本格刑事サスペンス・取調室尋問アドベンチャー
- **概要**: 深夜の特別取調室。主任研究員殺害事件の重要参考人であるエリートエンジニア「神崎 怜」の鉄壁のアリバイを崩す王道心理戦。
- **システム**:
  - リアルタイム心電図（ECG）＆心拍数（BPM）モニターと連動したWeb Audio合成心拍音
  - 相手の心理状態に合わせて態度を選ぶ「ゆさぶる（論理 / 共感 / 威圧）」と、矛盾を撃ち抜く「つきつける」
  - 最終フェーズでの「ハッタリ＆沈黙」による心理トラップ

### Vol.2『PASTEL VOID // 電脳取調室404号のバグ』 ([`pastel.html`](./pastel.html))
- **ジャンル**: ポスト・シンギュラリティ レトロフューチャーポップ心理アドベンチャー
- **概要**: 電脳都市「NEO-EDEN」で『昨日の夕焼け』のカセットを配り1,024人を幸福なフリーズに陥れた少女「MOMO-09」を取り調べる物語。しかし心理的に揺さぶられていくのは登場人物ではなく「プレイヤー（取調官自身）」。
- **システム**:
  - プレイヤー自身の自我同期率（`YOUR EGO SYNC`）モニターと、同期率低下に伴いデチューンしていくローファイ・シンセ音源
  - MOMOからの逆尋問（カウンター）によって、手元の証拠品ファイルの中身がリアルタイムに不気味な真実へ書き換わるメタ侵食ギミック
  - **2種類のイラストモード切替**: 90年代アニメ×PC-98風「👾 16-BIT PIXELモード（デフォルト）」と「🎨 MODERN ANIMEモード」をプレイ中いつでもワンタップで切替可能

---

## GitHub Pages での公開方法

本リポジトリは相対パス構成・`.nojekyll`・GitHub Actions ワークフロー（[`.github/workflows/pages.yml`](./.github/workflows/pages.yml)）を完備しており、そのまま GitHub Pages で公開できます。

1. GitHub 上のリポジトリの **Settings > Pages** を開きます。
2. **Build and deployment > Source** にて以下のいずれかを選択します：
   - **GitHub Actions**（推奨：`main` ブランチへの push 時に自動デプロイされます）
   - または **Deploy from a branch**（Branch: `main` / Folder: `/ (root)`）
3. 公開URL（`https://<username>.github.io/<repository>/`）へアクセスするとすぐにプレイ可能です。
