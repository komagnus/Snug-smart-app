export interface ScheduleSetting {
    id: number;
    enable: boolean;
    timespec: string;
    calls: { method: string, params: { id: number, on: boolean } }[];
}

export function createSchedule(electricityPrices: number[], 
    //temperatures: number[], 
    thresholdPrice: number, 
    //thresholdTemperature: number
    ): ScheduleSetting[] {
    const schedule: ScheduleSetting[] = [];
    let off = false
    for (let i = 0; i < 24; i++) {
        if (electricityPrices[i] > thresholdPrice) {
            if(off === true) {
                continue
            } else {
                off = true
                const scheduleSetting: ScheduleSetting = {
                    id: i + 1,
                    enable: true,
                    timespec: `0 0 ${i} * * *`,  
                    calls: [{
                        method: "Switch.Set",
                        params: {
                            id: 0,
                            on: false
                        }
                    }]
                };
                schedule.push(scheduleSetting);
            }
        } else {
            if(off === true) {
                off = false
                const scheduleSetting: ScheduleSetting = {
                    id: i + 1,
                    enable: true,
                    timespec: `0 0 ${i} * * *`,  
                    calls: [{
                        method: "Switch.Set",
                        params: {
                            id: 0,
                            on: true
                        }
                    }]
                };
                schedule.push(scheduleSetting); 
            }
        }
    }
    return schedule;
}
