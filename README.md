# shencom-behavior

### Compiles and minifies for production

```
yarn build
```

### Use case

```ts
import { Behavior, BehaviorOption } from '@shencom-behavior';

/**
 *  type 为’light‘ 则为点选校验 text必传
 *  type 为 ‘puzzle’ 则为拼图校验 无需传text
 */

const config: BehaviorOption = {
  el: this.$refs.dom,
  height: 150,
  width: 300,
  type: 'light',
  text: '点选校验',
  onSuccess: () => {
    console.log('Success');
  },
  onFail: () => {
    console.log('Fail');
  },
  onRefresh: () => {
    console.log('Refresh');
  },
};
const behavior = new Behavior(config);
behavior.init();
```
