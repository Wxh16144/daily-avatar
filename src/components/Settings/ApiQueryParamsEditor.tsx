
import { useStore } from '@/store';
import { useState } from 'preact/hooks';
import { API_QUERY_VARIABLES } from '@/constants/variables';

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
      <div class="mt-2 p-2 rounded border border-gray-100 bg-gray-50">
        <div class="text-xs font-medium text-gray-500 mb-2">
          可用变量说明 <span class="text-[10px] font-normal text-gray-400 ml-1">(须以 $ 开头)</span>
        </div>
        <div class="text-xs space-y-1">
          {Object.entries(API_QUERY_VARIABLES).map(([key, desc]) => (
            <div key={key} class="flex justify-between items-center">
              <code class="bg-gray-200 text-gray-600 px-1 rounded">{key}</code>
              <span class="text-gray-400 text-right">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}