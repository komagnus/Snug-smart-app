import { ref } from "vue";
function getCurrentUTCTimeRounded(): Date {
    const currentTime = new Date(Date.now());
    currentTime.setUTCMinutes(0);
    currentTime.setUTCSeconds(0);
    currentTime.setUTCMilliseconds(0);
    return currentTime;
}
function padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
}
function formatUTCDate(date: Date): string {
    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = Math.abs(offsetMinutes / 60);
    const offsetSign = offsetMinutes < 0 ? '+' : '-';
    const offsetFormatted = `${offsetSign}${padZero(offsetHours)}:00`;
  
    return date.toISOString().replace('Z', offsetFormatted);
}
function getTomorrowUTCRounded(): Date {
  const tomorrow = new Date();
  tomorrow.setUTCHours(0);
  tomorrow.setUTCMinutes(0);
  tomorrow.setUTCSeconds(0);
  tomorrow.setUTCMilliseconds(0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}
export const currentTimeUTCOption1: String = getCurrentUTCTimeRounded().toISOString().slice(0, 14) + '00:00Z'
export const currentTimeUTCOption2: string = formatUTCDate(getCurrentUTCTimeRounded()).replace(/\.\d{3}/, '');
export const tomorrowUTCTime: string = formatUTCDate(getTomorrowUTCRounded()).replace(/\.\d{3}/, '');

export const tomorrowDate: Date = getCurrentUTCTimeRounded();
export const temperature = ref<Number>(20);

