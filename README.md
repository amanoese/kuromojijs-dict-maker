kuromojijs-dict-maker
---

kuromoji.js で利用できる辞書をつくるためのシンプルなツールです。  
デフォルトではipadicに単語を追加した辞書を作成しますが、baseの辞書を変更することもできます。  

## usage

```bash
$ npm install
```

words/ にcsvファイルを追加してください。  
(ファイル名と文字コードは任意です。コストは未検証。UTF-8を推奨)  

```bash
$ cp example/words.csv words/original.csv
$ echo ユーザー辞書2,,,,名詞,一般,*,*,*,*,ユーザー辞書2,ユーザージショ2,ユーザージショ2,オリジナル単語 >> words/original.csv
```

### 単語を追加したオリジナル辞書を作成する

ipadic辞書に対して、words/ のcsvデータを辞書に追加してオリジナル辞書の作成を行います。  
dict/ 配下に辞書ファイルが出力されます。  

```bash
$ npm run build
```

### オリジナル辞書の検証する

以下を実行することで、任意の文章に対するオリジナル辞書の検証を行えます

```bash
$ npm run test-dict ユーザー辞書でググる

-- sample_text --
ユーザー辞書でググる
----------------
word_id,word_type,word_position,surface_form,pos,pos_detail_1,pos_detail_2,pos_detail_3,conjugated_type,conjugated_form,basic_form,reading,pronunciation
3921260,KNOWN,1,ユーザー辞書,名詞,一般,*,*,*,*,ユーザー辞書,ユーザージショ,ユーザージショ
306440,KNOWN,7,で,接続詞,*,*,*,*,*,で,デ,デ
3921290,KNOWN,8,ググる,動詞,自立,*,*,一段,基本形,ググる,ググル,ググル
----------------
```

### 辞書の作成のみ

npm run buildでは、ipadic辞書をダウンロードして利用しますが、  
他の辞書を利用したい場合以下の方法で実現できます。  
(未検証)  

ベースとなる辞書を base_dic/ にtar.gz形式で配置してください。  
その後、以下を実行することで辞書を作成できます。

```bash
$ npm run make-dict
```


### 辞書の作成と検証までを一貫して行う

辞書作成 + 検証を個別に実行するのが面倒なとき用です。  
dict/ 配下に単語を追加した辞書の作成を行います。  
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

