const kuromoji = require("kuromoji");
const { execSync } = require('child_process')

const fs = require('fs');
const fsp = fs.promises;
let timeout =  20 * 1000;

test('test building original dictionary', async () => {

  // clear words
  let files = await fsp.readdir('words')
  await Promise.all(files.filter(f=>f!=='.gitkeep').map(file => fsp.unlink(`words/${file}`)))
  // copy words
  fsp.copyFile('example/words.csv', 'words/words.csv')

  // build dic
  console.log('build dic')
  execSync('npm run build')

  // test
  const sample_text = "ユーザー辞書でググる";
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "dist/" }).build(function (err, tokenizer) {
        // tokenizer is ready
        let result = tokenizer.tokenize(sample_text);
        resolve(expect(result.map(r=>r.surface_form).join(' ')).toBe('ユーザー辞書 で ググる'));
    });
  });
},timeout);
