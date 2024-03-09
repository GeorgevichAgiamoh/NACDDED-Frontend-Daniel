import { useEffect } from "react"
import { Btn, Line, LrText, Mgin, appName, myEles, setTitle } from "../../../../helper/general"
import useWindowDimensions from "../../../../helper/dimension"
import { AddOutlined, ArrowBack, FileOpenOutlined, PersonOutline } from "@mui/icons-material"
import { indivEle, payTypeEle } from "../../../classes/classes"


export function AdminPayTypesView(mainprop:{payType:payTypeEle,backy:()=>void}){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)

    useEffect(()=>{
        setTitle(mainprop.payType.name+' - '+appName)
    },[])

    return <div className="vlc" style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <div id="clk" className="hlc" onClick={()=>{
            mainprop.backy()
        }} style={{
            alignSelf:'flex-start'
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={20} />
        <div style={{
            alignSelf:'flex-end'
        }}>
            <Btn txt="Edit" width={120} onClick={()=>{

            }} />
        </div>
        <Mgin top={20} />
        <div id="lshdw" className="vlc" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            boxSizing:'border-box',
            padding:dimen.dsk?20:10
        }}>
            <div className="flexi">
                <InfoLay sub="Payment Type" main={mainprop.payType.getType()} />
                <InfoLay sub="Category" main={mainprop.payType.getTier()} />
                <InfoLay sub="Name" main={mainprop.payType.name} />
                <InfoLay sub="Amount" main={mainprop.payType.amt.toString()} />
                <InfoLay sub="Interval" main={mainprop.payType.getinterval()} />
            </div>
            <Mgin top={20} />
            <Line />
            <Mgin top={20} />
            <LrText 
            left={<mye.Tv text="Add Another Tier" color={mye.mycol.primarycol} />}
            right={<AddOutlined className="icon" />}
            />
        </div>
    </div>

    function InfoLay(prop:{sub:string, main:string}) {
        return <div style={{
            minWidth:dimen.dsk?120:100,
            marginTop:dimen.dsk?20:20,
            marginRight:10
        }}>
            <mye.Tv text={prop.sub} color={mye.mycol.imghint} size={12} />
            <Mgin top={5} />
            <mye.Tv text={prop.main} size={16} />
        </div>
    }

}