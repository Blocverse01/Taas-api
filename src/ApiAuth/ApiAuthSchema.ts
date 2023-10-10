import * as Yup from "yup";

export const CreateApiKeySchema = Yup.object({
  body: Yup.object({
    userId: Yup.string().trim().required(),
    projectId: Yup.string().trim().required(),
  }),
});

export type CreateApiKeySchemaType = Yup.InferType<typeof CreateApiKeySchema>;
