import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { UserList } from "./UserList.tsx";
import { dataProvider } from "./provider/dataProvider.tsx";
import { authProvider } from "./provider/authProvider.tsx";
import { UserEdit } from "./UserEdit.tsx";

export const App = () => {
  return (
    <Admin
      layout={Layout}
      dataProvider={dataProvider}
      authProvider={authProvider}
    >
      <Resource name="users" list={UserList} edit={UserEdit} />
    </Admin>
  );
};
