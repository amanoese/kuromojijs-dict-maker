const kuromoji = require("kuromoji");
const fs = require('fs');
const fsp = fs.promises;

const words_dir = 'words/';

(async () => {
  const words = await fsp.readdir(words_dir)

  //csvファイルを読み込む
  let sample_csv = words.filter(v=>v.match(/csv$/))[0];
  let csvs = [];
  if (sample_csv) {
    let data = await fsp.readFile(`${words_dir}${sample_csv}`);
    csvs = data.toString().split('\n').map(v=>v.split(','));
  }

  //名詞と名詞以外を分ける
  let meishis = csvs.filter(v=>v[4] == '名詞').map(v=>v[0]).filter(v=>v.match(/\S+/))
  let not_meishis = csvs.filter(v=>v[4] != '名詞').map(v=>v[0]).filter(v=>v.match(/\S+/));

  //適当な名詞と名詞以外を取得する
  let maybe_meishi = [ ...meishis , ...not_meishis ][0] || '名詞';
  let maybe_not_meishi = [ ...not_meishis, ...meishis ][0] || '名詞以外';

  //適当な名詞と名詞以外を組み合わせて文章を作る
  let sample_text = `こんにちは。${maybe_meishi}${maybe_not_meishi}です。`
  console.log('-- sample_text --')
  console.log(sample_text)

  //kuromojiで形態素解析する
  kuromoji.builder({ dicPath: "dist/" }).build(function (err, tokenizer) {
      // tokenizer is ready
      let result = tokenizer.tokenize(sample_text);
      console.log('----------------')
      console.log(Object.keys(result[0]).join(','))
      result.forEach(v=>{
        console.log(Object.values(v).join(','))
      })
      console.log('----------------')
      console.log(JSON.stringify(result,null,0))
  });
})();
