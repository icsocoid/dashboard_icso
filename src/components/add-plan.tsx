import {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format";
import {getPlanById, savePlan, updatePlan} from "@/api/Config.tsx";
import {toast} from "react-toastify";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Switch} from "@/components/ui/switch.tsx";


interface Feature {
    description: string;
    qty: number;
    has_access: boolean;
}

interface Props {
    planId?: number;
}

const PlanForm: React.FC<Props> = ({ planId }) => {
    const [nama, setNama] = useState("")
    const [trialDays, setTrialDays] = useState<number>()
    const [priceMonthly, setPriceMonthly] = useState<number>()
    const [priceYearly, setPriceYearly] = useState<number>()
    const [deskripsi, setDeskripsi] = useState("")

    useEffect(() => {
        if (planId){
            (async () => {
                const plan = await getPlanById(planId);
                if (plan) {
                    setNama(plan.name);
                    setTrialDays(plan.trial_days);
                    setPriceMonthly(plan.price_monthly);
                    setPriceYearly(plan.price_yearly);
                    setDeskripsi(plan.description);

                    const mappedFeatures = plan.features.map((feature: any) => ({
                        description: feature.description,
                        qty: Number(feature.quantity),
                        has_access: feature.has_access === "yes",
                    }));

                    setFitur({ features: mappedFeatures });
                }
            })();
        }

    }, []);

    const [fitur, setFitur] = useState({
        features: [
            { description: "Produk Terbatas", qty: 0, has_access: false },
            { description: "Custom User", qty: 0, has_access: false },
            { description: "Invoice Pembelian Terbatas", qty: 0, has_access: false },
            { description: "Invoice Penjualan Terbatas", qty: 0, has_access: false },
            { description: "Limit Storage", qty: 0, has_access: false },
            { description: "Custom Coa", qty: 0, has_access: false },
            { description: "Hak Akses", qty: 0, has_access: false },
            { description: "Custom Dashboard", qty: 0, has_access: false },
            { description: "Custom Print Invoice", qty: 0, has_access: false },
            { description: "Custom Print Invoice", qty: 0, has_access: false },
        ] as Feature[],
    });


    interface FeaturePayload {
        description: string;
        qty: number;
        has_access: "yes" | "no";
    }

    const handleSaveButton = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const transformedFeatures = fitur.features.map<FeaturePayload>((f) => ({
            description: f.description,
            qty: Number(f.qty),
            has_access: f.has_access ? "yes" : "no",
        }));

        const payload = {
            name: nama,
            price_monthly: Number(priceMonthly),
            price_yearly: Number(priceYearly),
            description: deskripsi,
            trial_days: Number(trialDays),
            features: transformedFeatures,
        };

        try {
            const result = planId ?
                await updatePlan(planId, payload.name, payload.price_monthly, payload.price_yearly, payload.description, payload.trial_days, payload.features)
                : await savePlan(payload.name, payload.price_monthly, payload.price_yearly, payload.description, payload.trial_days, payload.features);

            if (result.status) {
                toast.success("Berhasil menyimpan plan!");
            } else {
                toast.error("Gagal menyimpan: " + (result.message || "Unknown error"));
            }
        } catch (error: any) {
            toast.error("Error: " + (error.message || "Terjadi kesalahan"));
        }
    };

    return (
        <div className="mx-10 ">
            <form onSubmit={handleSaveButton} className="p-6 md:p-8">
                <Card className="w-full max-w-screen-lg mx-auto p-2">
                    <CardContent className={"py-3"}>
                        <form>
                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="name">Nama Paket: <span className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-2">
                                        <div className="flex items-center space-x-2 flex-auto">
                                            <Checkbox id="terms"/>
                                            <Label htmlFor="terms">Popular plan</Label>
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={nama}
                                            placeholder={"Enter Name Plan"}
                                            onChange={(e) => setNama(e.target.value ? e.target.value : "")}
                                            required/>
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="description">Short description: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <Textarea
                                            id="description"
                                            value={deskripsi}
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required/>
                                    </div>
                                </div>
                            </div>


                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="trial_day">Trial Days: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <div className="relative">
                                            <Input
                                                id="trial_days"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                className="w-full pr-12 text-right"
                                            />
                                            <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              Day
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="price_monthly">Monthly Price: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <div className="relative w-full">
                                            <NumericFormat
                                                id="price_monthly"
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                placeholder="0.00"
                                                value={priceMonthly}
                                                onChange={(values) => setPriceMonthly(Number(values.target))}
                                                className="w-full border border-input rounded-md px-3 py-2 pr-14 text-right focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                                IDR
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="yearly_monthly">Yearly Price: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <div className="relative w-full">
                                            <NumericFormat
                                                id="yearly_monthly"
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                placeholder="0.00"
                                                value={priceYearly}
                                                onChange={(values) => setPriceYearly(Number(values.target))}
                                                className="w-full border border-input rounded-md px-3 py-2 pr-14 text-right focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring"
                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                                IDR
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="qty_produk">Hak Akses: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>

                                <div className="basis-1/5  flex items-center space-x-2 flex-auto">
                                    <div className="flex items-center  ">
                                        <div className="flex items-center space-x-2">
                                            <Switch checked id="airplane-mode"/>
                                            <Label htmlFor="airplane-mode">Hak Akses</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <Textarea
                                            id="deskripsi_akses"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="qty_produk">Custom Coa: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>

                                <div className="basis-1/5  flex items-center space-x-2 flex-auto">
                                    <div className="flex items-center ">
                                        <div className="flex items-center space-x-2">
                                            <Switch checked id="airplane-mode"/>
                                            <Label htmlFor="airplane-mode">Hak Akses</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <Textarea
                                            id="deskripsi_coa"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="qty_produk">Custom Dashboard: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>

                                <div className="basis-1/5  flex items-center space-x-2 flex-auto">
                                    <div className="flex items-center ">
                                        <div className="flex items-center space-x-2">
                                            <Switch checked id="airplane-mode"/>
                                            <Label htmlFor="airplane-mode">Hak Akses</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <Textarea
                                            id="deskripsi_dashboard"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="qty_produk">Custom Print Invoice: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>

                                <div className="basis-1/5  flex items-center space-x-2 flex-auto">
                                    <div className="flex items-center ">
                                        <div className="flex items-center space-x-1">
                                            <Switch checked id="airplane-mode"/>
                                            <Label htmlFor="airplane-mode">Hak Akses</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">

                                        <div className="grid grid-cols-1">
                                            <Textarea
                                                id="deskripsi_invoice"
                                                placeholder={"Max 150 characters long"}
                                                onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                                required
                                                className={"mt-3"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="trial_day">Produk Terbatas: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <div className="relative">
                                            <Input
                                                id="qty_produk"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                className="w-full pr-12 text-right"
                                            />
                                            <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              QTY
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_product"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="trial_day">Custom User: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <div className="relative">
                                            <Input
                                                id="qty_user"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                className="w-full pr-12 text-right"
                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              QTY
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_user"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="trial_day">Invoice Pembelian Terbatas: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <div className="relative">
                                            <Input
                                                id="qty_pembelian"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                className="w-full pr-12 text-right"
                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              QTY
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_pembelian"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="trial_day">Invoice Penjualan Terbatas: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <div className="relative">
                                            <Input
                                                id="qty_penjualan"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                className="w-full pr-12 text-right"
                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              QTY
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_penjualan"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3 flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="trial_day">Limit Storage: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <div className="relative">
                                            <Input
                                                id="size_storage"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                className="w-full pr-12 text-right"
                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              MB
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_storage"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setDeskripsi(e.target.value ? e.target.value : "")}
                                            required
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>

                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                    </CardContent>

                    <CardFooter className="flex flex-col items-end space-x-2 flex-auto">

                        <Button className="w-auto">Simpan</Button>
                    </CardFooter>
                </Card>

            </form>
        </div>
    );
};

export default PlanForm;