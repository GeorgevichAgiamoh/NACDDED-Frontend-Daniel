import { useEffect, useState } from "react"
import { Btn, ErrorCont, Line, Mgin, appName, goUrl, myEles, setTitle } from "../../../../helper/general"
import useWindowDimensions from "../../../../helper/dimension"
import { ArrowBack, FileOpenOutlined, PersonOutline } from "@mui/icons-material"
import { defVal, dioceseBasicinfo, eventEle, fileEle, getCreatedTime } from "../../../classes/models"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { endpoint, makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { PoweredBySSS } from "../../../../helper/nacdded"


export function AdminEventView(mainprop:{event:eventEle,backy:(action:number)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const [mykey,setMyKey] = useState(Date.now())
    const[memFiles,setMemfiles] = useState<fileEle[]>([])

    useEffect(()=>{
        setTitle(`${mainprop.event.getTitle()} - ${appName}`)
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

    return <div key={mykey} style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
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
            mainprop.backy(-1)
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={20} />
        <div className="vlc">
            <div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="DONE" width={120} onClick={()=>{
                    mainprop.backy(-1)
                }} />
                <Mgin right={10} />
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.backy(1)
                }} width={120} outlined/>
            </div>
            <Mgin top={20} />
            <div id="lshdw" style={{
                width:'100%',
                padding: dimen.dsk?40:20,
                boxSizing:'border-box',
                borderRadius:10
            }}>
                <mye.BTv text={`Event Title: ${mainprop.event.getTitle()}`} size={22}color={mye.mycol.green} />
                <Mgin top={5} />
                <mye.BTv text={`Date: ${mainprop.event.getStartDate()+' - '+mainprop.event.getEndDate()}`} size={22}color={mye.mycol.green} />
                <Mgin top={5} />
                <mye.BTv text={`${mainprop.event.getVenue()}`} size={22}color={mye.mycol.green} />
            </div>
            <Mgin top={20} />
            <div id="lshdw" style={{
                 width:'100%',
                 padding: dimen.dsk?40:20,
                 boxSizing:'border-box',
                 borderRadius:10
            }}>
                <mye.BTv text={`Description`} size={16}color={mye.mycol.green} />
                <Mgin top={10} />
                <mye.Tv text={mainprop.event.getTheme()} />
            </div>
            <Mgin top={20} />
            <div id="lshdw" style={{
                display:'flex',
                flexDirection:dimen.dsk?'row':'column',
                width:'100%',
                padding: dimen.dsk?40:20,
                boxSizing:'border-box',
                borderRadius:10
            }}>
                <div style={{
                    flex:1
                }}>
                    <mye.BTv text={`Timings`} size={16}color={mye.mycol.green} />
                    <Mgin top={10} />
                    <mye.Tv text={mainprop.event.getStartTime()+' - '+mainprop.event.getEndTime()} />
                    <Mgin top={20} />
                    <mye.BTv text={`Speakers`} size={16}color={mye.mycol.green} />
                    <Mgin top={10} />
                    {
                        mainprop.event.getSpeakers().map((sp, i)=>{
                            return <div key={mykey+i+0.913}>
                                <mye.Tv text={sp} />
                                <Mgin top={5}/>
                            </div>
                        })
                    }
                </div>
                <Mgin top={dimen.dsk?0:20} right={dimen.dsk?20:0} />
                <div style={{
                    flex:1
                }}>
                    <mye.BTv text={`Price of ticket`} size={16}color={mye.mycol.green} />
                    <Mgin top={10} />
                    <mye.Tv text={mainprop.event.getFee()} />
                    <Mgin top={20} />
                    <mye.BTv text={`Banner`} size={16}color={mye.mycol.green} />
                    <Mgin top={10} />
                    <div className="hlc">
                        <FileOpenOutlined style={{
                            fontSize:20,
                            color:mye.mycol.secondarycol
                        }} />
                        <Mgin right={5} />
                        <mye.Tv text={'Program Banner'} size={14} onClick={()=>{
                            goUrl(`${endpoint}/getFile/events/${mainprop.event.getEventId()}`)
                        }} />
                    </div> 
                </div>
            </div>
        </div>
        <PoweredBySSS floaatIt />
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