import {useEffect, useState} from "react";
import type {UsersModel} from "@/models/users.model";
import {getOrderById} from "@/api/Config";
import {Loader2} from "lucide-react";
import * as React from "react";
import { FormatDateNoTime} from "@/utils/FormatDate";
import {Card, CardContent, CardTitle, CardHeader} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
} from "@/components/ui/table"
import type {OrderItem} from "@/models/orderitems.model";

interface Props {
    orderId: number;
}

const OrderDetail: React.FC<Props> = ({ orderId }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [noOrder, setNoOrder] = useState<string>("");
    const [user, setUser] = useState<UsersModel>();
    const [orderType, setOrderType] = useState<string>();
    const [orderStatus, setOrderStatus] = useState<string>();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>();
    const [tenantId, setTenantId] = useState<string>();
    const [diskon, setDiskon] = useState<number>();
    const [tax, setTax] = useState<number>();

    const DataRowPrice = ({label, value}: {label: string; value: string | number | null | undefined}) => (
        <TableRow>
            <TableCell className="text-right">{label}</TableCell>
            <TableCell className="text-right">{value}</TableCell>
        </TableRow>
    );

    const DataRow = ({label, value}: { label: string; value: string | number | null }) => (
        <div className="flex justify-between">
            <div>{label}</div>
            <div className={"font-semibold capitalize"}>{value}</div>
        </div>
    );

    useEffect(() => {
        if (orderId){
            const fetchOrderDetail = async () =>{
                setLoading(true);
                try {
                    const response = await getOrderById(orderId);
                    if (response){
                        setUser(response.user)
                        setNoOrder(response.order_no);
                        setOrderType(response.order_type);
                        setOrderStatus(response.status);
                        setStartDate(response.start_date);
                        setEndDate(response.end_date);
                        setOrderItems(response.order_items);
                        setTenantId(response.tenant_id);
                        setDiskon(response.discount_amount);
                        setTax(response.tax_amount);
                    }
                }finally {
                    setLoading(false)
                }
            }
            fetchOrderDetail().catch(console.error);
        }
    }, [orderId]);


    const isLunas = orderStatus === 'lunas';

    return (
        <>
            { loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <Card className={""}>
                        <CardHeader>
                            <CardTitle className="font-semibold capitalize">
                                Detail Pemesanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-3">
                                <DataRow label={"Nomor Pesanan"} value={noOrder} />
                                <hr/>
                                <DataRow label={"Nama Perusahaan"} value={tenantId? tenantId:null} />
                                <hr/>
                                <DataRow label={"User"} value={user? user.name : null} />
                                <hr/>
                                <DataRow label={"Jenis Pesanan"} value={orderType? orderType:null} />
                                <hr/>
                                <div className="flex justify-between">
                                    <div>Status Pesanan</div>
                                    <div className={"font-semibold capitalize"}>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold 
                                    ${isLunas ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {isLunas ? 'Lunas' : 'Belum Lunas'}
                                </span>
                                    </div>
                                </div>
                                <hr/>
                                <DataRow label={"Tanggal Pemesanan"} value={FormatDateNoTime(startDate)} />
                                <hr/>
                                <DataRow label={"Tanggal Jatuh Tempo"} value={FormatDateNoTime(endDate)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={"col-span-2"}>
                        <CardHeader>
                            <CardTitle className="font-semibold capitalize">
                                Detail Pesanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems?.map((item, index) => (
                                        <TableRow key={index} >
                                            <TableCell>{item.item_type}</TableCell>
                                            <TableCell className="text-right">Rp {item.price.toLocaleString("id-ID")}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <DataRowPrice label={"Sub Total"} value={"Rp " + diskon?.toLocaleString("id-ID")}/>
                                    <DataRowPrice label={"Diskon"} value={"Rp " + diskon?.toLocaleString("id-ID")}/>
                                    <DataRowPrice label={"Tax"} value={"Rp " + tax?.toLocaleString("id-ID")}/>
                                    <DataRowPrice label={"Total"} value={"Rp " + diskon?.toLocaleString("id-ID")}/>
                                </TableFooter>
                            </Table>

                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}

export default OrderDetail;