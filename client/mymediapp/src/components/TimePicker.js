import { Box, Stack, Text } from "@chakra-ui/layout";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import { Select } from "@chakra-ui/select";
import { useState } from "react";

export const TimePicker = (props) => {
  let defaultMeridiem, defaultHour, defaultMinute;
  if (props.defaultTime) {
    defaultHour = Number(props.defaultTime.split(":")[0]);
    defaultMinute = Number(props.defaultTime.split(":")[1]);

    if (defaultHour >= 12) {
      defaultMeridiem = 12;
      defaultHour -= 12;
    } else {
      defaultMeridiem = 0;
    }
  }
  const [inputTime, setInputTime] = useState({
    meridiem: defaultMeridiem,
    hour: defaultHour,
    minute: defaultHour,
  });

  return (
    <Stack direction="row">
      <Select
        defaultValue={defaultMeridiem}
        size="sm"
        maxWidth="120px"
        placeholder={props.text.form.time.placeHolder}
        onChange={(e) => {
          let time;
          let formatHour;
          let formatMinute;
          if (inputTime.hour) {
            formatHour = Number(inputTime.hour) + Number(e.target.value);

            if (formatHour < 10) {
              formatHour = formatHour + "";
              formatHour = "0" + formatHour;
            }
            if (inputTime.minute) {
              if (inputTime.minute < 10) {
                formatMinute = inputTime.minute + "";
                formatMinute = "0" + formatMinute;
              }
            } else {
              formatMinute = "00";
            }
            time = formatHour + ":" + formatMinute + ":00";
            props.form.setValues({ ...props.form.values, time: time });
          }

          setInputTime({ ...inputTime, meridiem: e.target.value });
        }}
      >
        <option value={0}>{props.text.form.time.am}</option>
        <option value={12}>{props.text.form.time.pm}</option>
      </Select>
      <Box maxWidth="80px">
        <NumberInput
          defaultValue={defaultHour}
          size="sm"
          min={0}
          max={11}
          clampValueOnBlur={false}
          precision={0}
          onChange={(e) => {
            let time;
            let formatHour;
            let formatMinute;
            if (inputTime.meridiem !== undefined) {
              formatHour = Number(e) + Number(inputTime.meridiem);

              if (formatHour < 10) {
                formatHour = formatHour + "";
                formatHour = "0" + formatHour;
              }
              if (inputTime.minute !== undefined) {
                formatMinute = inputTime.minute + "";
                if (inputTime.minute < 10) {
                  formatMinute = "0" + formatMinute;
                }
              } else {
                formatMinute = "00";
              }

              time = formatHour + ":" + formatMinute + ":00";
              props.form.setValues({ ...props.form.values, time: time });
            }

            setInputTime({ ...inputTime, hour: e });
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper size="sm" />
            <NumberDecrementStepper size="sm" />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Text p="3px">:</Text>
      <Box maxWidth="80px">
        <NumberInput
          defaultValue={defaultMinute}
          clampValueOnBlur={false}
          precision={0}
          size="sm"
          min={0}
          max={59}
          onChange={(e) => {
            let time;
            let formatHour;
            let formatMinute;
            if (
              inputTime.meridiem !== undefined &&
              inputTime.hour !== undefined
            ) {
              formatHour = Number(inputTime.hour) + Number(inputTime.meridiem);

              if (formatHour < 10) {
                formatHour = formatHour + "";
                formatHour = "0" + formatHour;
              } else {
                formatHour = formatHour + "";
              }
              if (e < 10) {
                formatMinute = "0" + e;
              } else {
                formatMinute = e;
              }
              time = formatHour + ":" + formatMinute + ":00";
              props.form.setValues({ ...props.form.values, time: time });
            }
            setInputTime({ ...inputTime, minute: e });
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
    </Stack>
  );
};
