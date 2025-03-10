import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import DataTable from "react-data-table-component";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import TextError from "./TextError";
import { Button } from "@mui/material";
import ReactTables from "./ReactTables";

const FormikContainer = () => {
  const [userList, setUserList] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(null);

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    description: "",
    skills: [""],
  };

  const URL = "http://localhost:3000/users";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(URL);
        const data = await res.json();
        console.log(data);
        setUserList(data);
      } catch (error) {
        console.log("Error in data fetching", error.message);
      }
    };
    fetchData();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Required")
      .test("unique-name", "Name must be unique", function (value) {
        // return !userList.some((user) => user.name === value);
        return !userList.some(
          (user) => user.name === value && user.id !== updateUserId
        );
      }),
    email: Yup.string()
      .email("Invalid email format")
      .required("Required")
      .test("unique-email", "Email must be unique", function (value) {
        return !userList.some(
          (user) => user.email === value && user.id !== updateUserId
        );
      }),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Required"),
    description: Yup.string()
      .max(250, "Description must not exceed 50 words")
      .required("Required"),
    skills: Yup.array()
    .min(1, "At least one skill required"),
  });

  console.log(`${URL}/${updateUserId}`);
  const handleSubmit = async (values, { resetForm }) => {
    if (updating) {
      await fetch(`${URL}/${updateUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setUserList((prev) =>
        prev.map((user) => (user.id === updateUserId ? values : user))
      );
      setUpdating(false);
      setUpdateUserId(null);
    } else {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const newUser = await res.json();
      setUserList((prev) => [...prev, newUser]);
    }
    resetForm();
  };

  const handleDelete = async (id) => {
    await fetch(`${URL}/${id}`, { method: "DELETE" });
    setUserList(userList.filter((user) => user.id !== id));
  };

  const handleUpdate = (user, setValues) => {
    console.log(user);
    console.log(user.id);
    setUpdating(true);
    setUpdateUserId(user.id);
    setValues({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      description: user.description,
      skills: user.skills || [],
    });
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(formik) => {
          console.log(formik);
          return (
            <Form>
              <FormikControl
                control="input"
                type="name"
                label="name"
                name="name"
              />
              <FormikControl
                control="input"
                type="email"
                label="email"
                name="email"
              />
              <FormikControl
                control="textarea"
                label="Description"
                name="description"
              />
              <FormikControl
                control="input"
                type="text"
                label="phoneNumber"
                name="phoneNumber"
              />

              <div className="form-controls">
                <label htmlFor="skills">List of Skills</label>
                <FieldArray name="skills">
                  {({ push, remove, form }) => {
                    const { values, setFieldValue } = form;
                    const { skills } = values;
                    // console.log("educationField", educationField);

                    return (
                      <div>
                        {/* Display skill as divs */}
                        {skills.map((skill, index) => (
                          <div key={index} className="skills">
                            <span>{skill}</span>{" "}
                            {/* Show hobby value inside a span */}
                            {skill.length > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Input field to add new hobby */}
                        <Field name="newSkill" placeholder="Enter skill" />
                        <button
                          type="button"
                          onClick={() => {
                            // console.log("setFieldValue", setFieldValue, values);
                            const newSkill = values?.newSkill?.trim();
                            if (newSkill) {
                              push(newSkill);
                              setFieldValue("newSkill", "");
                            }
                          }}
                        >
                          Add Skill
                        </button>
                      </div>
                    );
                  }}
                </FieldArray>
                <ErrorMessage name="skills" component={TextError} />
              </div>

              <button type="submit">Submit</button>

              <div>
                <ReactTables
                  data={userList}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  setValues={formik.setValues}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default FormikContainer;
