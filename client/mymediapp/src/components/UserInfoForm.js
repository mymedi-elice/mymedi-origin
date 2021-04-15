import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
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
  Checkbox,
  Wrap,
  WrapItem,
  Text,
  Spacer,
} from "@chakra-ui/react";

import { Form, Formik, Field, FieldArray } from "formik";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import * as Yup from "yup";

export default function UserInfoFrom(props) {
  const vaccines = props.vaccines;
  const handleSave = (data) => {
    props.handleSave(data);
  };

  const schema = Yup.object().shape({
    name: Yup.string().required("이름을 입력해주세요."),
    gender: Yup.string().required("성별을 선택해주세요"),
    birth: Yup.string().required("생일을 선택해주세요."),
    vaccine: Yup.array().of(Yup.string()),
    family_info: Yup.array().of(
      Yup.object({
        name: Yup.string().required("이름을 입력해주세요."),
        gender: Yup.string().required("성별을 선택해주세요."),
        birth: Yup.string().required("생일을 선택해주세요."),
        vaccine: Yup.array().of(Yup.string()),
      })
    ),
  });
  // 작동을 안해...차후 validation에 사용

  return (
    <Center>
      <Box
        className="container"
        boxShadow="base"
        maxWidth="500px"
        alignItems="center"
        margin="50"
        padding="50"
      >
        <Formik
          initialValues={{
            name: "",
            gender: "",
            birth: "",
            vaccine: [],
            family_info: [],
          }}
          // 사용자 정보로 다시 초기화 만들어줘야 한다.
          validationSchema={schema}
          // 사용자 정보로 initial value 넣어주기
          onSubmit={(values, actions) => {
            console.log(values);
            //사용자 정보가 있는지 없는지 확인하기
            //(사용자 정보 저장)
            handleSave(values);
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {(props) => (
            <Form>
              <InfoForm vaccines={vaccines}></InfoForm>
              <FormLabel mt="10">가족 정보</FormLabel>
              <FieldArray
                name="family_info"
                render={(arrayHelpers) => {
                  const family_info = arrayHelpers.form.values.family_info;
                  return (
                    <>
                      {family_info.map((member, ind) => {
                        return (
                          <Box
                            key={ind}
                            borderWidth="1px"
                            pl="5"
                            pr="5"
                            pb="5"
                            borderRadius="lg"
                          >
                            <Flex>
                              <Spacer />
                              <Button
                                size="xs"
                                colorScheme="teal"
                                variant="outline"
                                mt="5"
                                onClick={() => {
                                  if (family_info) {
                                    arrayHelpers.pop();
                                  }
                                }}
                              >
                                <CloseIcon boxSize={2}></CloseIcon>
                              </Button>
                            </Flex>
                            <FamilyForm
                              member={member}
                              index={ind}
                              vaccines={vaccines}
                            ></FamilyForm>
                          </Box>
                        );
                      })}
                      <Center>
                        <Button
                          size="xs"
                          colorScheme="teal"
                          variant="outline"
                          mt="3"
                          onClick={() => {
                            if (
                              family_info.length > 0 &&
                              family_info[family_info.length - 1].name
                            ) {
                              arrayHelpers.push({
                                name: "",
                                gender: "",
                                birth: "",
                                vaccine: [],
                              });
                            } else if (family_info.length === 0) {
                              arrayHelpers.push({
                                name: "",
                                gender: "",
                                birth: "",
                                vaccine: [],
                              });
                            } else {
                              //TODO : 에러메세지 띄워주기
                            }
                          }}
                        >
                          <AddIcon boxSize={2} />
                          추가
                        </Button>
                      </Center>
                    </>
                  );
                }}
              ></FieldArray>
              <Center>
                <Button
                  mt={6}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  회원 정보 저장
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Box>
    </Center>
  );
}
function InfoForm(props) {
  const vaccines = props.vaccines;

  return (
    <>
      <Field name="name">
        {({ field, form }) => {
          return (
            <FormControl isInvalid={form.errors.name && form.touched.name}>
              <FormLabel htmlFor="name">* 이름</FormLabel>
              <Input
                {...field}
                size="sm"
                maxWidth="md"
                id="name"
                placeholder="이름"
              />
              <FormErrorMessage>{form.errors.name}</FormErrorMessage>
            </FormControl>
          );
        }}
      </Field>
      <Wrap>
        <WrapItem>
          <Field name="gender">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.gender && form.touched.gender}
              >
                <RadioGroup name="gender" mr="4">
                  <FormLabel mt="8">성별</FormLabel>
                  <Stack spacing={5} direction="row">
                    {/* <FormLabel mt="2.5">성별</FormLabel> */}
                    <Radio {...field} value="female" m="2" size="md">
                      <Text fontSize="sm">여성</Text>
                    </Radio>
                    <Radio {...field} value="male" size="md">
                      <Text fontSize="sm">남성</Text>
                    </Radio>
                  </Stack>
                  <FormErrorMessage>{form.errors.gender}</FormErrorMessage>
                </RadioGroup>
              </FormControl>
            )}
          </Field>
        </WrapItem>
        <WrapItem>
          <Field name="birth">
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.birth && form.touched.birth}>
                <FormLabel htmlFor="birth" mt="8">
                  생년월일
                </FormLabel>
                <Box maxWidth="sm">
                  <DatePickerComponent birth={form} />
                </Box>
                <FormErrorMessage>{form.errors.birth}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </WrapItem>
      </Wrap>
      <Field name="vaccine">
        {({ field, form }) => (
          <FormControl>
            <CheckboxGroup>
              <FormLabel htmlFor="vaccine" mt="8">
                예방 접종 내역
              </FormLabel>
              <Wrap maxWidth="md">
                {vaccines.map((vaccine) => {
                  return (
                    <WrapItem key={vaccine.id}>
                      <Checkbox
                        {...field}
                        value={vaccine.id + ""}
                        margin={"2.5"}
                      >
                        <Text fontSize="sm">{vaccine.name}</Text>
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
  //TODO: validation

  return (
    <Box>
      <Field name={`family_info.${index}.name`}>
        {({ field, form }) => {
          let isError;
          let isTouched;
          if (form.errors.family_info) {
            if (form.errors.family_info[index]) {
              isError = form.errors.family_info[index];
            }
          }
          if (form.touched.family_info) {
            if (form.touched.family_info[index]) {
              isTouched = form.touched.family_info[index];
            }
          }
          return (
            <FormControl
              isInvalid={
                isError && isTouched ? isError.name && isTouched.name : false
              }
            >
              <FormLabel htmlFor="name">* 이름</FormLabel>
              <Input
                {...field}
                size="sm"
                maxWidth="md"
                id="name"
                placeholder="이름"
              />
              <FormErrorMessage>
                {isError ? isError.name : null}
              </FormErrorMessage>
            </FormControl>
          );
        }}
      </Field>
      <Wrap>
        <WrapItem>
          <Field name={`family_info.${index}.gender`}>
            {({ field, form }) => {
              let isError;
              let isTouched;
              if (form.errors.family_info) {
                if (form.errors.family_info[index]) {
                  isError = form.errors.family_info[index];
                }
              }
              if (form.touched.family_info) {
                if (form.touched.family_info[index]) {
                  isTouched = form.touched.family_info[index];
                }
              }
              return (
                <FormControl
                  isInvalid={
                    isError && isTouched
                      ? isError.gender && isTouched.gender
                      : false
                  }
                >
                  <RadioGroup name="gender" mr="2">
                    <FormLabel mt="8">성별</FormLabel>
                    <Stack spacing={1} direction="row">
                      <Radio {...field} value="female" m="2" size="md">
                        <Text fontSize="sm">여성</Text>
                      </Radio>
                      <Radio {...field} value="male" size="md">
                        <Text fontSize="sm">남성</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <FormErrorMessage>
                    {isError ? isError.gender : null}
                  </FormErrorMessage>
                </FormControl>
              );
            }}
          </Field>
        </WrapItem>
        <WrapItem>
          <Field name={`family_info.${index}.birth`}>
            {({ field, form }) => {
              let isError;
              let isTouched;
              if (form.errors.family_info) {
                if (form.errors.family_info[index]) {
                  isError = form.errors.family_info[index];
                }
              }
              if (form.touched.family_info) {
                if (form.touched.family_info[index]) {
                  isTouched = form.touched.family_info[index];
                }
              }
              return (
                <FormControl
                  isInvalid={
                    isError && isTouched
                      ? isError.birth && isTouched.birth
                      : false
                  }
                >
                  <FormLabel htmlFor="birth" mt="8">
                    생년월일
                  </FormLabel>
                  <Box maxWidth="sm">
                    <DatePickerComponent birth={form} index={index} />
                  </Box>
                  <FormErrorMessage>
                    {isError ? isError.birth : null}
                  </FormErrorMessage>
                </FormControl>
              );
            }}
          </Field>
        </WrapItem>
      </Wrap>
      <Field name={`family_info.${index}.vaccine`}>
        {({ field, form }) => (
          <FormControl>
            <CheckboxGroup>
              <FormLabel htmlFor="vaccine" mt="8">
                예방 접종 내역
              </FormLabel>
              <Wrap maxWidth="md">
                {vaccines.map((vaccine) => {
                  return (
                    <WrapItem key={vaccine.id}>
                      <Checkbox
                        {...field}
                        value={vaccine.id + ""}
                        margin={"2.5"}
                      >
                        <Text fontSize="sm">{vaccine.name}</Text>
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
  const [startDate, setStartDate] = useState();
  const curDate = new Date();
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
        const year = date.getFullYear();
        let month = date.getMonth() + 1 + "";
        if (month.length === 1) {
          month = "0" + month;
        }
        let day = date.getDate() + "";
        if (day.length === 1) {
          day = "0" + day;
        }

        date = year + "-" + month + "-" + day;
        if (props.index === undefined) {
          props.birth.setValues({ ...props.birth.values, birth: date });
        } else {
          const ind = props.index;
          props.birth.setValues((prev) => ({
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
};
