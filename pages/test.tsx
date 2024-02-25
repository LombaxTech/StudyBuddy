import { DatePicker, DateRangePicker, LineChart } from "@tremor/react";
import { useState } from "react";

export default function Test() {
  const [val, setVal] = useState<any>(null);

  const logStuff = () => {
    console.log(`val`);
    console.log(val);
  };

  return (
    <div className="">
      <h1>hello</h1>
      <button className="btn" onClick={logStuff}>
        Log stuff
      </button>
      {/* <DatePicker
        className="mx-auto max-w-sm"
        /> */}
      <DateRangePicker
        enableSelect={false}
        value={val}
        onValueChange={setVal}
      />
    </div>
  );
}

// const chartdata = [
//   {
//     date: "Jan 22",
//     SemiAnalysis: 2890,
//     "The Pragmatic Engineer": 2338,
//   },
//   {
//     date: "Feb 22",
//     SemiAnalysis: 2756,
//     "The Pragmatic Engineer": 2103,
//   },
//   {
//     date: "Mar 22",
//     SemiAnalysis: 3322,
//     "The Pragmatic Engineer": 2194,
//   },
//   {
//     date: "Apr 22",
//     SemiAnalysis: 3470,
//     "The Pragmatic Engineer": 2108,
//   },
//   {
//     date: "May 22",
//     SemiAnalysis: 3475,
//     "The Pragmatic Engineer": 1812,
//   },
//   {
//     date: "Jun 22",
//     SemiAnalysis: 3129,
//     "The Pragmatic Engineer": 1726,
//   },
//   {
//     date: "Jul 22",
//     SemiAnalysis: 3490,
//     "The Pragmatic Engineer": 1982,
//   },
//   {
//     date: "Aug 22",
//     SemiAnalysis: 2903,
//     "The Pragmatic Engineer": 2012,
//   },
//   {
//     date: "Sep 22",
//     SemiAnalysis: 2643,
//     "The Pragmatic Engineer": 2342,
//   },
//   {
//     date: "Oct 22",
//     SemiAnalysis: 2837,
//     "The Pragmatic Engineer": 2473,
//   },
//   {
//     date: "Nov 22",
//     SemiAnalysis: 2954,
//     "The Pragmatic Engineer": 3848,
//   },
//   {
//     date: "Dec 22",
//     SemiAnalysis: 3239,
//     "The Pragmatic Engineer": 3736,
//   },
// ];

// const dataFormatter = (number) =>
//   // `$${Intl.NumberFormat("us").format(number).toString()}`;
//   `${number} min`;

// export default function Test() {
//   return (
//     <LineChart
//       className="h-80"
//       data={chartdata}
//       index="date"
//       categories={["SemiAnalysis", "The Pragmatic Engineer"]}
//       colors={["indigo", "rose"]}
//       valueFormatter={(n) => `${n} min`}
//       yAxisWidth={60}
//       onValueChange={(v) => console.log(v)}
//     />
//   );
// }
