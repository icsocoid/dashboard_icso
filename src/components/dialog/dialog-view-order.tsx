import * as React from "react";
import {useEffect, useState} from "react";
import {getOrderById} from "@/api/Config";
import {DialogHeader, DialogTitle, DialogContent} from "@/components/ui/dialog";
import {Loader2} from "lucide-react";
import type {UsersModel} from "@/models/users.model";
import {FormatDateId} from "@/utils/FormatDate";
import type {OrderItem} from "@/models/orderitems.model";

interface Props{
    orderId: number|undefined;
}
const DialogViewOrder: React.FC<Props> = ({orderId}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [noOrder, setNoOrder] = useState<string>("");
    const [user, setUser] = useState<UsersModel>();
    const [orderType, setOrderType] = useState<string>();
    const [orderStatus, setOrderStatus] = useState<string>();
    const [createdAt, setCreatedAt] = useState<string>("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>();

    useEffect(() => {
        if (orderId){
            const fetchOrderDetail = async () =>{
                setLoading(true);
                try {
                    const result = await getOrderById(orderId)
                    if (result){
                        setNoOrder(result.order_no);
                        setUser(result.user);
                        setOrderType(result.order_type);
                        setOrderStatus(result.status);
                        setCreatedAt(result.created_at);
                        setOrderItems(result.order_items);

                    }
                }finally {
                    setLoading(false)
                }
            }

            fetchOrderDetail().catch(console.error);
        }
    }, [orderId])

    const DataRow = ({label, value}: { label: string; value: string | number | null }) => (
        <div className="flex justify-between">
            <div>{label}</div>
            <div className={"font-semibold capitalize"}>{value}</div>
        </div>
    );

    const isLunas = orderStatus === 'lunas';

    return (
        <>
            { loading ? (
                <DialogContent className="w-full max-w-full sm:max-w-[425px] lg:max-w-[720px] max-h-screen overflow-y-auto">
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                </DialogContent>
                ) : (
                <DialogContent className="w-full max-w-full sm:max-w-[425px] lg:max-w-[720px] max-h-screen overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Pesanan | #{noOrder}</DialogTitle>
                    </DialogHeader>
                    <hr />

                    <div className="grid grid-cols-1 gap-3">
                        <DataRow label={"Nomor Pesanan"} value={noOrder} />
                        <hr/>
                        <DataRow label={"User"} value={user ? user.name : ""} />
                        <hr/>
                        <DataRow label={"Jenis Pesanan"} value={orderType ? orderType : ""} />
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
                        <DataRow label={"Tanggal Pemesanan"} value={FormatDateId(createdAt)} />
                    </div>

                    <DialogHeader className={'mt-5'}>
                        <DialogTitle>Detail Pembayaran</DialogTitle>
                    </DialogHeader>
                    <hr/>
                    {orderItems?.map((item, index) => (
                        <div key={index} className="flex justify-between py-1 last:border-b-0">
                            <div className="capitalize">{item.item_type}</div>
                            <div className=" capitalize">
                                Rp{item.price.toLocaleString("id-ID")}
                            </div>
                        </div>
                    ))}
                    <hr/>
                    <div className="flex justify-between">
                        <div className={"font-semibold capitalize"}>Subtotal</div>
                        <div className={"font-semibold capitalize"}>RP. 0</div>
                    </div>
                    <div className="flex justify-between">
                        <div className={"font-semibold capitalize"}>Diskon</div>
                        <div className={"font-semibold capitalize"}>RP. 0</div>
                    </div>
                    <div className="flex justify-between">
                        <div className={"font-semibold capitalize"}>Total</div>
                        <div className={"font-semibold capitalize"}>RP. 0</div>
                    </div>

                </DialogContent>
            )

            }
        </>
    )
}

export default DialogViewOrder;