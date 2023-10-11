import * as Yup from "yup";

export const getProjectDetailsSchema = Yup.object({
    params: Yup.object({
        projectId: Yup.string().required("Project ID is required")
    }),
});
export type ProjectSchemaType = Yup.InferType<typeof getProjectDetailsSchema>;