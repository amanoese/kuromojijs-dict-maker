const axios = require('axios');
const fs = require('fs');
const fsp = fs.promises;
const { unzip } = require('node:zlib');
const { promisify } = require('node:util');
const do_unzip = promisify(unzip);


(async () => {
  const base_dic = 'base_dic/';
  if (!fs.existsSync(base_dic)) {
    fs.mkdirSync(base_dic);
  }
  if (fs.existsSync(`${base_dic}mecab-ipadic.tar.gz`)) {
    console.log('mecab-ipadic.tar.gz already exists');
    return;
  }
  console.log('mecab-ipadic.tar.gz downloading...');
  const url = 'https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7MWVlSDBCSXZMTXM';
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');
  await fsp.writeFile(`${base_dic}mecab-ipadic.tar.gz`, buffer);
  console.log(`${base_dic}mecab-ipadic.tar.gz downloaded`);
})();
 
