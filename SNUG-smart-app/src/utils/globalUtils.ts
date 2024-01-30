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
export const currentTimeUTCOption1: String = getCurrentUTCTimeRounded().toISOString().slice(0, 14) + '00:00Z'
export const currentTimeUTCOption2: string = formatUTCDate(getCurrentUTCTimeRounded()).replace(/\.\d{3}/, '');

export const temperature = ref<Number>(20);

