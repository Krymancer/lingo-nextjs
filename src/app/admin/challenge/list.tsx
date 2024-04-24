import { Datagrid, List, NumberField, ReferenceField, TextField, SelectField } from "react-admin";

export default function ChallengeList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" />
        <SelectField source="type" choices={[
          { id: "SELECT", name: "Select" },
          { id: "ASSIST", name: "Assist" },
        ]} />
        <ReferenceField source="lessonId" reference="lessons" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
}