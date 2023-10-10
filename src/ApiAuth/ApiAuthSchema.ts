import * as Yup from "yup";

export const CreateApiKeySchema = Yup.object({
  body: Yup.object({
    userId: Yup.string().required("User ID is required"),
  }),
});

export type CreateApiKeySchemaType = Yup.InferType<typeof CreateApiKeySchema>;
