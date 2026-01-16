import type { Config } from '@/types/config';
import { APP_META } from '@/constants/meta';
import { API_QUERY_VARIABLES } from '@/constants/variables';

/**
 * 配置解析器
 * 用于基于当前配置计算衍生值，处理变量替换等逻辑
 */
export class ConfigResolver {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  protected get variables(): Record<string, string> {
    const now = new Date();
    const padZero = (num: number, length: number = 2) => num.toString().padStart(length, '0');

    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1);
    const day = padZero(now.getDate());

    const dynamicValues: typeof API_QUERY_VARIABLES = {
      '$TIMESTAMP': now.getTime().toString(),
      '$DATE': `${year}-${month}-${day}`,
      '$VERSION': APP_META.version,
      '$RANDOM': Math.random().toString(),
    };

    const result: Record<string, string> = {};
    Object.entries(API_QUERY_VARIABLES).forEach(([key]) => {
      result[key] = dynamicValues[key as keyof typeof dynamicValues] || '';
    });

    return result;
  }

  private replaceVariables(value: string): string {
    let result = value;
    Object.entries(this.variables).forEach(([key, val]) => {
      // 使用 replaceAll 替换所有出现的变量
      result = result.split(key).join(val);
    });
    return result;
  }

  /**
   * 获取解析后的 API URL
   * 会自动处理：
   * 1. 拼接 apiQueryParams
   * 2. 替换变量 ($TIMESTAMP, $DATE, $VERSION)
   */
  public getFinalApiUrl(): string {
    if (this.config.avatarSource !== 'api' || !this.config.apiUrl) {
      return '';
    }

    try {
      // 处理相对路径或不完整的 URL，虽然通常 apiUrl 应该是完整的
      const urlStr = this.config.apiUrl.startsWith('http')
        ? this.config.apiUrl
        : `https://${this.config.apiUrl}`;

      const url = new URL(urlStr);
      const params = this.config.apiQueryParams || [];


      // 追加参数
      params.forEach(({ key, value }) => {
        if (key) {
          url.searchParams.append(key, this.replaceVariables(value));
        }
      });

      return url.toString();
    } catch (e) {
      console.error('Invalid API URL:', this.config.apiUrl, e);
      return this.config.apiUrl;
    }
  }
}
