import { Edit, SimpleForm, TextInput, required, ReferenceInput, NumberInput, SelectInput } from "react-admin";

export default function ChallengeEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="question" validate={[required()]} label="Title" />
        <ReferenceInput source="lessonId" reference="lessons" />
        <SelectInput source="type" choices={[
          { id: "SELECT", name: "Select" },
          { id: "ASSIST", name: "Assist" },
        ]} validate={[required()]} />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Edit>
  );
}