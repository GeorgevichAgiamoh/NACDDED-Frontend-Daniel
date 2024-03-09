import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { Btn, DatePicky, EditTextFilled, IconBtn, Line, LoadLay, LrText, Mgin, appName, icony, myEles, setTitle } from "../../../../helper/general"
import { format } from "date-fns"
import { CircularProgress } from "@mui/material"
import { dioceseBasicinfo, eventEle } from "../../../classes/models"
import { AdminWorkFlowList } from "./theList"
import { AdminEventView } from "./viewEvent"
import { NewEvent } from "./newEvent"
import { EventRegList } from "./regList"



export function AdminWorkFlow(){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[event, setEvent] = useState<eventEle>()
    const[stage, setStage] = useState(-1)

    useEffect(()=>{
        setTitle(`Workflow - ${appName}`)
    },[])


    if(stage == -1){
        return <AdminWorkFlowList actiony={(action,ev)=>{ // The `user` must have been prepared (gen and fin) on click
            setEvent(ev)
            setStage(action)
        }} />
    }
    if(stage == 0 && event){
        return <AdminEventView event={event} backy={(action)=>{
            setStage(action)
        }}/>
    }
    if(stage == 1){
        return <NewEvent ev={event} backy={()=>{
            setStage(-1)
        }}/>
    }
    if(stage == 2 && event){
        return <EventRegList event={event}  backy={()=>{
            setStage(-1)
        }}/>
    }
    return LoadLay()
}

