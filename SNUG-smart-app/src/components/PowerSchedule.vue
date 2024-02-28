<template>
    <v-dialog backgroundColor="white" width="80%" persistent v-model="dialogVisible">
    <v-card style="display: flex; align-items: center; width: 100%; height: 50vh;">
    <v-col @click="dialogVisible = false" style="align-self: flex-end; cursor: pointer;">
        <v-icon size="large" >
          mdi-close
        </v-icon>
    </v-col>
      <v-row style="margin-top: 5%; font-size: large;">Create schedule</v-row>
      <v-row>
        <v-btn @click="generateSchedule">Create</v-btn>
      </v-row>
      <v-row v-if="displaySchedule">
        <v-col>
          <v-card v-for="(setting, index) in schedule" :key="index" style="margin-top: 10px;">
            <v-card-text>
              <div>ID: {{ setting.id }}</div>
              <div>Enabled: {{ setting.enable }}</div>
              <div>Time Specification: {{ setting.timespec }}</div>
              <div style="font-weight: bold;">
                Calls:
                <ul style="font-weight: normal;">
                  <div v-for="(call, callIndex) in setting.calls" :key="callIndex">
                    Method: {{ call.method }}
                    <ul>
                      <div>Params:</div>
                      <li style="margin-left: 20px;" v-for="(paramValue, paramName) in call.params" :key="paramName">
                        {{ paramName }}: {{ paramValue }}
                      </li>
                    </ul>
                  </div>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ScheduleSetting, createSchedule } from '@/utils/algorithm';
  import { ref, defineProps, defineEmits, watch } from 'vue';
  import { getCurrentPowerPrice, getWeatherForecastByArea, PowerPriceSeries } from '@/utils/APIRequests'
import { currentTimeUTCOption2, tomorrowUTCTime } from '@/utils/globalUtils'
import { useAppStore } from '@/store/app';
import { useLimitStore } from '@/store/valuestore';
  const dialogVisible = ref(false)
  const props = defineProps({
    dialogVisibleProp: Boolean 
  });
  const emit = defineEmits();
  const limits = useLimitStore();
  const priceLimit = limits.PriceLimit;
  const thresholdPrice= priceLimit / 100;  
  const thresholdTemperature: number = 10;  
  const schedule = ref<ScheduleSetting[]>([])
  const displaySchedule = ref(false)
  const user = useAppStore().User
  async function generateSchedule() {
    try{
      const currentTimeInISOFormat = currentTimeUTCOption2;
      const [datePart, timePart] = currentTimeInISOFormat.split('T');
      const tomorrow = tomorrowUTCTime
      const [tomorrowDatePart, tomorrowTimePart] = tomorrow.split('T');
      const currentTime = new Date(Date.parse(currentTimeInISOFormat));
      currentTime.setHours(currentTime.getHours() + 1);
      const hours = currentTime.getHours();
      const priceArea = 'NO1';
      const powerPriceValues: number[] = [];
      if(hours >= 13) {
        const [year, month, day] = tomorrowDatePart.split('-');
        const powerData = await getCurrentPowerPrice(year, month, day, priceArea);
        powerData.forEach(entry => {
          powerPriceValues.push(entry.NOK_per_kWh);
        });
      /*const lat = user.ClientLocation.Lat;
      const lon = user.ClientLocation.Lng;
      const weatherData = await getWeatherForecastByArea(lat, lon);
      const temperaTureData = weatherData.properties.timeseries
      const temperatures: number[] = [];
      for (let i = 0; i < 24 && i < temperaTureData.length; i++) {
        temperatures.push(temperaTureData[i].data.instant.details.air_temperature);
      }*/
      const getSchedule: ScheduleSetting[] = createSchedule(powerPriceValues, /*temperatures, */thresholdPrice, /*thresholdTemperature*/);
      schedule.value = getSchedule
      displaySchedule.value = true
    } else {
      const [year, month, day] = datePart.split('-');
      const powerData = await getCurrentPowerPrice(year, month, day, priceArea);
      powerData.forEach(entry => {
          powerPriceValues.push(entry.NOK_per_kWh);
      });
    /*const lat = user.ClientLocation.Lat;
    const lon = user.ClientLocation.Lng;
    const weatherData = await getWeatherForecastByArea(lat, lon);
    const temperaTureData = weatherData.properties.timeseries
    const temperatures: number[] = [];
    for (let i = 0; i < 24 && i < temperaTureData.length; i++) {
    temperatures.push(temperaTureData[i].data.instant.details.air_temperature);
    }*/
      const getSchedule: ScheduleSetting[] = createSchedule(powerPriceValues, /*temperatures, */thresholdPrice, /*thresholdTemperature*/);
      schedule.value = getSchedule
      displaySchedule.value = true
    }
    } catch (e) {
        console.log(e)
    }
    
  }
  watch(() => props.dialogVisibleProp, (newValue) => {
  dialogVisible.value = newValue;
});
  </script>
  