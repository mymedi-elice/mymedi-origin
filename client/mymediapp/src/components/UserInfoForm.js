import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  RadioGroup,
  Stack,
  Radio,
  Center,
  FormHelperText,
  CheckboxGroup,
  HStack,
  Checkbox,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

import { Form, Formik, Field, FieldArray } from "formik";
import React, { useState, HTMLAttributes, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import * as Yup from "yup";

export default function UserInfoFrom() {
  const vaccines = [
    "인플루엔자",
    "파상풍",
    "간염",
    "코로나 1차",
    "코로나 2차",
    "폐렴구균",
  ];
  const schema = Yup.object().shape({
    name: Yup.string().required("이름을 입력해주세요."),
    gender: Yup.string(),
    birth: Yup.date(),
    vaccine: Yup.array().of(Yup.string()),
    family_info: Yup.array().of(
      Yup.object({
        name: Yup.string().required("이름을 입력해주세요."),
        gender: Yup.string(),
        birth: Yup.date(),
        vaccine: Yup.array().of(Yup.string()),
      })
    ),
  });

  return (
    <Center>
      <Box maxWidth="2xl" alignItems="center">
        <Formik
          initialValues={{
            name: "",
            gender: "",
            birth: "",
            vaccine: [],
            family_info: [{ name: "", gender: "", birth: "", vaccine: [] }],
          }}
          // 사용자 정보로 다시 초기화 만들어줘야 한다.
          // validationSchema={schema}
          // 사용자 정보로 initial value 넣어주기
          onSubmit={(values, actions) => {
            console.log(values);
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {(props) => (
            <Form>
              <InfoForm vaccines={vaccines}></InfoForm>
              <FormLabel mt="5">가족 정보</FormLabel>
              {/* <FieldArray
                name="family_info"
                render={(arrayHelpers) => {
                  const family_info = props.family_info;
                  family_info.push({
                    name: "",
                    gender: "",
                    birth: "",
                    vaccine: [],
                  });
                  console.log(props);
                  return (
                    <>
                      {family_info.map((member, ind) => {
                        return (
                          <div>
                            <FamilyForm
                              member={member}
                              index={ind}
                              vaccines={vaccines}
                            ></FamilyForm>
                            <Button
                              onClick={() => {
                                arrayHelpers.remove(ind);
                              }}
                            >
                              <MinusIcon size="xs"></MinusIcon>
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="teal"
                              variant="outline"
                              onClick={() => {
                                arrayHelpers.push({
                                  name: "",
                                  gender: "",
                                  birth: "",
                                  vaccine: [],
                                });
                              }}
                            >
                              <AddIcon></AddIcon>
                              추가
                            </Button>
                          </div>
                        );
                      })}
                    </>
                  );
                }}
              ></FieldArray> */}
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                회원 정보 저장
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Center>
  );
}
function InfoForm(props) {
  const validateName = (value) => {
    let error;
    if (!value) {
      error = "이름을 입력해주세요";
    }
    return error;
  };

  const validateGender = (value) => {
    //제출한 순간에만 입력되어 있으면 됨!
  };

  const validateBirth = (value) => {
    //입력한 날짜가 유효한 날짜인지 확인
  };
  const vaccines = props.vaccines;

  return (
    <>
      <Field name="name" validate={validateName}>
        {({ field, form }) => (
          <FormControl isInvalid={form.errors.name && form.touched.name}>
            {/* form.touched.name의 역할을 알아야 할 것 같다 */}
            <FormLabel htmlFor="name">* 이름</FormLabel>
            <Input {...field} maxWidth="2xs" id="name" placeholder="이름" />
            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <Field name="gender" validate={validateGender}>
        {({ field, form }) => (
          <RadioGroup name="gender">
            <FormLabel mt="5">성별</FormLabel>
            <Stack spacing={5} direction="row">
              {/* <FormLabel mt="2.5">성별</FormLabel> */}
              <Radio {...field} value="female" ml="8">
                여성
              </Radio>
              <Radio {...field} value="male">
                남성
              </Radio>
            </Stack>
          </RadioGroup>
        )}
      </Field>
      <Field name="birth" validate={validateBirth} maxWidth="2xs">
        {({ field, form }) => (
          <FormControl>
            <FormLabel htmlFor="birth" mt="5">
              생년월일
            </FormLabel>
            <Box maxWidth="2xs">
              <DatePickerComponent birth={form}></DatePickerComponent>
            </Box>
          </FormControl>
        )}
      </Field>
      <Field name="vaccine">
        {({ field, form }) => (
          <FormControl>
            <CheckboxGroup>
              <FormLabel htmlFor="vaccine" mt="5">
                예방 접종 내역
              </FormLabel>
              <Wrap maxWidth="2xs">
                {vaccines.map((vaccine, ind) => {
                  return (
                    <WrapItem key={ind}>
                      <Checkbox {...field} value={vaccine}>
                        {vaccine}
                      </Checkbox>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </CheckboxGroup>
            <FormHelperText>
              예방접종 이력이 있는 질병을 선택해주세요(?)
            </FormHelperText>
          </FormControl>
        )}
      </Field>
    </>
  );
}

function FamilyForm(props) {
  const index = props.index;
  const member = props.member;
  const vaccines = props.vaccines;

  const validateName = (value) => {
    let error;
    if (!value) {
      error = "이름을 입력해주세요";
    }
    return error;
  };

  const validateGender = (value) => {
    //제출한 순간에만 입력되어 있으면 됨!
  };

  const validateBirth = (value) => {
    //입력한 날짜가 유효한 날짜인지 확인
  };

  return (
    <Box>
      <Field name={`family_info.${index}.name`} validate={validateName}>
        {({ field, form }) => (
          <FormControl isInvalid={form.errors.name && form.touched.name}>
            {/* form.touched.name의 역할을 알아야 할 것 같다 */}
            <FormLabel htmlFor="name">* 이름</FormLabel>
            <Input {...field} maxWidth="2xs" id="name" placeholder="이름" />
            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <Field name={`family_info.${index}.gender`} validate={validateGender}>
        {({ field, form }) => (
          <RadioGroup name="gender">
            <FormLabel mt="5">성별</FormLabel>
            <Stack spacing={5} direction="row">
              <Radio {...field} value="female" ml="8">
                여성
              </Radio>
              <Radio {...field} value="male">
                남성
              </Radio>
            </Stack>
          </RadioGroup>
        )}
      </Field>
      <Field
        name={`family_info.${index}.birth`}
        validate={validateBirth}
        maxWidth="2xs"
      >
        {({ field, form }) => (
          <FormControl>
            <FormLabel htmlFor="birth" mt="5">
              생년월일
            </FormLabel>
            <Box maxWidth="2xs">
              <DatePickerComponent birth={form}></DatePickerComponent>
            </Box>
          </FormControl>
        )}
      </Field>
      <Field name={`family_info.${index}.birth`}>
        {({ field, form }) => (
          <FormControl>
            <CheckboxGroup>
              <FormLabel htmlFor="vaccine" mt="5">
                예방 접종 내역
              </FormLabel>
              <Wrap maxWidth="2xs">
                {vaccines.map((vaccine, ind) => {
                  return (
                    <WrapItem key={ind}>
                      <Checkbox {...field} value={vaccine}>
                        {vaccine}
                      </Checkbox>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </CheckboxGroup>
            <FormHelperText>
              예방접종 이력이 있는 질병을 선택해주세요(?)
            </FormHelperText>
          </FormControl>
        )}
      </Field>
    </Box>
  );
}

const range = (start, stop, step) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const DatePickerComponent = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const curDate = new Date();
  useEffect(() => {
    props.birth.setValues({ ...props.birth.values, birth: curDate });
  }, []);
  const curYear = 1900 + curDate.getYear();
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
            value={date.getYear() + 1900}
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
        setStartDate(date);
        props.birth.setValues({ ...props.birth.values, birth: date });
      }}
    />
  );
};
