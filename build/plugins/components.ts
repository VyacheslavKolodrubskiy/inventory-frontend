/**
 * On-demand components auto importing for Vue
 * https://github.com/antfu/unplugin-vue-components
 */
import Components from 'unplugin-vue-components/vite';

export function configComponentsPlugin() {
  return Components({
    resolvers: [
      (componentName) => {
        if (componentName.match(/(Outlined|Filled|TwoTone)$/)) {
          return {
            name: componentName,
            from: '@ant-design/icons-vue',
          };
        }
      },
    ],
    dts: true,
  });
}
