/**
 * Package file volume analysis
 * https://github.com/btd/rollup-plugin-visualizer
 */
import visualizer from 'rollup-plugin-visualizer';
import { isReportMode } from '../utils';

export function configVisualizerPlugin() {
  if (!isReportMode())
    return null;

  return visualizer({
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true,
    gzipSize: true,
    // brotliSize: true,
  });
}
