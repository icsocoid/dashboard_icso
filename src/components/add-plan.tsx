import {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format";
import {getPlanById, savePlan, updatePlan} from "@/api/Config.tsx";
import {toast} from "react-toastify";

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

    const updateFeature = (index: number, key: keyof Feature, value: any) => {
        const updatedFeatures = [...fitur.features];
        updatedFeatures[index] = {
            ...updatedFeatures[index],
            [key]: key === "has_access" ? value === "yes" : key === "qty" ? parseInt(value) : value,
        };
        setFitur({ ...fitur, features: updatedFeatures });
    };


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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Nama Paket</Label>
                        <Input
                            id="name"
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value ? e.target.value : "")}
                            required/>
                    </div>
                    <div>
                        <Label htmlFor="trial_days">Trial (hari)</Label>
                        <Input
                            id="trial_days"
                            type="number"
                            value={trialDays}
                            onChange={(e) => setTrialDays(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="price_monthly">Harga Bulanan</Label>
                        <NumericFormat
                            id="price_monthly"
                            className="w-full border rounded-md px-3 py-2"
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp"
                            value={priceMonthly}
                            onValueChange={(values) => setPriceMonthly(Number(values.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="price_yearly">Harga Tahunan</Label>
                        <NumericFormat
                            id="price_yearly"
                            className="w-full border rounded-md px-3 py-2"
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp"
                            value={priceYearly}
                            onValueChange={(values) => setPriceYearly(Number(values.value))}

                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                        id="description"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}

                    />
                </div>

                <div>
                    <h2 className="font-semibold text-lg mt-4 mb-2">Fitur</h2>
                    <div className="grid gap-4">
                        {fitur.features.map((feature, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                <Input
                                    readOnly
                                    value={feature.description}
                                    onChange={(e) => updateFeature(index, "description", e.target.value)}
                                    placeholder="Deskripsi"
                                />
                                <Input
                                    type="number"
                                    value={feature.qty}
                                    onChange={(e) => updateFeature(index, "qty", e.target.value)}
                                    placeholder="Qty"
                                />
                                <select
                                    value={feature.has_access ? "yes" : "no"}
                                    onChange={(e) => updateFeature(index, "has_access", e.target.value)}
                                    className="border rounded-md px-3 py-2"
                                >
                                    <option value="yes">Akses</option>
                                    <option value="no">Tidak Akses</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                <Button className="mt-6 w-auto">Simpan</Button>
            </form>
        </div>
    );
};

export default PlanForm;