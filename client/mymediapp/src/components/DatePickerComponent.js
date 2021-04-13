import { useState } from "react";
import DatePicker from "react-datepicker";

export default function DatePickerComponent(props) {
  const [startDate, setStartDate] = useState(
    new Date(props.default.split("-"))
  );
  //   console.log(startDate);
  //datepicker가 엄청 많이 렌더링 되는데 이거 왜이러지...????
  //   console.log(props);
  //   if (props.default) {
  //     let year,
  //       month,
  //       day = props.default.split("-");
  //     setStartDate(new Date(year, month, day));
  //   }
  const curDate = new Date();

  const curYear = curDate.getFullYear();
  const years = range(curYear - 150, curYear + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <DatePicker
      renderCustomHeader={({ date, changeYear, changeMonth }) => (
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => {
              console.log(value);
              changeYear(value);
            }}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      selected={startDate}
      onChange={(date) => {
        console.log(props); // field
        console.log(props.form.values); // field data
        setStartDate(date);
        const year = date.getFullYear();
        let month = date.getMonth() + 1 + "";
        if (month.length === 1) {
          month = "0" + month;
        }
        let day = date.getDate() + "";
        if (day.length === 1) {
          day = "0" + day;
        }
        console.log(year + "-" + month + "-" + day);
        date = year + "-" + month + "-" + day;
        if (props.index === undefined) {
          props.form.setValues({ ...props.form.values, date: date });
        } else {
          const ind = props.index;
          props.form.setValues((prev) => ({
            ...prev,
            family_info: prev.family_info.map((member, id) => {
              if (id === ind) {
                return { ...member, birth: date };
              }
              return member;
            }),
          }));
        }
      }}
    />
  );
}

const range = (start, stop, step) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
