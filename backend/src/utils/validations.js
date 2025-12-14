const checkRequiredFields = (dataPayload, requiredFields) => requiredFields.every(field => field in dataPayload && dataPayload[field]);

export { checkRequiredFields };