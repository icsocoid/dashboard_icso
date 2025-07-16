import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {getSubscribeById} from "@/api/Config.tsx";
import {FormatDateId} from "@/utils/FormatDate.tsx";
interface Props {
    detailId?: number;
}
const SubscriptionDetail: React.FC<Props> = ({ detailId }) => {
    const [nama, setNama] = useState("")
    const [plan, setPlan] = useState("")
    const [status, setStatus] = useState<number>(0)
    const [subsAt, setSubsAt] = useState<string>("")
    const [expiryAt, setExpiryAt] = useState<string>("")



    useEffect(() => {
        if (detailId){
            (async () => {
                const subscription = await getSubscribeById(detailId);
                if(subscription){
                    setNama(subscription.user_id);
                    setPlan(subscription.plan.name);
                    setStatus(subscription.status);
                    setExpiryAt(FormatDateId(subscription.expiry_at));
                    setSubsAt(FormatDateId(subscription.starts_at));
                }

            })();
        }
    }, []);
    return (
        <div className="mx-10 ">
            <Card className="w-full max-w-screen-lg mx-auto p-2">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className={"py-3"}>
                    <div className="flex flex-row">
                        <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                            <p className={"font-semibold"}>Nama Pengguna: </p>
                            <span>
                                <p>{nama}</p>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row mt-3">
                        <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                            <p className={"font-semibold"}>Plan: </p>
                            <span>
                                <p>{plan}</p>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row mt-3">
                        <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                            <p className={"font-semibold"}>Status: </p>
                            <span>
                                <div
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold ${
                                        status === 1 ? 'bg-green-500' : 'bg-red-400'
                                    }`}
                                >
                                    {status === 1 ? 'Active' : 'Disable'}
                                </div>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row mt-3">
                        <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                            <p className={"font-semibold"}>Subscription at: </p>
                            <span>
                                <p>{subsAt}</p>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row mt-3">
                        <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                            <p className={"font-semibold"}>Expiry at: </p>
                            <span>
                                <p>{expiryAt}</p>
                            </span>
                        </div>
                    </div>



                </CardContent>
            </Card>

        </div>
    );
}

export default SubscriptionDetail;