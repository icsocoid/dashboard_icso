import {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format";
import {getPlanById, savePlan, updatePlan} from "@/api/Config.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {toast} from "react-toastify";
import { Trash } from "lucide-react";

interface Props {
    planId?: number;
}

interface Fitur {
    id: string;
    name: string;
}

const PlanForm: React.FC<Props> = ({ planId }) => {
    const [nama, setNama] = useState("")
    const [trialDays, setTrialDays] = useState<number>()
    const [priceMonthly, setPriceMonthly] = useState<number>()
    const [priceYearly, setPriceYearly] = useState<number>()
    const [shortDeskripsi, setShortDeskripsi] = useState("")
    const [popularPlan, setPopularPlan] = useState<number>()

    const [features, setFeatures] = useState([
        { id: "produk", description: "", qty: 0, has_access: "yes" },
        { id: "user", description: "", qty: 0, has_access: "yes" },
        { id: "pembelian", description: "", qty: 0, has_access: "yes" },
        { id: "penjualan", description: "", qty: 0, has_access: "yes" },
        { id: "storage", description: "", qty: 0, has_access: "yes" },
        { id: "coa", description: "", qty: 0, has_access: "no" },
        { id: "akses", description: "", qty: 0, has_access: "no" },
        { id: "dashboard", description: "", qty: 0, has_access: "no" },
        { id: "printInvoice", description: "", qty: 0, has_access: "no" },

    ]);

    const updateFeature = (id: string, field: "qty" | "description" | "has_access", value: string | number ) => {
        setFeatures(prev =>
            prev.map(f =>
                f.id === id ? { ...f, [field]: value } : f
            )
        );
    };


    useEffect(() => {
        if (planId){
            (async () => {
                const plan = await getPlanById(planId);
                if (plan) {
                    setNama(plan.name);
                    setTrialDays(plan.trial_days);
                    setPriceMonthly(Number(plan.price_monthly));
                    setPriceYearly(Number(plan.price_yearly));
                    setShortDeskripsi(plan.description);
                    setPopularPlan(plan.popular_plan);

                    const featureMap: Record<string, string> = {
                        PRODUCT_LIMIT: "produk",
                        USER_LIMIT: "user",
                        PURCHASE_INVOICE_LIMIT: "pembelian",
                        SALES_INVOICE_LIMIT: "penjualan",
                        STORAGE_SIZE: "storage",
                        ADD_COA: "coa",
                        PERMISSIONS: "akses",
                        ADD_DASHBOARD: "dashboard",
                        CUSTOM_PRINT_REPORT: "printInvoice",
                    };

                    const mappedFeatures = plan.features.map((f: any) => ({
                        id: featureMap[f.feature_name] || f.feature_name.toLowerCase(),
                        description: f.description || "",
                        qty: f.quantity,
                        has_access: f.has_access
                    }));

                    setFeatures(prev =>
                        prev.map(item => {
                            const found = mappedFeatures.find(f => f.id === item.id);
                            return found ? { ...item, ...found } : item;
                        })
                    );
                }
            })();
        }
    }, []);

    const handleSaveButton = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const payload = {
            name: nama,
            popular_plan: popularPlan,
            price_monthly: Number(priceMonthly),
            price_yearly: Number(priceYearly),
            description: shortDeskripsi,
            trial_days: Number(trialDays),
            features: features.map(({ id, ...rest }) => rest),
        };

        try {
            const result = planId ?
                await updatePlan(planId, payload.name, payload.price_monthly, payload.price_yearly, payload.description, payload.trial_days, payload.features)
                : await savePlan(payload.name, payload.price_monthly, payload.price_yearly, payload.description, payload.trial_days, payload.features);

            //const result = await savePlan(payload.name, payload.price_monthly, payload.price_yearly, payload.description, payload.trial_days, payload.features);

            console.log(result);
            if (result.status) {
                toast.success(result.message, {
                    autoClose: 3000, // dalam ms (default toastmu juga ini)
                    onClose: () => {
                        window.location.reload();
                    },
                });
            } else {
                toast.error( result.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const [fiturs, setFiturs] = useState<Fitur[]>([
        { id: crypto.randomUUID(), name: "" }
    ]);

    const handleAddFitur = () => {
        setFiturs([...fiturs, { id: crypto.randomUUID(), name: "" }]);
    };

    const handleRemoveFitur = (id: string) => {
        setFiturs(fiturs.filter((fitur) => fitur.id !== id));
    };

    const handleChange = (id: string, value: string) => {
        setFiturs((prev) =>
            prev.map((f) => (f.id === id ? { ...f, name: value } : f))
        );
    };

    return (
        <div className="mx-10 ">
            <form onSubmit={handleSaveButton} className="p-6 md:p-8">
                <Card className="w-full max-w-screen-lg mx-auto p-2">
                    <CardContent className={"py-3"}>
                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="name">Nama Paket: <span className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-2">
                                        <div className="flex items-center space-x-2 flex-auto">
                                            <Checkbox
                                                id="popular_plan"
                                                checked={popularPlan === 1}
                                                onCheckedChange={(checked) => setPopularPlan(checked ? 1 : 0)}
                                            />
                                            <Label htmlFor="terms">Popular plan</Label>
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={nama}
                                            placeholder={"Enter Name Plan"}
                                            onChange={(e) => setNama(e.target.value ? e.target.value : "")}/>
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
                                            value={shortDeskripsi}
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => setShortDeskripsi(e.target.value ? e.target.value : "")}/>
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
                                                placeholder="0"
                                                className="w-full pr-12 text-right"
                                                value={trialDays}
                                                onChange={(e) => setTrialDays(Number(e.target.value))}

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
                                                onValueChange={(values) => {
                                                    const num = Number(values.value);
                                                    setPriceMonthly(isNaN(num) ? 0 : num);
                                                }}
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
                                                onValueChange={(values) => {
                                                    const num = Number(values.value);
                                                    setPriceYearly(isNaN(num) ? 0 : num);
                                                }}
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
                                    <Label>Hak Akses: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>

                                <div className="basis-1/5  flex items-center space-x-2 flex-auto">
                                    <div className="flex items-center  ">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={features.find(f => f.id === "akses")?.has_access === "yes"}
                                                onCheckedChange={(checked) => updateFeature("akses", "has_access", checked ? "yes" : "no")}
                                                id="switch_akses"
                                            />
                                            <Label htmlFor="airplane-mode">Hak Akses</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <Textarea
                                            id="deskripsi_akses"
                                            placeholder={"Max 150 characters long"}
                                            className={"mt-3"}
                                            onChange={(e) => updateFeature("akses", "description", e.target.value)}
                                            value={features.find(f => f.id === "akses")?.description || ""}

                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label>Custom Coa: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>

                                <div className="basis-1/5  flex items-center space-x-2 flex-auto">
                                    <div className="flex items-center ">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={features.find(f => f.id === "coa")?.has_access === "yes"}
                                                onCheckedChange={(checked) => updateFeature("coa", "has_access", checked ? "yes" : "no")}
                                                id="switch_coa"
                                            />
                                            <Label htmlFor="airplane-mode">Hak Akses</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <Textarea
                                            id="deskripsi_coa"
                                            placeholder={"Max 150 characters long"}
                                            className={"mt-3"}
                                            onChange={(e) => updateFeature("coa", "description", e.target.value)}
                                            value={features.find(f => f.id === "coa")?.description || ""}

                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label>Custom Dashboard: <span className={"text-red-700"}>*</span></Label>
                                </div>

                                <div className="basis-1/5  flex items-center space-x-2 flex-auto">
                                    <div className="flex items-center ">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={features.find(f => f.id === "dashboard")?.has_access === "yes"}
                                                onCheckedChange={(checked) => updateFeature("dashboard", "has_access", checked ? "yes" : "no")}
                                                id="switch_coa"
                                            />
                                            <Label htmlFor="airplane-mode">Hak Akses</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2">
                                    <div className="grid grid-cols-1">
                                        <Textarea
                                            id="deskripsi_dashboard"
                                            placeholder={"Max 150 characters long"}
                                            className={"mt-3"}
                                            onChange={(e) => updateFeature("dashboard", "description", e.target.value)}
                                            value={features.find(f => f.id === "dashboard")?.description || ""}

                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>

                            <div className="flex flex-row">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label>Custom Print Invoice: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>

                                <div className="basis-1/5  flex items-center space-x-2 flex-auto">
                                    <div className="flex items-center ">
                                        <div className="flex items-center space-x-1">
                                            <Switch
                                                checked={features.find(f => f.id === "printInvoice")?.has_access === "yes"}
                                                onCheckedChange={(checked) => updateFeature("printInvoice", "has_access", checked ? "yes" : "no")}
                                                id="switch_coa"
                                            />
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
                                                className={"mt-3"}
                                                onChange={(e) => updateFeature("printInvoice", "description", e.target.value)}
                                                value={features.find(f => f.id === "printInvoice")?.description || ""}

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
                                                onChange={(e) => updateFeature("produk", "qty", Number(e.target.value))}
                                                value={features.find(f => f.id === "produk")?.qty || ""}

                                            />
                                            <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              QTY
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_product"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => updateFeature("produk", "description", e.target.value)}
                                            className={"mt-3"}
                                            value={features.find(f => f.id === "produk")?.description || ""}
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
                                                onChange={(e) => updateFeature("user", "qty", Number(e.target.value))}
                                                value={features.find(f => f.id === "user")?.qty || ""}


                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              QTY
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_user"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => updateFeature("user", "description", e.target.value)}
                                            value={features.find(f => f.id === "user")?.description || ""}
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
                                                onChange={(e) => updateFeature("pembelian", "qty", Number(e.target.value))}
                                                value={features.find(f => f.id === "pembelian")?.qty || ""}

                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              QTY
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_pembelian"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => updateFeature("pembelian", "description", e.target.value)}
                                            value={features.find(f => f.id === "pembelian")?.description || ""}
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
                                                onChange={(e) => updateFeature("penjualan", "qty", Number(e.target.value))}
                                                value={features.find(f => f.id === "penjualan")?.qty || ""}

                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              QTY
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_penjualan"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => updateFeature("penjualan", "description", e.target.value)}
                                            value={features.find(f => f.id === "penjualan")?.description || ""}
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
                                                onChange={(e) => updateFeature("storage", "qty", Number(e.target.value))}
                                                value={features.find(f => f.id === "storage")?.qty || ""}

                                            />
                                            <span
                                                className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                              MB
                                            </span>
                                        </div>

                                        <Textarea
                                            id="deskripsi_storage"
                                            placeholder={"Max 150 characters long"}
                                            onChange={(e) => updateFeature("storage", "description", e.target.value)}
                                            value={features.find(f => f.id === "storage")?.description || ""}
                                            className={"mt-3"}
                                        />
                                    </div>
                                </div>
                            </div>


                    </CardContent>
                </Card>

                <Card className={"w-full max-w-screen-lg mx-auto p-2 mt-3"}>
                    <CardHeader>
                        <CardTitle>Add Fitur</CardTitle>

                        <div className="flex flex-row items-center ">
                            <CardDescription>Tambahkan fitur custom kamu</CardDescription>
                            <Button
                                type="button"
                                onClick={handleAddFitur}
                                className="bg-white hover:bg-gray-100 ms-auto text-black border font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                + Tambah Fitur
                            </Button>
                        </div>
                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>
                    </CardHeader>

                    <CardContent className={"py-3"}>
                        {fiturs.map((fitur, index) => (
                            <div key={fitur.id}>
                                <div className="flex flex-row mb-2">
                                    <div className="basis-1 flex items-center space-x-2 flex-auto">
                                        <Label htmlFor={`fitur-${index}`}>
                                            Nama Fitur: <span className={"text-red-700"}>*</span>
                                        </Label>
                                    </div>
                                    <div className="flex items-center flex-auto">
                                        <Input
                                            id={`fitur-${index}`}
                                            type="text"
                                            placeholder={"Masukkan nama fitur"}
                                            value={fitur.name}
                                            onChange={(e) => handleChange(fitur.id, e.target.value)}
                                        />
                                    </div>
                                    <div className="ms-3">
                                        <Button
                                            type="button"
                                            onClick={() => handleRemoveFitur(fitur.id)}
                                            className="bg-red-600 hover:bg-red-500 ms-auto text-white border font-semibold py-2 px-4 rounded-lg transition duration-200"
                                        >
                                            <Trash color="white" size={16}/>
                                        </Button>
                                    </div>
                                </div>
                                <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>
                            </div>
                        ))}
                    </CardContent>


                    <CardFooter className="flex flex-col items-end space-x-2 flex-auto">
                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"/>
                        <Button className="w-auto">Simpan</Button>
                    </CardFooter>
                </Card>

            </form>
        </div>
    );
};

export default PlanForm;