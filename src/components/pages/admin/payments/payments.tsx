import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { appName, myEles, setTitle } from "../../../../helper/general"
import { payTypeEle } from "../../../classes/classes"
import { CircularProgress } from "@mui/material"
import { AdminPayTypes } from "./payTypeList"
import { AdminPayTypesView } from "./payTypeView"
import { PaymentList } from "./paymentList"
import { PendingPayments } from "./pendingPayments"



export function AdminPayments(){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[payType, setPayType] = useState<payTypeEle>()
    const[stage, setStage] = useState(-1)

    useEffect(()=>{
        setTitle(`Payments - ${appName}`)
    },[])


    if(stage == -1){
        return <AdminPayTypes actiony={(action,pt)=>{
            setPayType(pt)
            setStage(action)
        }} />
    }
    if(stage == 0 && payType){
        return <AdminPayTypesView payType={payType} backy={()=>{
            setStage(-1)
        }} />
    }
    if(stage == 1  && payType){
        return <PaymentList payType={payType} backy={()=>{
            setStage(-1)
        }} />
    }
    if(stage == 2){
        return <PendingPayments backy={()=>{
            setStage(-1)
        }} />
    }
    return <div className="ctr" style={{
        width:'100%',
        height:'100%'
    }}>
        <CircularProgress className="icon" />
    </div>

    

}

