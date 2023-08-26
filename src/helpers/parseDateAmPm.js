//@flow

const removeAmPm = (time: string): string => {
  return time.replace(/(AM|PM)/i, ':00');
};

const plus12hours = (time: string): string => {
  const [hours, ...minutes] = time.split(':');
  const newTime = hours === '12' ? hours : Number(hours) + 12;
  return [String(newTime), ...minutes].join(':');
};

export const parseDateAmPm = (time: string = ''): string => {
  const [hours, ...minutes] = time.split(':');
  return time.match(/PM/i) ? removeAmPm(plus12hours(time)) : hours === '12' ? removeAmPm(['00', ...minutes].join(':')) : removeAmPm(time);
};
