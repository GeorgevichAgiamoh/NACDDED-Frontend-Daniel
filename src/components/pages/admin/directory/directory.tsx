import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { Btn, DatePicky, EditTextFilled, IconBtn, Line, LoadLay, LrText, Mgin, appName, icony, myEles, setTitle } from "../../../../helper/general"
import { format } from "date-fns"
import { CircularProgress } from "@mui/material"
import { dioceseBasicinfo } from "../../../classes/models"
import { AdminDirList } from "./dirList"
import { AdminDirView } from "./dirView"



export function AdminDirectory(){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[user, setUser] = useState<dioceseBasicinfo>()
    const[stage, setStage] = useState(-1)

    useEffect(()=>{
        setTitle(`Directory - ${appName}`)
    },[])


    if(stage == -1){
        return <AdminDirList actiony={(action,user)=>{ // The `user` must have been prepared (gen and fin) on click
            setUser(user)
            setStage(action)
        }} />
    }
    if((stage == 0 || stage == 2) && user){
        return <AdminDirView user={user} backy={(action)=>{
            setStage(action)
        }}/>
    }
    // if(stage == 1 && user){
    //     return <AdminDirEdit user={user} backy={()=>{
    //         setStage(-1)
    //     }}/>
    // }
    // if(stage == 3){
    //     return <AdminDirAdd  backy={()=>{
    //         setStage(-1)
    //     }}/>
    // }
    return LoadLay()
}

