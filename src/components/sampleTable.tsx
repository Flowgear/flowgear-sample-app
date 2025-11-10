import { useEffect, useState } from "react";
import SampleRow from "./sampleRow";
import type { SampleType } from "../model/SampleType";
import { fetchSampleData } from "../services/sampleServices";

type Props = Readonly<{
    refresh: boolean;
}>;

const SampleTable = (props: Props) => {
    const { refresh } = props;

    const [headings, setHeadings] = useState<string[]>([]);
    const [items, setItems] = useState<SampleType[]>([]);

    useEffect(() => {
        const refreshItems = async () => {
            let items = await fetchSampleData();
            items.sort(
                (a, b) =>
                    new Date(b.OrderDate).getTime() -
                    new Date(a.OrderDate).getTime()
            );

            if (items[0]) {
                let itemHeadings = Object.keys(items[0]);
                setHeadings(itemHeadings);
            }
            setItems(items);
        };

        refreshItems();
    }, [refresh]);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {headings.map((val: string, index: number) => {
                            if (val === "OrderTotal") {
                                return (
                                    <th
                                        key={index}
                                        className={"text-align-right"}>
                                        {val}
                                    </th>
                                );
                            }
                            return <th key={index}>{val}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <SampleRow
                            key={index}
                            item={item}
                            headings={headings}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SampleTable;
