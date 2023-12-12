export const key = "chess_assess_options";

export const storeOptions = (options: Options) => {
  window.localStorage.setItem(key, JSON.stringify(options));
};

export const loadOptions = (): Partial<Options> => {
  const options = JSON.parse(window.localStorage.getItem(key) || "{}");
  return { ...options, showAxisLabels: false };
};

export const restoreOptions = () => {
  window.localStorage.clear();
};
