import {
  List,
  Datagrid,
  TextField,
  EmailField,
  NumberField,
} from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="_id" />
      <TextField source="username" />
      <EmailField source="email" />
      <TextField source="gender" />
      <NumberField source="age" />
      <NumberField source="weight" />
      <NumberField source="height" />
      <NumberField source="figths" />
      <NumberField source="victories" />
      <NumberField source="defeats" />
      <NumberField source="score" />
    </Datagrid>
  </List>
);
