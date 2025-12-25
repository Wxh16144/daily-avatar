
declare global {
  // 油猴脚本的GM_* API 声明
  var GM_getValue: <T>(key: string, defaultValue?: T) => T;
  var GM_setValue: (key: string, value: any) => void;
  var GM_deleteValue: (key: string) => void;
  var GM_listValues: () => string[];

}

export { };