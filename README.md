# shencom-behavior

### Compiles and minifies for production

```
yarn build
```

### Use case

```ts
import { Behavior, BehaviorOption } from '@shencom-behavior';

const config: BehaviorOption = {
  el: this.$refs.dom,
  height: 150,
  width: 300,
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
