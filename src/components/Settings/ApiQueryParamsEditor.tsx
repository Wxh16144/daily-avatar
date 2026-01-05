
import { useStore } from '@/store';
import { useState } from 'preact/hooks';

const API_QUERY_VARIABLES = [
  { var: '$TIMESTAMP', desc: '当前时间戳' },
  { var: '$VERSION', desc: '当前版本' },
  { var: '$RANDOM', desc: '随机数，每次请求都会变化' },
];

export function ApiQueryParamsEditor() {
  const { config, updateConfig } = useStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const params = config.apiQueryParams || [];

  const handleChange = (idx: number, key: string, value: string) => {
    const newParams = params.map((item, i) =>
      i === idx ? { key, value } : item
    );
    updateConfig('apiQueryParams', newParams);
  };

  const handleAdd = () => {
    updateConfig('apiQueryParams', [...params, { key: '', value: '' }]);
    setEditingIndex(params.length);
  };

  const handleRemove = (idx: number) => {
    const newParams = params.filter((_, i) => i !== idx);
    updateConfig('apiQueryParams', newParams);
  };

  return (
    <div class="space-y-2">
      {params.map((item, idx) => (
        <div key={idx} class="flex items-center space-x-2">
          <input
            type="text"
            class="w-1/3 px-2 py-1 border border-gray-200 rounded text-xs"
            placeholder="KEY"
            value={item.key}
            onChange={e => handleChange(idx, e.currentTarget.value, item.value)}
          />
          <span class="text-gray-400">=</span>
          <input
            type="text"
            class="w-1/2 px-2 py-1 border border-gray-200 rounded text-xs"
            placeholder="VALUE（可用 $DATE 等变量）"
            value={item.value}
            onChange={e => handleChange(idx, item.key, e.currentTarget.value)}
          />
          <button
            type="button"
            class="text-xs text-red-400 hover:text-red-600 px-1"
            onClick={() => handleRemove(idx)}
            title="删除"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        class="text-xs text-blue-500 hover:underline mt-1"
        onClick={handleAdd}
      >
        + 添加参数
      </button>
      <div class="mt-2 p-2 rounded border border-blue-200 bg-blue-50/80">
        <div class="text-xs font-bold mb-1">可用变量说明</div>
        <div class="text-xs space-y-1">
          {API_QUERY_VARIABLES.map(v => (
            <div key={v.var} class="flex justify-between items-center">
              <code class="bg-indigo-100 text-indigo-800 px-1 rounded font-semibold">{v.var}</code>
              <span class="text-gray-600 text-right">{v.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}