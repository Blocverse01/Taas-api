import * as Yup from "yup";

export const CreateApiKeySchema = Yup.object({
  body: Yup.object({
    userId: Yup.string().required(),
    projectId: Yup.string().required(),
  }),
});

export type CreateApiKeySchemaType = Yup.InferType<typeof CreateApiKeySchema>;
