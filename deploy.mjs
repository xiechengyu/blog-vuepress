// await $`set -e`

await $`rm -rf leetcode`

await $`git clone git@github.com:xiechengyu/leetcode.git`

await $`zx build.mjs`

await $`npm run build`

await cd('dist')

await $`git init`

await $`git add -A`

await $`git commit -m 'deploy'`

await $`git push -f git@github.com:xiechengyu/xiechengyu.github.io.git master`

await cd('../')

await $`git pull`

await $`git add .`

await $`git commit -m 'update'`

await $`git push origin main`