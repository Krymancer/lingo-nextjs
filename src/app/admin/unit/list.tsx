import { Datagrid, List, ReferenceField, TextField, NumberField } from "react-admin";

export default function UnitList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <ReferenceField source="courseId" reference="courses" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
}