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
    query: Yup.object({
        paginate: Yup.boolean().required('Paginate is required'),
        page_number: Yup.number().test('pageNumberRequired', 'Page Number is required when paginate is true.', function (value) {
            const page_number = this.resolve(Yup.ref('paginate'));
            if (page_number) {
                return !!value;
            }
            return true;
        }),
        number_of_records: Yup.number().test('pageNumberRequired', 'Page Number is required when paginate is true.', function (value) {
            const page_number = this.resolve(Yup.ref('paginate'));
            if (page_number) {
                return !!value;
            }
            return true;
        }),
    })
});


export type ProjectSchemaType = Yup.InferType<typeof getProjectDetailsSchema>;

export type GetAllProjectAssetsSchemaType = Yup.InferType<typeof GetAllProjectAssetsSchema>;