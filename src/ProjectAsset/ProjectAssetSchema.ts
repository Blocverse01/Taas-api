import * as Yup from "yup";

export const GetProjectAssetSchema = Yup.object({
  params: Yup.object({
    assetId: Yup.string().trim().required(),
  }),
});

export type GetProjectAssetSchemaType = Yup.InferType<typeof GetProjectAssetSchema>;
