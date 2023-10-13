import * as Yup from "yup";

export const getProjectDetailsSchema = Yup.object({
    params: Yup.object({
        projectId: Yup.string().required("Project ID is required")
    }),
});

export const GetAllProjectAssetsSchema = Yup.object({
    params: Yup.object({
        projectId: Yup.string().trim().required(),
    }),
});

export type ProjectSchemaType = Yup.InferType<typeof getProjectDetailsSchema>;

export type GetAllProjectAssetsSchemaType = Yup.InferType<typeof GetAllProjectAssetsSchema>;