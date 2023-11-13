kuromojijs-dict-maker
---

kuromoji.js で利用できる辞書をつくるためのシンプルなツールです。  
デフォルトではipadicに単語を追加した辞書を作成しますが、baseの辞書を変更することもできます。

## usage

```bash
$ npm install
```

words/ にcsvファイルを追加してください。  
(ファイル名は任意、文字コードは任意です。UTF-8を推奨)  

```bash
$ cp example/words.csv words/original.csv
$ echo ユーザー辞書2,,,,名詞,一般,*,*,*,*,ユーザー辞書2,ユーザージショ2,ユーザージショ2,オリジナル単語 >> words/original.csv
```

### 辞書の作成と検証までを一貫して行う

ipadicのダウンロード、dict/ 配下に単語を追加した辞書の作成を行います。  
また、追加する単語で作ったテキストでのサンプル実行をおこないます。  

```bash
$ npm run all
...
...
-- sample_text --
こんにちは。ユーザー辞書バグるです。
----------------
word_id,word_type,word_position,surface_form,pos,pos_detail_1,pos_detail_2,pos_detail_3,conjugated_type,conjugated_form,basic_form,reading,pronunciation
309380,KNOWN,1,こんにちは,感動詞,*,*,*,*,*,こんにちは,コンニチハ,コンニチワ
2612880,KNOWN,6,。,記号,句点,*,*,*,*,。,。,。
3921260,KNOWN,7,ユーザー辞書,名詞,一般,*,*,*,*,ユーザー辞書,ユーザージショ,ユーザージショ
3921280,KNOWN,13,バグる,動詞,自立,*,*,一段,基本形,バグる,バグル,バグル
305080,KNOWN,16,です,助動詞,*,*,*,特殊・デス,基本形,です,デス,デス
2612880,KNOWN,18,。,記号,句点,*,*,*,*,。,。,。
----------------
````

dict/ 配下にあるファイルがオリジナルの辞書です。  
kuromoji.jsで利用できます。

### 単語を追加した辞書の作成のみ

```bash
$ npm run build
```

### 辞書の作成のみ

baseとなる辞書を base_dic/ にtar.gz形式で配置してください。
その後、以下を実行することで辞書を作成できます。

```bash
$ npm run make-dict
```

### オリジナル辞書の検証のみ

```bash
$ npm run test-dict
```

