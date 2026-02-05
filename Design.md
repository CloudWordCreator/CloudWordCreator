# TOEIC対応版

## 概略

隠しドメインからアクセスしてTOEICの単語でテストをできるようにする。
> 隠しドメインは例えば `cloudwordcreator.duckdns.org/toeic`でログインを要求する
> アクセスしたらTOEICテストをできるようにする

## 構造

- 現在使っている`https://cloudwordcreator.duckdns.org/`はそのまま
- 新しく`https://cloudwordcreator.duckdns.org/toeic`を作成し、パスワードを要求する

このとき`/`のデータと`/toeic`とは別のデータとして干渉しないようにする。

## データベース

### アップロードするcsvファイルの構造

```csv
No,score,phrase,pharseJP,英語,日本語
1,730,a m------ increase in price.,小幅の値上げ,modest,少しの、高価ではない、謙虚な
2,730,apply for a p-----.,特許を出願する,patent,特許
3,730,The company is p------ing a new market.,その会社は新しい市場を追い求めている。,pursue,追及する、追い求める
4,730,a r------ moutain village,人里離れた山村,remote,人里離れた、可能性が低い
5,730,r------ the cause of the problem,reveal,明らかにする
6,800,a housing a------,住宅手当,allowance,手当、小遣い、許容量
7,800,Innovation is c------ for business success.,技術革新は会社の成功に非常に重要だ,curucial,非常に重要だ
8,800,a d------ carreer as a journalist,ジャーナリストとしての際立って優れた経歴,distinguished,際立って優れた、傑出した
9,800,I'm sorry to d----- you.,邪魔してすみません。,disturb,邪魔する、悩ませる
10,800,Applicants mus be f------ in Mandarin.,応募者は北京語がペラペラでなければいけません。,fluent,流ちょうな、堪能な
```

| No | score | phrase | pharseJP | 英語 | 日本語 |
| --- | --- | --- | --- | --- | --- |
| 1 | 730 | a m------ increase in price. | 小幅の値上げ | modest | 少しの、高価ではない、謙虚な |
| 2 | 730 | apply for a p-----., | 特許を出願する | patent | 特許 |
| 3 | 730 | The company is p------ing a new market. | その会社は新しい市場を追い求めている。 | pursue | 追及する、追い求める |
| 4 | 730 | a r------ moutain village | 人里離れた山村 | remote | 人里離れた、可能性が低い |
| 5 | 730 | r------ the cause of the problem | reveal | 明らかにする |
| 6 | 800 | a housing a------ | 住宅手当 | allowance | 手当、小遣い、許容量 |
| 7 | 800 | Innovation is c------ for business success. | 技術革新は会社の成功に非常に重要だ | curucial | 非常に重要だ |
| 8 | 800 | a d------ carreer as a journalist | ジャナリストとしての際立って優れた経歴 | distinguished | 際立って優れた、傑出した |
| 9 | 800 | I'm sorry to d----- you. | 邪魔してすみません。 | disturb | 邪魔する、悩ませる |
| 10 | 800 | Applicants mus be f------ in Mandarin. | 応募者は北京語がペラペラでなければいけません。 | fluent | 流ちょうな、堪能な |

### SQL

| No | score | phrase | pharseJP | English | Japanese |
| --- | --- | --- | --- | --- | --- |
| 1 | 730 | a m------ increase in price. | 小幅の値上げ | modest | 少しの、高価ではない、謙虚な |
| 2 | 730 | apply for a p-----., | 特許を出願する | patent | 特許 |
| 3 | 730 | The company is p------ing a new market. | その会社は新しい市場を追い求めている。 | pursue | 追及する、追い求める |
| 4 | 730 | a r------ moutain village | 人里離れた山村 | remote | 人里離れた、可能性が低い |
| 5 | 730 | r------ the cause of the problem | reveal | 明らかにする |
| 6 | 800 | a housing a------ | 住宅手当 | allowance | 手当、小遣い、許容量 |
| 7 | 800 | Innovation is c------ for business success. | 技術革新は会社の成功に非常に重要だ | curucial | 非常に重要だ |
| 8 | 800 | a d------ carreer as a journalist | ジャナリストとしての際立って優れた経歴 | distinguished | 際立って優れた、傑出した |
| 9 | 800 | I'm sorry to d----- you. | 邪魔してすみません。 | disturb | 邪魔する、悩ませる |
| 10 | 800 | Applicants mus be f------ in Mandarin. | 応募者は北京語がペラペラでなければいけません。 | fluent | 流ちょうな、堪能な |


### アップロードする場合

既存の[CSVManager](csvManager)に`| No | score | phrase | pharseJP | English | Japanese |`に対応したロジックを追加する。
既存のファイルに追加をするか、新しいディレクトリで作成するかは今後検討する。

## ログイン

既存のログイン画面を作成する。


## テストについて

### テスト設定

- 教材選択
- 範囲からランダムに作成
- 全範囲からランダムに作成
-  フレーズも全範囲からランダム、範囲からランダム
- フレーズのオプションは日あり/なし

> 問題数は25問そのまま

### テスト画面

- 表形式で表示
- セルに答えを入力してEnterを押すと正誤判定して次のセルへ移るようにする。
- ヘッダーに答えを表示ボタンで答えが見えるようにする。
- 前回作った機能(印刷など)はそのまま利用できるようにする。

## 作成に当たり必要なもの

- [ ] 別アカウント
- [ ] データベースに書き込むロジック
- [ ] テストの種類、設定画面
- [ ] テスト画面
- [ ] 簡単な編集画面 (誤字脱字修正用)
