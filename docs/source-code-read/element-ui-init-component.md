# element-ui-init-component

[element-ui 初始化组件](https://github1s.com/ElemeFE/element/blob/dev/build/bin/new.js)

## 初始化过程

- 获取到组件名称，创建组件路径及初始化文件模板
- 将组件的 `/packages/${componentname}/index.js` 添加到 `components.json` 中
- 将组件的 `${componentname}.scss` 添加到 `/packages/theme-chalk/src/index.scss` 中
- 将组件的 `ts` 声明添加到 `/types/element-ui.d.ts` 中
- 创建组件 package
- 将组件添加到 `nav.config.json` 文档配置中

## 源码分析

### 获取到组件名称，创建组件路径及初始化文件模板

```js
console.log();
// 监听进程退出
process.on('exit', () => {
  console.log();
});

if (!process.argv[2]) {
  // 第一个参数必须是组件名，不存在则退出进程
  console.error('[组件名]必填 - Please enter new component name');
  process.exit(1);
}

const path = require('path'); // 内置路劲模块
const fs = require('fs'); // 内置文件系统模块
const fileSave = require('file-save'); // 流式保存文件
const uppercamelcase = require('uppercamelcase'); // 将破折号/点/下划线/空格分隔的字符串转换为驼峰式
const componentname = process.argv[2]; // 组件名称
const chineseName = process.argv[3] || componentname; // 组件的中文名称
const ComponentName = uppercamelcase(componentname); // 转为驼峰式
const PackagePath = path.resolve(__dirname, '../../packages', componentname); // 组件的路径
// 文件模板
const Files = [
  {
    filename: 'index.js',
    content: `import ${ComponentName} from './src/main';

/* istanbul ignore next */
${ComponentName}.install = function(Vue) {
  Vue.component(${ComponentName}.name, ${ComponentName});
};

export default ${ComponentName};`
  },
  {
    filename: 'src/main.vue',
    content: `<template>
  <div class="el-${componentname}"></div>
</template>

<script>
export default {
  name: 'El${ComponentName}'
};
</script>`
  },
  {
    filename: path.join('../../examples/docs/zh-CN', `${componentname}.md`),
    content: `## ${ComponentName} ${chineseName}`
  },
  {
    filename: path.join('../../examples/docs/en-US', `${componentname}.md`),
    content: `## ${ComponentName}`
  },
  {
    filename: path.join('../../examples/docs/es', `${componentname}.md`),
    content: `## ${ComponentName}`
  },
  {
    filename: path.join('../../examples/docs/fr-FR', `${componentname}.md`),
    content: `## ${ComponentName}`
  },
  {
    filename: path.join('../../test/unit/specs', `${componentname}.spec.js`),
    content: `import { createTest, destroyVM } from '../util';
import ${ComponentName} from 'packages/${componentname}';

describe('${ComponentName}', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(${ComponentName}, true);
    expect(vm.$el).to.exist;
  });
});
`
  },
  {
    filename: path.join('../../packages/theme-chalk/src', `${componentname}.scss`),
    content: `@import "mixins/mixins";
@import "common/var";

@include b(${componentname}) {
}`
  },
  {
    filename: path.join('../../types', `${componentname}.d.ts`),
    content: `import { ElementUIComponent } from './component'

/** ${ComponentName} Component */
export declare class El${ComponentName} extends ElementUIComponent {
}`
  }
];
```

### 将 componentname  添加 components.json

```js
// 引入 components.json
const componentsFile = require('../../components.json');
if (componentsFile[componentname]) {
  // 组件已存在，退出进程
  console.error(`${componentname} 已存在.`);
  process.exit(1);
}
// 写入组件的入口文件
componentsFile[componentname] = `./packages/${componentname}/index.js`;
// 保存 components.json
fileSave(path.join(__dirname, '../../components.json'))
  .write(JSON.stringify(componentsFile, null, '  '), 'utf8')
  .end('\n');
```

### 将 componentname.scss 添加到 index.scss

```js
// scss 路径
const sassPath = path.join(__dirname, '../../packages/theme-chalk/src/index.scss');
// 将组件的 scss 拼接到 index.scss 中
const sassImportText = `${fs.readFileSync(sassPath)}@import "./${componentname}.scss";`;
// 保存 index.scss
fileSave(sassPath)
  .write(sassImportText, 'utf8')
  .end('\n');
```

### 将组件的 ts 声明添加到 element-ui.d.ts

```js
// element-ui ts声明文件路径
const elementTsPath = path.join(__dirname, '../../types/element-ui.d.ts');

// 读取 element-ui 的ts声明，拼接上组件的 ts 声明
let elementTsText = `${fs.readFileSync(elementTsPath)}
/** ${ComponentName} Component */
export class ${ComponentName} extends El${ComponentName} {}`;
const index = elementTsText.indexOf('export') - 1;
const importString = `import { El${ComponentName} } from './${componentname}'`;
elementTsText = elementTsText.slice(0, index) + importString + '\n' + elementTsText.slice(index);

// 写入
fileSave(elementTsPath)
  .write(elementTsText, 'utf8')
  .end('\n');
```

### 创建组件package

```js
Files.forEach(file => {
  fileSave(path.join(PackagePath, file.filename))
    .write(file.content, 'utf8')
    .end('\n');
});
```

### 将组件添加到 `nav.config.json` 文档配置中

```js
const navConfigFile = require('../../examples/nav.config.json');

Object.keys(navConfigFile).forEach(lang => {
  let groups = navConfigFile[lang][4].groups;
  groups[groups.length - 1].list.push({
    path: `/${componentname}`,
    title: lang === 'zh-CN' && componentname !== chineseName
      ? `${ComponentName} ${chineseName}`
      : ComponentName
  });
});

fileSave(path.join(__dirname, '../../examples/nav.config.json'))
  .write(JSON.stringify(navConfigFile, null, '  '), 'utf8')
  .end('\n');

console.log('DONE!');
```
