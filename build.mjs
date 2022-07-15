console.time("leetcode");
const leetcodeDir = await fs.readdirSync('./leetcode');
const mdPath = './src/learn/leetcode题解.md';
const writeStream = await fs.createWriteStream(mdPath);
const origin = await fs.readFileSync('./leetcode.md').toString();
writeStream.write(origin);
leetcodeDir.filter((v) => /s$/.test(v)).sort((a, b) => a.split(".")[0] - b.split(".")[0]).forEach((v) => {
  const data = fs.readFileSync(path.join("./leetcode", v)).toString()
  const name = v.split(".")
  writeStream.write('\n## ' + `${name[0]}.${name[1]}` + `\n\`\`\`${name[2]}\n` + data + '\n```\n\n')
})
writeStream.end()

writeStream.on('finish', () => {
  console.timeEnd("leetcode")
})
