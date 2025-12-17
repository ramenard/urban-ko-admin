import { SimpleForm, TextInput, Edit, NumberInput } from "react-admin";

//Component to edit a user
export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="_id" disabled />
      <TextInput source="username" />
      <TextInput source="email" />
      <TextInput source="gender" />
      <NumberInput source="age" />
      <NumberInput source="weight" />
      <NumberInput source="height" />
      <NumberInput source="figths" />
      <NumberInput source="victories" />
      <NumberInput source="defeats" />
      <NumberInput source="score" />
    </SimpleForm>
  </Edit>
);
