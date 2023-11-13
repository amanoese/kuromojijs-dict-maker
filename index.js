const kuromoji = require('kuromoji');
const dictionaryBuilder = kuromoji.dictionaryBuilder()
const fs = require('fs');
const {TextDecoder} = require('util');
const Encoding = require('encoding-japanese');
const fsp = fs.promises;
const {gzip, ungzip} = require('node-gzip');
const tar = require('tar');
const tmp = require('tmp-promise');

const base_dic = 'base_dic/';
const words_dir = 'words/';
const TEMP_DIR = tmp.dirSync().name;
const DIST_DIR = 'dist/';

const bufferEncodingDetect = (data) => {
  const result = Encoding.detect(data);
  const type = {
    'UTF8': 'utf-8',
    'UTF16': 'utf-16',
    'SJIS': 'shift_jis',
    'EUCJP': 'euc-jp',
    'ASCII': 'ascii',
  }[result];
  return type
}
const autoDecodeReadFilep = async (path) => {
  let data = await fsp.readFile(path);
  let type = bufferEncodingDetect(data);
  const filename = path.split('/').pop();
  console.log(type,filename)
  return (new TextDecoder(type)).decode(data);
}

(async () => {
  console.log(`temp directory: ${TEMP_DIR}`);
  const dics = await fsp.readdir(base_dic)
  const dic_gz  = dics.filter(v=>v.match(/gz$/))[0];
  await tar.x({
    file: `${base_dic}${dic_gz}`,
    cwd: TEMP_DIR,
    strip: 1,
  }).then(()=>{
    console.log('extracted')
  }).catch((err)=>{
    console.log(err)
  })

  console.log('-- dictionary files --')
  const mtrix_def = await autoDecodeReadFilep(`${TEMP_DIR}/matrix.def`)
  const char_def = await autoDecodeReadFilep(`${TEMP_DIR}/char.def`)
  const unk_def = await autoDecodeReadFilep(`${TEMP_DIR}/unk.def`)
  mtrix_def.split('\n').forEach(v=>{
    dictionaryBuilder.putCostMatrixLine(v);
  })
  char_def.split('\n').forEach(v=>{
    dictionaryBuilder.putCharDefLine(v);
  })
  unk_def.split('\n').forEach(v=>{
    dictionaryBuilder.putUnkDefLine(v);
  })
  const csv_names = await fsp.readdir(TEMP_DIR)
  const words = await fsp.readdir(words_dir)

  console.log('-- csv files --')
  const all_csv = [...csv_names,...words]
  const csvs = await Promise.all([
    ...csv_names
    .filter(v=>v.match(/csv$/))
    .map(name=>autoDecodeReadFilep(`${TEMP_DIR}/${name}`)),
    ...words
    .filter(v=>v.match(/csv$/))
    .map(name=>autoDecodeReadFilep(`${words_dir}/${name}`))
  ]);

  csvs.forEach(csv=>{
    csv.split('\n').forEach(v=>{
      dictionaryBuilder.addTokenInfoDictionary(v)
    })
  });

  console.log('----------------')

  const dict = await dictionaryBuilder.build();

  let write_gz_p = async (path,data) => {
    let gzip_data = await gzip(data)
    fsp.writeFile(path,gzip_data)
  }

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR);
  }

  await write_gz_p(`${DIST_DIR}base.dat.gz`,       dict.trie.bc.getBaseBuffer());
  await write_gz_p(`${DIST_DIR}check.dat.gz`,      dict.trie.bc.getCheckBuffer());
  await write_gz_p(`${DIST_DIR}tid.dat.gz`,        dict.token_info_dictionary.dictionary.buffer);
  await write_gz_p(`${DIST_DIR}tid_pos.dat.gz`,    dict.token_info_dictionary.pos_buffer.buffer);
  await write_gz_p(`${DIST_DIR}tid_map.dat.gz`,    dict.token_info_dictionary.targetMapToBuffer());
  await write_gz_p(`${DIST_DIR}cc.dat.gz`,         dict.connection_costs.buffer);
  await write_gz_p(`${DIST_DIR}unk.dat.gz`,        dict.unknown_dictionary.dictionary.buffer);
  await write_gz_p(`${DIST_DIR}unk_pos.dat.gz`,    dict.unknown_dictionary.pos_buffer.buffer);
  await write_gz_p(`${DIST_DIR}unk_map.dat.gz`,    dict.unknown_dictionary.targetMapToBuffer());
  await write_gz_p(`${DIST_DIR}unk_char.dat.gz`,   dict.unknown_dictionary.character_definition.character_category_map);
  await write_gz_p(`${DIST_DIR}unk_compat.dat.gz`, dict.unknown_dictionary.character_definition.compatible_category_map);
  await write_gz_p(`${DIST_DIR}unk_invoke.dat.gz`, dict.unknown_dictionary.character_definition.invoke_definition_map.toBuffer());
  console.log('dist/*.dat.gz created')
  console.log('done')
})();
