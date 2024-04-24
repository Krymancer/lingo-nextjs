import { Datagrid, List, NumberField, ReferenceField, TextField, BooleanField } from "react-admin";

export default function ChallengeOptionList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" />
        <BooleanField soruce="correct" />
        <ReferenceField source="challengeId" reference="challenges" />
        <TextField source="imageSrc" />
        <TextField source="audioSrc" />
      </Datagrid>
    </List>
  );
}