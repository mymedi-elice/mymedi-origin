import { AddIcon, CloseIcon, MinusIcon } from "@chakra-ui/icons";
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
  Text,
  Spacer,
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
                              //에러메세지 띄워주기
                            }
                          }}
                        >
                          <AddIcon boxSize={2}></AddIcon>
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
            <Input
              {...field}
              size="sm"
              maxWidth="md"
              id="name"
              placeholder="이름"
            />
            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <Wrap>
        <WrapItem>
          <Field name="gender" validate={validateGender}>
            {({ field, form }) => (
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
              </RadioGroup>
            )}
          </Field>
        </WrapItem>
        <WrapItem>
          <Field name="birth" validate={validateBirth}>
            {({ field, form }) => (
              <FormControl>
                <FormLabel htmlFor="birth" mt="8">
                  생년월일
                </FormLabel>
                <Box maxWidth="sm">
                  <DatePickerComponent birth={form}></DatePickerComponent>
                </Box>
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
                {vaccines.map((vaccine, ind) => {
                  return (
                    <WrapItem key={ind}>
                      <Checkbox {...field} value={vaccine} margin={"2.5"}>
                        <Text fontSize="sm">{vaccine}</Text>
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

  //제대로 안됨
  // const validateName = (value) => {
  //   let error;
  //   if (!value) {
  //     error = "이름을 입력해주세요";
  //   }
  //   return error;
  // };

  // const validateGender = (value) => {
  //   //제출한 순간에만 입력되어 있으면 됨!
  // };

  // const validateBirth = (value) => {
  //   //입력한 날짜가 유효한 날짜인지 확인
  // };

  return (
    <Box>
      <Field name={`family_info.${index}.name`}>
        {({ field, form }) => (
          <FormControl isInvalid={form.errors.name && form.touched.name}>
            {/* form.touched.name의 역할을 알아야 할 것 같다 */}
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
        )}
      </Field>
      <Wrap>
        <WrapItem>
          <Field name={`family_info.${index}.gender`}>
            {({ field, form }) => (
              <RadioGroup name="gender" mr="2">
                <FormLabel mt="8">성별</FormLabel>
                <Stack spacing={1} direction="row">
                  {/* <FormLabel mt="2.5">성별</FormLabel> */}
                  <Radio {...field} value="female" m="2" size="md">
                    <Text fontSize="sm">여성</Text>
                  </Radio>
                  <Radio {...field} value="male" size="md">
                    <Text fontSize="sm">남성</Text>
                  </Radio>
                </Stack>
              </RadioGroup>
            )}
          </Field>
        </WrapItem>
        <WrapItem>
          <Field name={`family_info.${index}.birth`}>
            {({ field, form }) => (
              <FormControl>
                <FormLabel htmlFor="birth" mt="8">
                  생년월일
                </FormLabel>
                <Box maxWidth="sm">
                  <DatePickerComponent birth={form}></DatePickerComponent>
                </Box>
              </FormControl>
            )}
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
                {vaccines.map((vaccine, ind) => {
                  return (
                    <WrapItem key={ind}>
                      <Checkbox {...field} value={vaccine} margin={"2.5"}>
                        <Text fontSize="sm">{vaccine}</Text>
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
  // useEffect(() => {
  //   props.birth.setValues({ ...props.birth.values, birth: curDate });
  // }, [curDate]);
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
        console.log(props);
        console.log(props.birth.values);
        setStartDate(date);
        console.log(props.index);
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
