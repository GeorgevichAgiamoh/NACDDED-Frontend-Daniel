import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { LoadLay, appName, myEles, setTitle } from "../../../../helper/general"
import { payTypeEle } from "../../../classes/classes"
import { CircularProgress } from "@mui/material"
import { DioceseMessagesList } from "./messageList"
import { dioceseBasicinfo, msgThread } from "../../../classes/models"
import { DioceseMessageThread } from "./messageThread"



export function DioceseMessages(mainprop:{dbi:dioceseBasicinfo}){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[stage, setStage] = useState(-1)
    const[thread, setThread] = useState<msgThread>()

    useEffect(()=>{
        setTitle(`Messages - ${appName}`)
    },[])


    if(stage == -1){
        return <DioceseMessagesList dbi={mainprop.dbi} actiony={(thread,action)=>{
            setStage(action)
            setThread(thread)
        }} backy={()=>{
            setStage(-1)
        }} />
    }
    if(stage == 1 && thread){
        return <DioceseMessageThread dbi={mainprop.dbi} backy={()=>{
            setStage(-1)
        }} thread={thread} />
    }
    return LoadLay()
}

