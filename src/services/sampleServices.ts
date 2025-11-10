import { Flowgear } from "flowgear-webapp";
import type { SampleType } from "../model/SampleType";
import { config } from "../utils/config";

export const fetchSampleData = async () => {
    try {
        let items = await Flowgear.Sdk.invoke<SampleType[]>(
            "GET",
            `${config.baseUrl}/sampledata`
        );
        return items;
    } catch (ex: any) {
        Flowgear.Sdk.setAlert(
            `Failed to load items: ${ex.message}`,
            Flowgear.Sdk.AlertMessageTypes.Error,
            Flowgear.Sdk.AlertDismissOptions.Tap
        );
        return [];
    }
};
