// import moment from "moment-timezone";

// type Schedule = {
//   [key: string]: string[];
// };

// export function convertSchedule(
//   schedule: Schedule,
//   timezone: string
// ): string[] {
//   const result: string[] = [];
//   const today = moment().tz(timezone);

//   Object.entries(schedule).forEach(([day, times]) => {
//     times.forEach((time) => {
//       const localDateTime = today.clone().day(day).format("YYYY-MM-DD");
//       const localTime = moment.tz(
//         `${localDateTime} ${time}`,
//         "YYYY-MM-DD HH:mm",
//         timezone
//       );

//       if (!localTime.isValid()) {
//         throw new Error(`Invalid date/time format for ${day} ${time}`);
//       }

//       result.push(localTime.utc().toISOString());
//     });
//   });

//   return result;
// }
