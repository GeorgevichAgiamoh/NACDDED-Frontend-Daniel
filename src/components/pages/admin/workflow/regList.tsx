import { PersonOutline, FilterOutlined, SortOutlined, SearchOutlined, ListAltOutlined, CloudDownloadOutlined, ArrowBack, ArrowForward, MoreVert, Close, Add, KeyboardArrowDown, SavingsOutlined, MonetizationOnOutlined, ListOutlined } from "@mui/icons-material"
import { useState, useEffect } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { myEles, setTitle, appName, Mgin, Btn, LrText, IconBtn, Line, icony, ErrorCont, hexToRgba } from "../../../../helper/general"
import { payTypeEle } from "../../../classes/classes"
import Barcode from "react-barcode"
import { eventEle, eventRegEle, eventRegStat, getCreatedTime } from "../../../classes/models"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { PoweredBySSS } from "../../../../helper/nacdded"
import tabcard from "../../../../assets/tabcard.png"



export function EventRegList(mainprop:{event:eventEle, backy:()=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[showReminder, setShowReminder] = useState(false)
    const[showReceipt, setShowReceipt] = useState(false)
    const myKey = Date.now()
    const[optToShow,setOptToShow] = useState(-1)
    const[showingIndex,setShowingIndex] = useState(0)
    const[regs,setRegs] = useState<eventRegEle[]>([])
    const[stat,setStat] = useState<eventRegStat>()
    

    useEffect(()=>{
        setTitle(`Event Attendees - ${appName}`)
        getStats()
    },[])

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    function getStats(dontGetPays?:boolean){
        function fins(){
            if(dontGetPays){
                setLoad(false)
            }else{
                getTheRegs(0)
            }
        }

        setLoad(true)
        setError(false)
        makeRequest.get(`getEventRegStat/${mainprop.event.getEventId()}`,{},(task)=>{
            if(task.isSuccessful()){
                setStat(new eventRegStat(task.getData()))
                fins()
            }else{
                handleError(task)
            }
        })
    }

    function getTheRegs(index:number){
        setError(false)
        setLoad(true)
        makeRequest.get(`getEventRegs/${mainprop.event.getEventId()}`,{
            start:(index*20),
            count:20
        },(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:eventRegEle[] = []
                for(const key in task.getData()){
                    tem.push(new eventRegEle(task.getData()[key],true))
                }
                setRegs(tem)
                setShowingIndex(index)
            }else{
                handleError(task)
            }
        })
    }

    const[load, setLoad]=useState(false)
    const[loadMsg, setLoadMsg]=useState('Just a sec')
    const[error, setError]=useState(false)
    const[toastMeta, setToastMeta] = useState({visible: false,msg: "",action:2,invoked:0})
    const[timy, setTimy] = useState<{timer?:NodeJS.Timeout}>({timer:undefined});
    function toast(msg:string, action:number,delay?:number){
    var _delay = delay || 5000
    setToastMeta({
        action: action,
        msg: msg,
        visible:true,
        invoked: Date.now()
    })
    clearTimeout(timy.timer)
    setTimy({
        timer:setTimeout(()=>{
            if(Date.now()-toastMeta.invoked > 4000){
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked: 0
                })
            }
        },_delay)
    });
    }

    return <div style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getStats()
        }}/>
        <div className="prgcont" style={{display:load?"flex":"none"}}>
            <div className="hlc" style={{
                backgroundColor:mye.mycol.bkg,
                borderRadius:10,
                padding:20,
            }}>
                <CircularProgress style={{color:mye.mycol.primarycol}}/>
                <Mgin right={20} />
                <mye.Tv text={loadMsg} />
            </div>
        </div>
        <Toast isNgt={false} msg= {toastMeta.msg} action={toastMeta.action} visible={toastMeta.visible} canc={()=>{
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked:0,
                })
            }} />
        <div id="clk" className="hlc" onClick={()=>{
            mainprop.backy()
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={40} />
        <div style={{
            display:'flex',
            width:'100%',
            flexWrap:'wrap',
            alignItems:'center'
        }}>
            <Tab1 icon={PersonOutline} title="Total Registrations" value={stat?stat.getTotal():'...'} color={mye.mycol.hs_blue} />
        </div>
        <Mgin top={20} />
        <mye.HTv text={mainprop.event.getTitle()} color={mye.mycol.primarycol} size={25} />
        <Mgin top={20} />
        <LrText wrap={!dimen.dsk}
        left={<div></div>}
        right={<div className="flexi">
            <IconBtn icon={CloudDownloadOutlined} mye={mye} text="Download CSV" ocl={()=>{

            }} width={140} />
        </div>}
        />
        <Mgin top={15} />
        <div className="vlc" id='lshdw' style={{
            width:'100%',
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?20:10,
            boxSizing:'border-box'
        }}>
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <PersonOutline style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text={'Registrations'} size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                width:dimen.dsk2?'100%':dimen.dsk?dimen.width-450:dimen.width-60,
                overflowX:'scroll'
            }}>
                {
                    <div style={{
                        width:dimen.dsk2?'100%':undefined,
                        paddingBottom:optToShow!=-1?150:0,
                    }}>
                        <div className="hlc">
                            <MyCell text="S/N"  isBold/>
                            <MyCell text="Applicant"  isBold/>
                            <MyCell text="Identity No."  isBold/>
                            <MyCell text="Date"  isBold/>
                            <MyCell text="Status"  isBold/>
                            <MyCell text="Action"  isBold/>
                        </div>
                        {
                            regs.slice((showingIndex*20),(showingIndex*20+20)).map((ele,index)=>{
                                return <div className="hlc" key={myKey+index+showingIndex*20}>
                                    <MyCell text={(index+1+showingIndex*20).toString()} />
                                    <MyCell text={'IN DEV'} />
                                    <MyCell text={ele.getDioceseId()} />
                                    <MyCell text={getCreatedTime(ele.data)} />
                                    <MyCell text={ele.isVerified()?'Approved':'Pending'}/>
                                    <Opts index={index} reg={ele} />
                                </div>
                            })
                        }
                    </div>
                }
            </div>
            <Mgin top={20} />
            <div className="hlc">
                <ArrowBack id="clk" className="icon" onClick={()=>{
                    if(showingIndex >0){
                        const index = showingIndex-1
                        getTheRegs(index)
                    }
                }} />
                <Mgin right={10} />
                {
                    Array.from({length:Math.floor(regs.length/20)+1},(_,index)=>{
                        return <div id="clk" key={myKey+index+10000} className="ctr" style={{
                            width:25,
                            height:25,
                            backgroundColor:showingIndex==index?mye.mycol.black:'transparent',
                            borderRadius:'50%'
                        }} onClick={()=>{
                            getTheRegs(index)
                        }}>
                            <mye.BTv text={(index+1).toString()} color={showingIndex==index?mye.mycol.white:mye.mycol.black} size={16}/>
                        </div>
                    })
                }
                <Mgin right={10} />
                <ArrowForward id="clk" className="icon" onClick={()=>{
                    const len = Math.floor(regs.length/20)
                    if(showingIndex < len){
                        const index = showingIndex+1
                        getTheRegs(index)
                    }
                }} />
            </div>
        </div>
        <PoweredBySSS />
    </div>

    function Opts(prop:{index:number,reg:eventRegEle}) {
        return <div className="ctr" style={{
            flex:(dimen.dsk2)?1:undefined,
            width:(dimen.dsk2)?undefined:100,
            height:40,
            position:'relative'
        }}>
            <div id="clk" className="ctr" style={{
                width:40,
                height:40
            }} onClick={()=>{
                setOptToShow(prop.index)
            }}>
                <MoreVert className="icon" />
            </div>
            <div className="vlc" id="lshdw" style={{
                display:optToShow==prop.index?undefined:'none',
                backgroundColor:mye.mycol.white,
                borderRadius:10,
                width:100,
                position:'absolute',
                top:30,
                left:0,
                zIndex:10
            }}>
                <Close style={{
                    margin:5,
                    fontSize:15,
                    alignSelf:'flex-end',
                    color:mye.mycol.imghint
                }} onClick={()=>{
                    setOptToShow(-1)
                }} />
                <MyCell text="Approve" ocl={()=>{
                    setLoad(true)
                    makeRequest.get(`approveEventReg/${prop.reg.getDioceseId()}/${prop.reg.getEventId()}`,{},(task)=>{
                        setLoad(false)
                        if(task.isSuccessful()){
                            toast('Registration Approved',1)
                            getTheRegs(0)
                        }else{
                            if(task.isLoggedOut()){
                                navigate('/adminlogin')
                                return
                            }
                            toast(task.getErrorMsg(),0)
                        }
                    })                  
                }} alignStart special />
            </div>
        </div>
    }

    function MyCell(prop:{text:string,isBold?:boolean,alignStart?:boolean,ocl?:()=>void, special?:boolean, tCol?:string}) {
        return <div id={prop.special?'clk':undefined} className="ctr" style={{
            flex:(dimen.dsk2 && !prop.special)?1:undefined,
            width:(dimen.dsk2 && !prop.special)?undefined:100,
            height:40,
            padding:prop.alignStart?'0px 10px':undefined,
            boxSizing:'border-box',
            alignItems: prop.alignStart?'start':'center'
        }} onClick={()=>{
            setOptToShow(-1)
            if(prop.ocl){
                prop.ocl()
            }
        }}>
            {prop.isBold?<mye.BTv text={prop.text} size={14} color={mye.mycol.primarycol}  />:<mye.Tv hideOverflow text={prop.text} size={14} color={prop.tCol||mye.mycol.imghint} />}
        </div>
    }

    function FiltrLay(prop:{icon:icony,text:string}) {
        return <div id="lshdw" className="hlc" style={{
            padding:10,
            width:dimen.dsk?150:100,
            margin: dimen.dsk?10:5,
            backgroundColor:mye.mycol.white,
            borderRadius:10,
        }}>
            <prop.icon style={{
                fontSize:20,
                color:mye.mycol.imghint
            }} />
            <Mgin right={7} />
            <div style={{
                flex:1
            }}>
                <mye.Tv text={prop.text} color={mye.mycol.imghint} size={12}/>
            </div>
            <KeyboardArrowDown style={{
                fontSize:20,
                color:mye.mycol.imghint
            }} />
        </div>
    }


    function Tab1(prop:{title:string, value:string, icon:icony, color:string}) {
        
        return <div id="lshdw" style={{
            width: dimen.dsk?300:'100%',
            margin: dimen.dsk?20:'10px 0px',
            height:150,
            boxSizing:'border-box',
            position:'relative',
            borderRadius:10,
            backgroundImage: `url(${tabcard})`,
            backgroundSize: 'cover',
        }}>
            <div className="ctr" style={{
                width:70,
                height:70,
                backgroundColor:hexToRgba(prop.color,0.1),
                borderRadius:'50%',
                position:'absolute',
                top:20,
                right:20
            }}>
                <prop.icon style={{
                    fontSize:20,
                    color: prop.color
                }} />
            </div>
            <div style={{
                position:'absolute',
                left:20,
                bottom:20
            }}>
                <mye.Tv text={prop.title} color={prop.color} />
                <Mgin top={10}/>
                <mye.BTv text={prop.value} size={20}  />
            </div>
        </div>
    }

}

