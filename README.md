<div id="top"></div>
<img width="958" alt="headder" src="https://github.com/user-attachments/assets/21a55949-07bb-403e-ae2a-ba912e0298d2">

## 使用技術一覧

<!-- シールド一覧 -->
<p style="display: inline">
  <!-- フロントエンドのフレームワーク・ライブラリ一覧 -->
  <img src="https://github.com/user-attachments/assets/c0d80d44-1c5c-4e61-884d-b31f11f037f5">
  <img src="https://github.com/user-attachments/assets/a5edb846-818e-4b0c-a659-f7c9993ed82c">
  <img src="https://github.com/user-attachments/assets/fb5866fb-a538-496b-8565-c728b1c570dd">
  <!-- フロントエンド言語一覧 -->
  <img src="https://github.com/user-attachments/assets/a64bf638-dd8b-4af6-8474-c828f0af07ae">
  <!-- バックエンドのフレームワーク一覧 -->
  <!-- バックエンド言語 -->
  <!-- DB -->
  <!-- インフラ一覧 -->
  <img src="https://github.com/user-attachments/assets/084dbda7-8613-42be-a31d-bc5ec19059c2">
 
</p>

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [今後の展望](#今後の展望)

<!-- プロジェクト名を記載 -->

<!-- プロジェクトの概要を記載 -->

<!-- プロジェクトについて -->

## プロジェクトについて
飲食店の勤怠管理アプリ
知人の飲食店でタイムカードとExcelで管理している勤怠を人件費削減＆計算ミスをなくすことを、目的として作成した。
mainブランチにマージされることでvercelにデプロイされる

<img src="https://github.com/user-attachments/assets/68e0cf5a-5ac1-4396-bf10-49e1b2446b89">


## 技術選定理由
フロントについてはTypeScript+Next.jsで構築した。
モダンな技術について学んでおきたかったことと、機能的にSEO対策などは必要ないがVercelにデプロイすることを想定していたため相性のいいNext.jsで構築した。
また課題解決とともにモダンなフロントエンド技術の学習も目的としていたため、コンポーネントやUIはライブラリを使用しAPIとの通信や全体の構成を学習の工数として使用した。

詳細は下記をご覧ください

<img src="https://github.com/user-attachments/assets/130559ff-1231-4297-8af3-65e8eedbe6de">[勤怠管理アプリを作る 技術選定編](https://qiita.com/TechYoichiro/items/00fdf080a0832baf5dea?utm_campaign=post_article&utm_medium=twitter&utm_source=twitter_share)


### 気づいたこと/工夫したこと
一つの建物に店舗が2つあり、1日にその両方で勤務する従業員がいる。
店舗を間違えて打刻しないようにポップアップを出すことや、打刻するボタンの活性制御などを必要に応じてつけている。
また権限に応じて画面側で制御をかけることで打刻の修正や勤怠記録の確認機能に制限をかけている。

## 動作画面
| ログイン画面  | サインアップ画面 |
| --------------------- | ---------- |
| <img src="https://github.com/user-attachments/assets/c9b1dedc-97ed-424e-963c-ff0e7ee8b66b"> | <img src="https://github.com/user-attachments/assets/16c3e357-3d67-409d-8ef2-7163be95e029"> |

| 打刻画面  | 勤怠記録一覧画面(検索時) |
| --------------------- | ---------- |
| <img src="https://github.com/user-attachments/assets/56ac310c-9b55-4da5-9b49-74225c1173a7"> | <img src="https://github.com/user-attachments/assets/db536c4c-bf70-4908-abeb-5fc36b45b68f"> |

| 打刻修正画面  | 設定画面※今後追加予定 |
| --------------------- | ---------- |
| <img src="https://github.com/user-attachments/assets/3aacfbf0-ab64-4dbb-b939-f79fce169d31"> | 今後実装予定 |

| 勤怠記録一覧画面(管理者)  | 勤怠記録一覧画面(従業員) |
| --------------------- | ---------- |
| <img src="https://github.com/user-attachments/assets/e9df4115-7d82-43e2-9215-8faf3f2e2e54"> | <img src="https://github.com/user-attachments/assets/d8b50a1e-e3e4-423d-8037-d8eff0026ccc"> |

## 環境

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

| 言語・フレームワーク・ライブラリ  | バージョン |
| --------------------- | ---------- |
| node.js               | 20.8.0      |
| TypeScript            | 5.5.4    |
| Next.js               | 14.2.8      |
| tailwindcss           | 5.5.4    |

その他のパッケージのバージョンはpackage.jsonを参照してください

<!-- コンテナの作成方法、パッケージのインストール方法など、開発環境構築に必要な情報を記載 -->

## 今後の展望
今後は給与明細の出力とシフトの管理機能を追加していく予定。

<p align="right">(<a href="#top">トップへ</a>)</p>
