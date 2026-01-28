import { useStore } from '@/store';
import { useState, useEffect } from 'preact/hooks';
import { MOOD_TEMPLATES, type MoodTemplate } from '@/constants/moodTemplates';
import { ASSETS_BASE_URL } from '@/constants/meta';

const WEEK_DAYS = [
  { key: 'monday', label: '周一' },
  { key: 'tuesday', label: '周二' },
  { key: 'wednesday', label: '周三' },
  { key: 'thursday', label: '周四' },
  { key: 'friday', label: '周五' },
  { key: 'saturday', label: '周六' },
  { key: 'sunday', label: '周日' },
];

export function WeeklyMoodSettings() {
  const { configManager, showNotification } = useStore();
  const [moodAvatars, setMoodAvatars] = useState<Record<string, string>>({});
  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (configManager) {
      Promise.all(
        WEEK_DAYS.map(day => configManager.getMoodAvatar(day.key))
      ).then((avatars) => {
        const avatarMap: Record<string, string> = {};
        WEEK_DAYS.forEach((day, index) => {
          avatarMap[day.key] = avatars[index] || '';
        });
        setMoodAvatars(avatarMap);
      });
    }
  }, [configManager]);

  const handleUpload = (dayKey: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      if (base64 && configManager) {
        await configManager.saveMoodAvatar(dayKey, base64);
        setMoodAvatars(prev => ({
          ...prev,
          [dayKey]: base64
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const applyTemplate = async (template: MoodTemplate) => {
    if (!configManager) return;
    setApplyingTemplate(template.id);
    let fallbackCount = 0;

    try {
      const promises = WEEK_DAYS.map(async (day) => {
        // 默认 template 都是 英文+ 小写的 jpg 结尾
        const fileExt = template.id === 'default' ? 'svg' : 'jpg';
        const url = `${ASSETS_BASE_URL}${template.path}/${day.key}.${fileExt}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to load ${day.key} from template`);
          }
          return { key: day.key, blob: await response.blob() };
        } catch (error) {
          console.warn(`Failed to load template image for ${day.key}, trying fallback...`, error);
          fallbackCount++;
          // 兜底：请求 public/mood-avatars 不带 template 的模版
          const fallbackUrl = `${ASSETS_BASE_URL}/mood-avatars/${day.key}.svg`;
          const response = await fetch(fallbackUrl);
          if (!response.ok) {
            throw new Error(`Failed to load fallback ${day.key}`);
          }
          return { key: day.key, blob: await response.blob() };
        }
      });

      const results = await Promise.all(promises);

      for (const { key, blob } of results) {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = async (e) => {
            const base64 = e.target?.result as string;
            if (base64) {
              await configManager.saveMoodAvatar(key, base64);
              setMoodAvatars(prev => ({ ...prev, [key]: base64 }));
            }
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      }
      
      if (fallbackCount > 0) {
        showNotification(`已应用模版：${template.name} (部分使用默认图标兜底)`, 'warning');
      } else {
        showNotification(`已应用模版：${template.name}`, 'success');
      }
    } catch (error) {
      console.error('Failed to apply template:', error);
      showNotification('应用模版失败，请检查网络或文件', 'error');
    } finally {
      setApplyingTemplate(null);
    }
  };

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-4 gap-2">
        {WEEK_DAYS.map((day) => (
          <div key={day.key} class="flex flex-col items-center space-y-1">
            <div class="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white group">
              <img
                // fallback 是 public/mood-avatars 目录下的 星期 + svg 结尾
                src={moodAvatars[day.key] || `${ASSETS_BASE_URL}/mood-avatars/${day.key}.svg`}
                alt={day.label}
                class="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = `https://api.dicebear.com/9.x/initials/svg?seed=${day.key}`)}
              />
              <label class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span class="text-white text-xs">更换</span>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) handleUpload(day.key, file);
                  }}
                />
              </label>
            </div>
            <span class="text-xs text-gray-500">{day.label}</span>
          </div>
        ))}

        <button
          onClick={() => setShowTemplates(!showTemplates)}
          class={`flex flex-col items-center space-y-1 group outline-none`}
          title={showTemplates ? "收起模版库" : "展开模版库"}
        >
          <div class={`w-16 h-16 flex items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 ${showTemplates
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 text-gray-400 hover:text-blue-500'
            }`}>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class={`text-xs font-medium transition-colors ${showTemplates ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`}>
            {showTemplates ? '收起模版' : '模版库'}
          </span>
        </button>
      </div>

      {showTemplates && (
        <div class="space-y-2 pt-2 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider">选择模版</h4>
          <div class="grid grid-cols-1 gap-3">
            {MOOD_TEMPLATES.map(template => {
              const isPreviewing = previewTemplateId === template.id;
              return (
                <div 
                  key={template.id} 
                  class={`group flex flex-col p-3 rounded-xl bg-white border transition-all duration-200 cursor-pointer ${
                    isPreviewing 
                      ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-500 hover:ring-1 hover:ring-blue-100 hover:shadow-md'
                  }`}
                  onClick={() => setPreviewTemplateId(isPreviewing ? null : template.id)}
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0 mr-3">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium text-gray-900">{template.name}</span>
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 truncate max-w-[120px]">
                          {template.copyright}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-0.5 truncate">{template.description}</p>
                    </div>
                    
                    <div class="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          applyTemplate(template);
                        }}
                        disabled={applyingTemplate === template.id}
                        class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {applyingTemplate === template.id ? '应用中...' : '使用模版'}
                      </button>
                      <div class="flex items-center text-gray-400 transition-colors group-hover:text-blue-500">
                        <span class={`text-[10px] mr-1 transition-all duration-200 ${
                          isPreviewing 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                        }`}>
                          {isPreviewing ? '收起' : '预览'}
                        </span>
                        <div class={`transition-transform duration-200 ${isPreviewing ? 'rotate-180' : ''}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isPreviewing && (
                    <div class="mt-3 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200 cursor-default" onClick={(e) => e.stopPropagation()}>
                      <div class="flex items-center justify-between mb-2 px-1">
                        <span class="text-[10px] font-medium text-gray-400">预览效果</span>
                        <span class="text-[10px] text-gray-300">共 7 款</span>
                      </div>
                      <div class="grid grid-cols-7 gap-1.5">
                        {WEEK_DAYS.map((day) => {
                          const fileExt = template.id === 'default' ? 'svg' : 'jpg';
                          const previewUrl = `${ASSETS_BASE_URL}${template.path}/${day.key}.${fileExt}`;
                          
                          return (
                            <div key={day.key} class="flex flex-col items-center">
                              <div class="w-full aspect-square rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                                <img
                                  src={previewUrl}
                                  alt={day.label}
                                  class="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    const fallbackUrl = `${ASSETS_BASE_URL}/mood-avatars/${day.key}.svg`;
                                    if (target.src !== fallbackUrl) {
                                      target.src = fallbackUrl;
                                    }
                                  }}
                                />
                              </div>
                              <span class="text-[9px] text-gray-400 mt-1 scale-90">{day.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
